import { MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../../utils/format.js';

const REPLY = 'hi i am your ai assistant for praman login for relevant data';
const MIN_WIDTH = 280;
const MAX_WIDTH = 480;

export function AssistantChat() {
    const titleId = useId();
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [width, setWidth] = useState(320);
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState([{ role: 'assistant', text: REPLY }]);

    useEffect(() => {
        if (!open)
            return undefined;
        inputRef.current?.focus();
    }, [open]);

    useEffect(() => {
        const list = listRef.current;
        if (list)
            list.scrollTop = list.scrollHeight;
    }, [messages, open]);

    function send(event) {
        event.preventDefault();
        const text = draft.trim();
        if (!text)
            return;
        setMessages((current) => [
            ...current,
            { role: 'user', text },
            { role: 'assistant', text: REPLY },
        ]);
        setDraft('');
    }

    function resizeFromLeft(event) {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = width;
        function move(moveEvent) {
            const next = startWidth + (startX - moveEvent.clientX);
            const limit = Math.min(MAX_WIDTH, window.innerWidth - 32);
            setWidth(Math.max(MIN_WIDTH, Math.min(limit, next)));
        }
        function stop() {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', stop);
        }
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', stop);
    }

    return (<div className="no-print fixed right-4 bottom-4 z-50 flex flex-col items-end">
      {open ? (<section aria-labelledby={titleId} className="relative mb-3 flex h-96 max-h-[70vh] flex-col border border-line bg-white shadow-lg" style={{ width }}>
          <button type="button" aria-label="Drag the left edge to resize the chat" className="absolute top-0 bottom-0 left-0 z-10 w-2 cursor-ew-resize" onPointerDown={resizeFromLeft}/>
          <header className="flex items-center justify-between gap-2 bg-navy px-3 py-2 text-white">
            <h2 id={titleId} className="text-sm font-semibold">Pramaan assistant</h2>
            <button type="button" className="inline-flex h-8 w-8 items-center justify-center" aria-label="Close chat" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" aria-hidden="true"/>
            </button>
          </header>
          <div className="min-h-0 flex-1">
            <div ref={listRef} className="h-full space-y-2 overflow-y-auto px-3 py-3">
              {messages.map((message, index) => (<p key={`${message.role}-${index}`} className={cn('max-w-[90%] px-3 py-2 text-sm leading-5', message.role === 'user' ? 'ml-auto bg-navy text-white' : 'bg-canvas text-ink')}>
                  {message.text}
                </p>))}
            </div>
          </div>
          <form className="flex gap-2 border-t border-line p-2" onSubmit={send}>
            <label className="sr-only" htmlFor="assistant-draft">Message</label>
            <input id="assistant-draft" ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a question" className="min-w-0 flex-1 border border-line bg-white px-2 py-2 text-sm text-ink"/>
            <button type="submit" className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-navy text-white" aria-label="Send message">
              <Send className="h-4 w-4" aria-hidden="true"/>
            </button>
          </form>
        </section>) : null}
      <button type="button" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white shadow-lg" aria-expanded={open} aria-label={open ? 'Close assistant chat' : 'Open assistant chat'} onClick={() => setOpen((value) => !value)}>
        {open ? <X className="h-5 w-5" aria-hidden="true"/> : <MessageCircle className="h-5 w-5" aria-hidden="true"/>}
      </button>
    </div>);
}
