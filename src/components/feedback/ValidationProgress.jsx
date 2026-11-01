import { Check, LoaderCircle } from 'lucide-react';
import { PIPELINE_STAGES } from '../../services/validationEngine.js';
import { cn } from '../../utils/format.js';
export function ValidationProgress({ active, running, lang, demo, }) {
    return (<div>
      <p className="text-sm leading-6 text-ink">
        {demo
            ? 'These stages run in your browser for the demonstration. They do not call an external OCR service or an AICTE register.'
            : 'The configured validation service is being contacted. Stage ticks are not shown until that request finishes.'}
      </p>
      <ol className="mt-4 space-y-2" aria-live="polite">
        {PIPELINE_STAGES.map((stage, index) => {
            const done = active > index || (!running && active >= index && active >= 0);
            const current = running && active === index;
            return (<li key={stage.id} className={cn('flex items-center gap-3 border px-3 py-3 text-sm', current ? 'border-navy bg-[#e8f1f8]' : 'border-line bg-white')}>
              <span className="flex h-7 w-7 items-center justify-center border border-line bg-white text-navy" aria-hidden="true">
                {current ? <LoaderCircle className="h-4 w-4 animate-spin motion-safe:animate-spin"/> : done ? <Check className="h-4 w-4"/> : index + 1}
              </span>
              <span className="font-semibold text-ink">{lang === 'hi' ? stage.hi : stage.en}</span>
              <span className="ml-auto text-xs text-muted">{current ? 'In progress' : done ? 'Complete' : 'Waiting'}</span>
            </li>);
        })}
      </ol>
    </div>);
}
