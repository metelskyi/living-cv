'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';

const techStack = [
  { cat: 'Framework', items: ['Next.js 14 (App Router)', 'TypeScript', 'React 18'] },
  { cat: 'Styling', items: ['Tailwind CSS 3', 'class-variance-authority', 'tailwind-merge'] },
  { cat: 'Auth', items: ['NextAuth.js (GitHub OAuth)'] },
  { cat: 'Animation', items: ['Framer Motion'] },
  { cat: 'Icons', items: ['Lucide React'] },
  { cat: 'PDF (client)', items: ['html2canvas', 'jsPDF'] },
  { cat: 'PDF (server)', items: ['puppeteer-core', '@sparticuz/chromium'] },
  { cat: 'Deploy', items: ['Vercel (Hobby)'] },
  { cat: 'Storage', items: ['GitHub Contents API (cv.json as CMS)'] },
];

export function ForDevsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg terminal-card rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-hacker-green/20">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-hacker-green" />
                <span className="font-mono text-sm text-hacker-green font-bold">
                  for devs — tech stack
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-hacker-cyan/60 hover:text-hacker-green transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {techStack.map((group) => (
                <div key={group.cat}>
                  <p className="font-mono text-xs text-hacker-cyan/70 uppercase tracking-wider mb-1">
                    {'// '}{group.cat}
                  </p>
                  <ul className="space-y-0.5">
                    {group.items.map((item) => (
                      <li key={item} className="font-mono text-sm text-hacker-fg pl-3">
                        <span className="text-hacker-green mr-2">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="pt-4 border-t border-hacker-green/10">
                <p className="font-mono text-xs text-hacker-cyan/50">
                  {'// source: github.com/metelskyi/living-cv'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
