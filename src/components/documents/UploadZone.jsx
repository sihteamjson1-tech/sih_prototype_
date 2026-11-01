import { Upload } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { buttonClass, cn, fileError, formatBytes } from '../../utils/format.js';
export function UploadZone({ categories, documents, acknowledged, onAcknowledge, onAdd, onRemove, onReplace, onCategory, }) {
    const [category, setCategory] = useState(categories[0]?.id ?? 'other');
    const [dragging, setDragging] = useState(false);
    const [errors, setErrors] = useState([]);
    const inputRef = useRef(null);
    const replaceRef = useRef(null);
    const replaceId = useRef(null);
    const inputId = useId();
    const take = (list) => {
        if (!acknowledged) {
            setErrors(['Confirm the privacy notice before adding files.']);
            return;
        }
        const files = Array.from(list ?? []);
        const nextErrors = files.map((file) => fileError(file)).filter((item) => Boolean(item));
        setErrors(nextErrors);
        const accepted = files.filter((file) => !fileError(file));
        if (accepted.length)
            onAdd(accepted, category);
    };
    return (<div className="space-y-4">
      <div className="border border-line bg-[#fff8ef] p-4 text-sm leading-6 text-ink">
        <p className="font-semibold text-navy">Privacy notice</p>
        <p className="mt-1">
          Files added in this demonstration stay in your browser session. They are not sent to AICTE, DigiLocker, or any other external service while demonstration mode is on. Do not upload genuine personal or institutional records unless you are authorised to process them here.
        </p>
        <label className="mt-3 flex items-start gap-2 font-semibold">
          <input type="checkbox" className="mt-1" checked={acknowledged} onChange={(event) => onAcknowledge(event.target.checked)}/>
          I understand this is a prototype and I should not upload sensitive official records.
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-[240px_1fr]">
        <div>
          <label htmlFor="upload-category" className="mb-1 block text-sm font-semibold">
            Document category
          </label>
          <select id="upload-category" className="w-full rounded-sm border border-line bg-white px-3 py-2 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (<option key={item.id} value={item.id}>
                {item.label}
              </option>))}
          </select>
        </div>
        <div className={cn('border border-dashed bg-white px-4 py-8 text-center', dragging ? 'border-navy bg-[#e8f1f8]' : 'border-line', !acknowledged && 'opacity-70')} onDragOver={(event) => {
            event.preventDefault();
            if (acknowledged)
                setDragging(true);
        }} onDragLeave={() => setDragging(false)} onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            take(event.dataTransfer.files);
        }}>
          <Upload className="mx-auto h-6 w-6 text-navy" aria-hidden="true"/>
          <p className="mt-2 text-sm font-semibold text-navy">Drag and drop files here</p>
          <p className="mt-1 text-xs text-muted">PDF, JPG, JPEG, or PNG. Maximum 10 MB each.</p>
          <input id={inputId} ref={inputRef} className="sr-only" type="file" tabIndex={-1} multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" disabled={!acknowledged} onChange={(event) => {
            take(event.target.files);
            event.target.value = '';
        }}/>
          <button type="button" className={`${buttonClass('secondary')} mt-4`} disabled={!acknowledged} onClick={() => inputRef.current?.click()}>
            Browse files
          </button>
        </div>
      </div>

      {errors.length > 0 ? (<ul className="border border-danger bg-[#fdecee] px-4 py-3 text-sm text-[#7F1824]" role="alert">
          {errors.map((error) => (<li key={error}>{error}</li>))}
        </ul>) : null}

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <caption className="sr-only">Uploaded documents</caption>
          <thead className="bg-[#e8eef4] text-navy">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">Document name</th>
              <th scope="col" className="px-3 py-2 font-semibold">Document category</th>
              <th scope="col" className="px-3 py-2 font-semibold">File size</th>
              <th scope="col" className="px-3 py-2 font-semibold">Upload status</th>
              <th scope="col" className="px-3 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (<tr>
                <td colSpan={5} className="px-3 py-4 text-muted">
                  No documents added yet. Adding a file does not mark it authentic.
                </td>
              </tr>) : (documents.map((document) => (<tr key={document.id} className="border-t border-line align-top">
                  <th scope="row" className="px-3 py-3 font-medium">{document.name}</th>
                  <td className="px-3 py-3">
                    <label className="sr-only" htmlFor={`cat-${document.id}`}>
                      Category for {document.name}
                    </label>
                    <select id={`cat-${document.id}`} className="rounded-sm border border-line bg-white px-2 py-1" value={document.category} onChange={(event) => onCategory(document.id, event.target.value)}>
                      {categories.map((item) => (<option key={item.id} value={item.id}>{item.label}</option>))}
                    </select>
                  </td>
                  <td className="px-3 py-3">{formatBytes(document.size)}</td>
                  <td className="px-3 py-3">
                    {document.status === 'uploading' ? (<div>
                        <p>Uploading {document.progress}%</p>
                        <div className="mt-1 h-1.5 w-28 bg-[#e8eef4]" aria-hidden="true">
                          <div className="h-full bg-navy" style={{ width: `${document.progress}%` }}/>
                        </div>
                      </div>) : (<p>Stored in this session</p>)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-3">
                      <button type="button" className={buttonClass('quiet')} onClick={() => {
                replaceId.current = document.id;
                replaceRef.current?.click();
            }}>
                        Replace
                      </button>
                      <button type="button" className={buttonClass('quiet')} onClick={() => onRemove(document.id)}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>)))}
          </tbody>
        </table>
      </div>
      <input ref={replaceRef} className="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file && replaceId.current) {
                const error = fileError(file);
                if (error)
                    setErrors([error]);
                else
                    onReplace(replaceId.current, file);
            }
            event.target.value = '';
        }}/>
    </div>);
}
