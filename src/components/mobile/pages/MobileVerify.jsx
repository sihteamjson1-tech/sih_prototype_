import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '../../feedback/ConfirmDialog.jsx';
import { ValidationProgress } from '../../feedback/ValidationProgress.jsx';
import { InstitutionForm } from '../../forms/InstitutionForm.jsx';
import { UploadZone } from '../../documents/UploadZone.jsx';
import { useLanguage } from '../../../context/LanguageContext.jsx';
import { usePortal } from '../../../context/PortalContext.jsx';
import { usePageTitle } from '../../../hooks/usePageTitle.js';
import { isDemoMode } from '../../../services/api.js';
import { localChecks, runValidation } from '../../../services/applicationService.js';
import { runUploadProgress } from '../../../services/documentService.js';
import { PIPELINE_STAGES } from '../../../services/validationEngine.js';
import { createId, emptyInstitution, safeFileName, validateInstitution } from '../../../utils/format.js';
import { TYPE_OPTIONS, lifecycleLabel, typeLabel } from '../../../utils/labels.js';
import { buildReport, downloadText } from '../../../utils/report.js';
import { BtnLink, FindingCards, Notice, Screen, StatGrid, summaryStats } from '../MobileUi.jsx';

const STEPS = [
    { en: 'Application type', hi: 'आवेदन प्रकार' },
    { en: 'Institution details', hi: 'संस्थान विवरण' },
    { en: 'Upload documents', hi: 'दस्तावेज़ अपलोड' },
    { en: 'Run validation', hi: 'सत्यापन चलाएँ' },
    { en: 'Results', hi: 'परिणाम' },
];

function blankApplication(type) {
    const now = new Date().toISOString();
    return {
        id: createId('app'),
        type,
        institution: emptyInstitution(),
        documents: [],
        checks: [],
        lifecycle: 'draft',
        priority: 'routine',
        scenario: false,
        origin: 'demonstration',
        createdAt: now,
        updatedAt: now,
    };
}

