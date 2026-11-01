import { useEffect, useRef } from 'react';
import { buttonClass } from '../../utils/format.js';
export function ConfirmDialog({ title, body, confirmLabel, cancelLabel, onConfirm, onClose, }) {
    const cancelRef = useRef(null);
    useEffect(() => {
        cancelRef.current?.focus();
        const onKey = (event) => {
            if (event.key === 'Escape')
                onClose();
            if (event.key !== 'Tab')
                return;
            const root = cancelRef.current?.closest('[role="dialog"]');
            if (!root)
                return;
            const focusable = [...root.querySelectorAll('button, [href], input, select, textarea')].filter((element) => !element.hasAttribute('disabled'));
            if (focusable.length === 0)
                return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
            }
            else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);
    return (<div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0c2a48]/50 p-4 sm:items-center" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-lg border border-line bg-white p-5 shadow-sm" onMouseDown={(event) => event.stopPropagation()}>
        <h2 id="confirm-title" className="text-lg font-semibold text-navy">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink">{body}</p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button ref={cancelRef} type="button" className={buttonClass('secondary')} onClick={onClose}>
            {cancelLabel}
          </button>
          <button type="button" className={buttonClass('primary')} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>);
}
