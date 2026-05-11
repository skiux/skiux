import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { site } from '../content/site';

type Cmd = { id: string; label: string; hint?: string; run: () => void };

function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * ⌘K command palette. Listens globally for cmd/ctrl-K to toggle.
 * Filters a short command list (nav entries + a couple of meta commands).
 * Enter selects highlighted; arrow keys move highlight; esc closes.
 */
export default function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean | ((p: boolean) => boolean)) => void;
}) {
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: Cmd[] = useMemo(() => {
    const routeCmds: Cmd[] = site.nav.map((n) => ({
      id: 'route:' + n.href,
      label: 'Go to ' + n.label + (n.soon ? ' (soon)' : ''),
      hint: n.href,
      run: () => navigate(n.href),
    }));
    const anchorCmds: Cmd[] = site.homeAnchors.map((a) => ({
      id: 'anchor:' + a.href,
      label: 'Jump · ' + a.label,
      hint: a.href,
      run: () => {
        if (window.location.pathname !== '/') {
          navigate('/' + a.href);
        } else {
          scrollTo(a.href);
        }
      },
    }));
    const meta: Cmd[] = [
      { id: 'open:github', label: 'Open GitHub', hint: site.github, run: () => window.open(site.github, '_blank') },
      { id: 'copy:email', label: 'Copy email', hint: site.email, run: () => navigator.clipboard?.writeText(site.email) },
      { id: 'top', label: 'Scroll to top', hint: 'home', run: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
      { id: 'bottom', label: 'Scroll to bottom', hint: 'end', run: () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }) },
    ];
    return [...routeCmds, ...anchorCmds, ...meta];
  }, [navigate]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(s) || c.hint?.toLowerCase().includes(s));
  }, [q, commands]);

  // global toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  // focus input when opened, reset state
  useEffect(() => {
    if (open) {
      setQ('');
      setHi(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    setHi(0);
  }, [q]);

  const choose = (cmd: Cmd) => {
    cmd.run();
    setOpen(false);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHi((h) => Math.min(filtered.length - 1, h + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHi((h) => Math.max(0, h - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[hi];
      if (cmd) choose(cmd);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[70] flex items-start justify-center p-6 pt-[18vh] md:p-10 md:pt-[16vh]"
          onClick={() => setOpen(false)}
        >
          <div aria-hidden className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]" />
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl border border-hairline bg-bone shadow-[0_24px_60px_rgba(20,17,13,0.18)]"
          >
            {/* Top bar — log-line like */}
            <div
              className="flex items-baseline justify-between border-b border-hairline px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-ash/75"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span>command :: palette</span>
              <span>esc</span>
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
              <span
                className="text-[12px] text-ash/75"
                style={{ fontFamily: 'var(--font-mono)' }}
                aria-hidden
              >
                ▸
              </span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="search · jump · do"
                className="w-full bg-transparent text-[16px] tracking-tight text-charcoal placeholder-warm-gray/70 outline-none"
                style={{ fontFamily: 'var(--font-serif)' }}
              />
            </div>

            {/* Results */}
            <ul className="max-h-[42vh] overflow-y-auto py-1" role="listbox">
              {filtered.length === 0 && (
                <li
                  className="px-4 py-3 text-[12px] text-ash/75"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  no match — try another word
                </li>
              )}
              {filtered.map((c, i) => (
                <li
                  key={c.id}
                  role="option"
                  aria-selected={i === hi}
                  onMouseEnter={() => setHi(i)}
                  onClick={() => choose(c)}
                  data-cursor="link"
                  className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-[13px] ${
                    i === hi ? 'bg-paper text-ink' : 'text-charcoal'
                  }`}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span className="flex items-center gap-3 truncate">
                    <span className={i === hi ? 'text-ink' : 'text-ash/75'}>›</span>
                    <span className="truncate">{c.label}</span>
                  </span>
                  {c.hint && <span className="hidden truncate text-[10px] uppercase tracking-[0.22em] text-ash/75 md:inline">{c.hint}</span>}
                </li>
              ))}
            </ul>

            {/* Footer hint */}
            <div
              className="flex items-center justify-between border-t border-hairline px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-ash/75"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <span>↑↓ navigate · ⏎ select</span>
              <span>{filtered.length} cmd</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
