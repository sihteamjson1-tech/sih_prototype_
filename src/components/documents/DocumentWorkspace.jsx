import { ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { evidenceFor, extractionFor, ocrStatus } from '../../services/documentService.js';
import { buttonClass, formatWhen } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { StatusBadge } from '../feedback/Feedback.jsx';
import { EvidenceScene, Facsimile } from './Facsimile.jsx';
export function DocumentWorkspace({ application, documents, urlFor, }) {
    const { lang } = useLanguage();
    const [selectedId, setSelectedId] = useState(documents[0]?.id ?? '');
    const [page, setPage] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [activeKey, setActiveKey] = useState();
    const selected = documents.find((item) => item.id === selectedId) ?? documents[0];
    if (!selected) {
        return <p className="border border-dashed border-line bg-white px-4 py-8 text-sm text-muted">No document is available to review.</p>;
    }
    const fields = extractionFor(selected, application);
    const evidence = evidenceFor(selected, application);
    const url = urlFor(selected.id);
    const isImage = selected.mimeType.startsWith('image/') && url;
    return (<div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {documents.map((document) => (<button key={document.id} type="button" aria-pressed={document.id === selected.id} className={document.id === selected.id ? buttonClass('primary') : buttonClass('secondary')} onClick={() => {
                setSelectedId(document.id);
                setPage(0);
                setActiveKey(undefined);
            }}>
            {document.name}
          </button>))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border border-line bg-white" aria-label="Document preview">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
            <div className="flex items-center gap-2">
              <button type="button" className={buttonClass('secondary')} onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0}>
                Previous page
              </button>
              <span className="text-sm">
                Page {Math.min(page + 1, selected.pageCount)} of {selected.pageCount}
              </span>
              <button type="button" className={buttonClass('secondary')} onClick={() => setPage((value) => Math.min(selected.pageCount - 1, value + 1))} disabled={page >= selected.pageCount - 1}>
                Next page
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Zoom out" className={buttonClass('secondary')} onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.15).toFixed(2))))}>
                <ZoomOut className="h-4 w-4" aria-hidden="true"/>
              </button>
              <span className="text-sm">{Math.round(zoom * 100)}%</span>
              <button type="button" aria-label="Zoom in" className={buttonClass('secondary')} onClick={() => setZoom((value) => Math.min(1.6, Number((value + 0.15).toFixed(2))))}>
                <ZoomIn className="h-4 w-4" aria-hidden="true"/>
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-2 border-b border-line px-3 py-2 text-xs">
            <div>
              <dt className="text-muted">Document type</dt>
              <dd className="font-semibold">{selected.category}</dd>
            </div>
            <div>
              <dt className="text-muted">OCR status</dt>
              <dd className="font-semibold">{ocrStatus(selected)}</dd>
            </div>
          </dl>
          <div className="max-h-[720px] overflow-auto bg-canvas p-4">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
              {isImage ? (<img src={url} alt={`Uploaded file ${selected.name}`} className="max-w-full border border-line bg-white"/>) : url && selected.mimeType === 'application/pdf' ? (<iframe title={`Preview of ${selected.name}`} src={url} className="h-[640px] w-full border border-line bg-white"/>) : selected.preview === 'scene' ? (<EvidenceScene scene={selected.scene}/>) : selected.preview === 'facsimile' ? (<Facsimile document={selected} application={application} page={page} activeKey={activeKey}/>) : (<div className="border border-line bg-white p-6 text-sm leading-6">
                  <p className="font-semibold text-navy">{selected.name}</p>
                  <p className="mt-2 text-muted">
                    The file is no longer available in this browser session. Upload it again to preview it. Text from the file is not rendered as HTML.
                  </p>
                </div>)}
            </div>
          </div>
        </section>
        <section className="space-y-4" aria-label="Extracted fields and verification evidence">
          <div className="border border-line bg-white p-4">
            <h2 className="text-lg font-semibold text-navy">Extracted fields</h2>
            <p className="mt-1 text-sm text-muted">Select a field to highlight it on a demonstration document, when that document is on screen.</p>
            <ul className="mt-4 divide-y divide-line">
              {fields.map((field) => (<li key={field.key}>
                  <button type="button" className="w-full py-3 text-left" onClick={() => setActiveKey(field.key)}>
                    <span className="block text-xs font-semibold text-muted">{field.label}</span>
                    <span className="mt-1 block text-sm font-semibold text-ink">{field.value}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted">{field.note}</span>
                  </button>
                </li>))}
            </ul>
          </div>
          <div className="border border-line bg-white p-4">
            <h2 className="text-lg font-semibold text-navy">Verification evidence</h2>
            <p className="mt-2 text-sm font-semibold text-navy">{evidence.mode}</p>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold text-muted">Source checked</dt>
                <dd>{evidence.sourceChecked}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">Verification method</dt>
                <dd>{evidence.method}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">Check timestamp</dt>
                <dd>{formatWhen(evidence.timestamp, lang)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">Result</dt>
                <dd className="mt-1"><StatusBadge status={evidence.result}/></dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">Reason</dt>
                <dd className="leading-6">{evidence.reason}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">Evidence reference</dt>
                <dd>{evidence.reference}</dd>
              </div>
            </dl>
            <Link className="mt-4 inline-block text-sm font-semibold text-blue hover:underline" to={`/reports/${application.id}`}>
              Open the validation report
            </Link>
          </div>
        </section>
      </div>
    </div>);
}
