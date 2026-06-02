'use client';

import { Printer, Loader2, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMode } from '@/components/providers/ModeProvider';

export function PrintButton() {
  const { mode, setMode } = useMode();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handlePrint = async () => {
    setLoading(true);
    setFeedback(null);
    const previousMode = mode;
    try {
      document.body.classList.add('print-clean');
      if (mode !== 'classic') {
        setMode('classic');
        await new Promise((r) => setTimeout(r, 350));
      }
      await new Promise((r) => setTimeout(r, 200));
      window.print();
      setFeedback({ type: 'ok', text: 'Print dialog opened' });
      setTimeout(() => setFeedback(null), 2500);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Print failed';
      setFeedback({ type: 'err', text: msg });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setLoading(false);
      setTimeout(() => {
        document.body.classList.remove('print-clean');
        if (mode !== previousMode) setMode(previousMode);
      }, 500);
    }
  };

  return (
    <div className="relative flex flex-col items-end gap-1">
      {feedback && (
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className={`font-mono text-xs px-2 py-1 rounded whitespace-nowrap ${
            feedback.type === 'ok'
              ? 'text-hacker-green bg-hacker-green/10 border border-hacker-green/30'
              : 'text-hacker-red bg-hacker-red/10 border border-hacker-red/30'
          }`}
        >
          {feedback.type === 'ok' ? '✓' : '⚠'} {feedback.text}
        </motion.span>
      )}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrint}
        disabled={loading}
        className="h-12 w-12 rounded-full bg-hacker-bg/80 backdrop-blur border border-hacker-cyan/30 flex items-center justify-center text-hacker-cyan hover:border-hacker-cyan hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
        aria-label="Save CV as PDF (uses browser's Print → Save as PDF)"
        title="Save as PDF — uses your browser's built-in print"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Printer size={18} />
        )}
      </motion.button>
    </div>
  );
}
