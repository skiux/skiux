import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const shortcuts: Array<{ keys: string; label: string; action: () => void }> = [
  { keys: 'G H', label: 'Top', action: () => scrollToHash('#top') },
  { keys: 'G N', label: 'Now', action: () => scrollToHash('#now') },
  { keys: 'G W', label: 'Work', action: () => scrollToHash('#projects') },
  { keys: 'G C', label: 'Colophon', action: () => scrollToHash('#colophon') },
  { keys: '?', label: 'Toggle this panel', action: () => {} },
];

function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function KeyboardHints() {
  const [open, setOpen] = useState(false);
  const [prefix, setPrefix] = useState<string | null>(null);
  const prefixRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearPrefix = () => {
      prefixRef.current = null;
      setPrefix(null);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

      if (e.key === '?') {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === 'Escape') {
        setOpen(false);
        clearPrefix();
        return;
      }

      const k = e.key.toLowerCase();

      if (prefixRef.current === 'g') {
        clearPrefix();
        if (k === 'h') return scrollToHash('#top');
        if (k === 'n') return scrollToHash('#now');
        if (k === 'w') return scrollToHash('#projects');
        if (k === 'c') return scrollToHash('#colophon');
        return;
      }

      if (k === 'g') {
        prefixRef.current = 'g';
        setPrefix('g');
        timerRef.current = setTimeout(clearPrefix, 1200);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      {/* Hint pill, bottom-left, always visible (small) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-charcoal/20 bg-bone/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-charcoal/70 backdrop-blur transition-colors hover:bg-bone hover:text-ink"
        style={{ fontFamily: 'var(--font-mono)' }}
        aria-label="Show keyboard shortcuts"
      >
        <span className="rounded-sm border border-charcoal/30 px-1 py-px">?</span>
        keys
        {prefix && <span className="ml-1 text-ink">G _</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-16 left-4 z-40 w-72 border border-charcoal/15 bg-bone/95 p-5 backdrop-blur"
          >
            <div
              className="mb-3 text-[10px] uppercase tracking-[0.28em] text-warm-gray"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Keyboard
            </div>
            <ul className="space-y-2">
              {shortcuts.map((s) => (
                <li
                  key={s.keys}
                  className="flex items-center justify-between gap-3 text-[12px] text-charcoal"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      s.action();
                      if (s.keys !== '?') setOpen(false);
                    }}
                    className="flex-1 text-left text-charcoal/80 hover:text-ink"
                  >
                    {s.label}
                  </button>
                  <kbd className="rounded-sm border border-charcoal/25 px-1.5 py-0.5 text-[10px] tracking-[0.18em] text-charcoal">
                    {s.keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
