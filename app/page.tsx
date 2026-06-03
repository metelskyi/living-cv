'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/components/providers/ModeProvider';
import { ClassicView } from '@/components/cv/ClassicView';
import { HackerView } from '@/components/cv/HackerView';
import { ModeToggle } from '@/components/cv/ModeToggle';
import { ThemeToggle } from '@/components/cv/ThemeToggle';
import { PrintButton } from '@/components/cv/PrintButton';
import { getCV } from '@/lib/cv';

export default function HomePage() {
  const { mode, setMode } = useMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/visits', { method: 'POST' }).catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('mode') as 'classic' | 'hacker' | null;
    const isPrint = params.get('print') === 'true';
    if (urlMode === 'classic' || urlMode === 'hacker') {
      setMode(urlMode);
    }
    if (isPrint) {
      document.body.classList.add('print-clean');
    }
  }, [setMode]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="font-mono text-hacker-green animate-pulse">
          <span className="text-hacker-cyan">$</span> loading living-cv...
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {mode === 'classic' ? <ClassicView /> : <HackerView />}
        </motion.div>
      </AnimatePresence>

      <div className="no-print fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {mode === 'classic' && <ThemeToggle />}
        {getCV().display.showPdfButton && <PrintButton />}
        <ModeToggle />
      </div>
    </main>
  );
}