function delay(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

export function MobileVerify() {
    const { lang } = useLanguage();
    const portal = usePortal();
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const appParam = params.get('application');
    const typeParam = params.get('type');
    const initialType = TYPE_OPTIONS.some((item) => item.id === typeParam) ? typeParam : 'eoa';
    const preset = appParam ? portal.applications.find((item) => item.id === appParam) : undefined;
    const [step, setStep] = useState(preset && preset.checks.length > 0 ? 4 : 0);
    const [currentId, setCurrentId] = useState(preset?.id ?? null);
    const [selectedType, setSelectedType] = useState(preset?.type ?? initialType);
    const [details, setDetails] = useState(preset?.institution ?? emptyInstitution());
    const [fieldErrors, setFieldErrors] = useState({});
    const [acknowledged, setAcknowledged] = useState(false);
    const [running, setRunning] = useState(false);
    const [stage, setStage] = useState(-1);
    const [runError, setRunError] = useState(null);
    const [confirm, setConfirm] = useState(false);
    const [notice, setNotice] = useState('');
    const cancelRef = useRef(false);
    const routeKey = params.toString();
    const [appliedRoute, setAppliedRoute] = useState(routeKey);
    if (routeKey !== appliedRoute) {
        setAppliedRoute(routeKey);
        if (appParam) {
            const found = portal.applications.find((item) => item.id === appParam);
            if (found) {
                setCurrentId(found.id);
                setSelectedType(found.type);
                setDetails(found.institution);
                setStep(found.checks.length > 0 ? 4 : 1);
            }
        }
        else if (typeParam && TYPE_OPTIONS.some((item) => item.id === typeParam)) {
            setSelectedType(typeParam);
            setStep(0);
        }
    }
    const current = portal.applications.find((item) => item.id === currentId) ?? null;
    const hi = lang === 'hi';
    usePageTitle(hi ? 'आवेदन सत्यापन' : 'Application Verification');
    const reach = current?.checks.length ? 4 : step;
    const ensureDraft = () => {
        if (current && current.lifecycle === 'draft') {
            const next = { ...current, type: selectedType, updatedAt: new Date().toISOString() };
            portal.upsert(next);
            return next;
        }
        const created = blankApplication(selectedType);
        portal.upsert(created);
        setCurrentId(created.id);
        setParams({ application: created.id });
        return created;
    };
    const addFiles = async (files, category) => {
        if (!current)
            return;
        for (const file of files) {
            const document = {
                id: createId('doc'),
                name: file.name,
                category,
                size: file.size,
                mimeType: file.type || 'application/octet-stream',
                status: 'uploading',
                progress: 0,
                uploadedAt: new Date().toISOString(),
                preview: 'file',
                pageCount: 1,
            };
            portal.addDocument(current.id, document, file);
            await runUploadProgress((value) => {
                portal.patchDocument(current.id, document.id, {
                    progress: value,
                    status: value >= 100 ? 'uploaded' : 'uploading',
                });
            }, () => cancelRef.current);
        }
    };
    const startRun = async (forceDemo = false) => {
        if (!current || running)
            return;
        setRunError(null);
        setRunning(true);
        setStage(0);
        cancelRef.current = false;
        try {
            if (isDemoMode() || forceDemo) {
                for (let index = 0; index < PIPELINE_STAGES.length; index += 1) {
                    if (cancelRef.current)
                        return;
                    setStage(index);
                    await delay(550);
                }
                const fresh = portal.applications.find((item) => item.id === current.id) ?? current;
                const checks = forceDemo ? localChecks(fresh, portal.rules) : (await runValidation(fresh, portal.rules, new Map())).checks;
                if (!cancelRef.current) {
                    portal.setChecks(fresh.id, checks, 'demonstration');
                    setStep(4);
                }
            }
            else {
                const files = new Map();
                current.documents.forEach((document) => {
                    const file = portal.fileFor(document.id);
                    if (file)
                        files.set(document.id, file);
                });
                const outcome = await runValidation(current, portal.rules, files);
                if (!cancelRef.current) {
                    setStage(PIPELINE_STAGES.length - 1);
                    portal.setChecks(current.id, outcome.checks, outcome.origin);
                    setStep(4);
                }
            }
        }
        catch (error) {
            setStage(-1);
            setRunError(error instanceof Error ? error.message : 'Validation could not be completed.');
        }
        finally {
            setRunning(false);
        }
    };
    return (<Screen title={hi ? 'आवेदन सत्यापन' : 'Application Verification'} lede={hi ? 'आवेदन प्रकार चुनें, विवरण दर्ज करें, दस्तावेज़ जोड़ें, और स्थानीय जाँच चलाएँ।' : 'Select an application type, enter the institution record, add documents, and run the local checks.'}>
      <Notice tone="warning">
        {isDemoMode()
            ? 'Demonstration mode is on. Checks run in this browser. A file is not authentic merely because it was uploaded.'
            : `Live service mode will send this application to ${import.meta.env.VITE_API_BASE_URL}.`}
      </Notice>
      <ol className="m-steps" aria-label="Verification steps">
        {STEPS.map((item, index) => (<li key={item.en}>
            <button type="button" disabled={index > reach} aria-current={index === step ? 'step' : undefined} onClick={() => setStep(index)}>
              <span>{index + 1}</span>
              {hi ? item.hi : item.en}
            </button>
          </li>))}
      </ol>
      {step === 0 ? (<section className="m-stack" style={{ marginTop: 0 }}>
          <div role="radiogroup" aria-label="Application type" className="m-stack" style={{ marginTop: 0 }}>
            {TYPE_OPTIONS.map((option) => (<button key={option.id} type="button" role="radio" aria-checked={selectedType === option.id} className="m-choice" onClick={() => setSelectedType(option.id)}>
                <strong>{hi ? option.hi : option.en}</strong>
                <span>{option.blurb}</span>
              </button>))}
          </div>
          <button type="button" className="m-btn m-btn-primary" onClick={() => {
                const draft = ensureDraft();
                setDetails(draft.institution);
                setStep(1);
            }}>Continue</button>
          <BtnLink to="/verify?application=demo-eoa-00421" variant="secondary">Open the prepared demonstration case</BtnLink>
        </section>) : null}
      {step === 1 ? (<section className="m-card m-form m-stack" style={{ marginTop: 0 }}>
          {Object.keys(fieldErrors).length > 0 ? <Notice tone="danger">Correct the highlighted fields before continuing.</Notice> : null}
          <InstitutionForm value={details} errors={fieldErrors} onChange={setDetails}/>
          <div className="m-actions">
            <button type="button" className="m-btn m-btn-secondary" onClick={() => setStep(0)}>Back</button>
            <button type="button" className="m-btn m-btn-primary" onClick={() => {
                const nextErrors = validateInstitution(details);
                setFieldErrors(nextErrors);
                if (Object.keys(nextErrors).length > 0)
                    return;
                if (!current)
                    return;
                portal.patch(current.id, { institution: details, type: selectedType });
                setStep(2);
            }}>Continue</button>
          </div>
        </section>) : null}
      {step === 2 && current ? (<section className="m-stack" style={{ marginTop: 0 }}>
          <div className="m-upload m-form">
            <UploadZone categories={portal.categories} documents={current.documents} acknowledged={acknowledged} onAcknowledge={setAcknowledged} onAdd={(files, category) => void addFiles(files, category)} onRemove={(id) => portal.removeDocument(current.id, id)} onReplace={(id, file) => {
                const existing = current.documents.find((item) => item.id === id);
                portal.removeDocument(current.id, id);
                void addFiles([file], existing?.category ?? 'other');
            }} onCategory={(id, category) => portal.patchDocument(current.id, id, { category })}/>
          </div>
          <div className="m-actions">
            <button type="button" className="m-btn m-btn-secondary" onClick={() => setStep(1)}>Back</button>
            <button type="button" className="m-btn m-btn-primary" onClick={() => setStep(3)}>Continue</button>
          </div>
        </section>) : null}
      {step === 3 && current ? (<section className="m-card m-stack" style={{ marginTop: 0 }}>
          <ValidationProgress active={stage} running={running} lang={lang} demo={isDemoMode()}/>
          {runError ? (<>
              <Notice tone="danger">{runError}</Notice>
              <button type="button" className="m-btn m-btn-secondary" onClick={() => void startRun(true)}>Use demonstration checks instead</button>
            </>) : null}
          <div className="m-actions">
            <button type="button" className="m-btn m-btn-secondary" onClick={() => setStep(2)} disabled={running}>Back</button>
            <button type="button" className="m-btn m-btn-primary" onClick={() => void startRun(false)} disabled={running}>
              {running ? 'Validation in progress' : 'Run validation'}
            </button>
          </div>
        </section>) : null}
      {step === 4 && current ? (<section className="m-stack" id="findings" style={{ marginTop: 0 }}>
          <Notice>
            {current.origin === 'api'
                ? 'These results were returned by the configured service. Read each reason before acting on a result.'
                : 'Demonstration results. Verified means a local completeness or format check passed. It does not authenticate a document.'}
            {current.scenario ? ' This case uses prepared sample documents.' : ''}
          </Notice>
          <StatGrid items={summaryStats(current)}/>
          <p className="m-muted">
            Status: {lifecycleLabel(current.lifecycle, lang)}. Reference {current.institution.referenceNumber || 'not set'}. {typeLabel(current.type, lang)}.
          </p>
          {notice ? <Notice tone="success">{notice}</Notice> : null}
          <FindingCards checks={current.checks}/>
          <div className="m-actions">
            <button type="button" className="m-btn m-btn-secondary" onClick={() => downloadText(`Pramaan-${safeFileName(current.institution.referenceNumber || current.id)}.txt`, buildReport(current, lang))}>
              Download validation report
            </button>
            <BtnLink to={`/documents?application=${current.id}`} variant="secondary">View detailed findings</BtnLink>
            {current.submittedAt ? (<p className="m-muted">Submission recorded in this demonstration on {new Date(current.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.</p>) : (<button type="button" className="m-btn m-btn-primary" onClick={() => setConfirm(true)} disabled={current.checks.length === 0}>
                Submit for official review
              </button>)}
          </div>
        </section>) : null}
      {confirm && current ? (<ConfirmDialog title="Submit for official review?" body="This records the application in the demonstration session and places it in the reviewing officer queue on this device. It does not transmit documents to AICTE or any government system." confirmLabel="Record submission" cancelLabel="Go back" onClose={() => setConfirm(false)} onConfirm={() => {
                portal.submit(current.id);
                setConfirm(false);
                setNotice('Recorded in this demonstration session. No data has been transmitted to an official AICTE system.');
            }}/>) : null}
      <button type="button" className="m-btn m-btn-ghost" onClick={() => {
            setCurrentId(null);
            setStep(0);
            setDetails(emptyInstitution());
            setNotice('');
            navigate('/verify');
        }}>
        Start another application
      </button>
    </Screen>);
}
