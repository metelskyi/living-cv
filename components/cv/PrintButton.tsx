'use client';

import { FileDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMode } from '@/components/providers/ModeProvider';

export function PrintButton() {
  const { mode, setMode } = useMode();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setFeedback(null);
    const previousMode = mode;
    try {
      document.body.classList.add('print-clean');
      if (mode !== 'classic') {
        setMode('classic');
        await new Promise((r) => setTimeout(r, 600));
      }
      await new Promise((r) => setTimeout(r, 400));

      const el = document.getElementById('cv-classic-content');
      if (!el) throw new Error('CV content not found');

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        onclone: (clonedDoc, clonedEl) => {
          if (!(clonedEl instanceof HTMLElement)) return;
          clonedEl.style.width = '794px';
          const inner = clonedEl.querySelector('.max-w-5xl');
          if (inner instanceof HTMLElement) {
            inner.style.maxWidth = 'none';
            inner.style.margin = '0';
            inner.style.padding = '8px 18px';
          }
          const s = clonedDoc.createElement('style');
          s.textContent = `
            * { line-height: 1.25 !important; }
            h1 { font-size: 13pt !important; margin: 0 !important; }
            h2 { font-size: 9.5pt !important; }
            h3 { font-size: 7.5pt !important; }
            p, li, a, span { font-size: 7pt !important; }
            .text-5xl { font-size: 13pt !important; }
            .text-4xl { font-size: 10px !important; }
            .text-2xl { font-size: 9.5pt !important; }
            .text-xl { font-size: 9pt !important; }
            .text-lg { font-size: 8pt !important; }
            .text-base { font-size: 7pt !important; }
            .text-sm { font-size: 6.5pt !important; }
            .text-xs { font-size: 6pt !important; }
            svg { width: 10px !important; height: 10px !important; }
            header { margin-bottom: 4px !important; padding-bottom: 3px !important; }
            section { margin-bottom: 4px !important; }
            footer { margin-top: 8px !important; padding-top: 3px !important; }
            .gap-6 { gap: 6px !important; }
            .gap-8 { gap: 6px !important; }
            .gap-2 { gap: 3px !important; }
            .gap-x-4 { column-gap: 6px !important; }
            .gap-y-1 { row-gap: 1px !important; }
            .gap-1\\.5 { gap: 2px !important; }
            .space-y-8 > * + * { margin-top: 4px !important; }
            .space-y-4 > * + * { margin-top: 3px !important; }
            .space-y-3 > * + * { margin-top: 2px !important; }
            .space-y-1\\.5 > * + * { margin-top: 1.5px !important; }
            .space-y-1 > * + * { margin-top: 1.5px !important; }
            .mt-10 { margin-top: 6px !important; }
            .mt-3 { margin-top: 3px !important; }
            .mt-1 { margin-top: 1.5px !important; }
            .mt-16 { margin-top: 8px !important; }
            .mb-4 { margin-bottom: 3px !important; }
            .mb-8 { margin-bottom: 4px !important; }
            .mb-3 { margin-bottom: 2px !important; }
            .mb-10 { margin-bottom: 4px !important; }
            .py-12 { padding-top: 4px !important; padding-bottom: 4px !important; }
            .pt-8 { padding-top: 4px !important; }
            .pb-8 { padding-bottom: 3px !important; }
            .pl-6 { padding-left: 6px !important; }
            .w-28, .h-28 { width: 24px !important; height: 24px !important; }
            .border-b-2 { border-bottom-width: 1px !important; }
            .border-l-2 { border-left-width: 1px !important; }
            .ring-4 { display: none !important; }
            .px-2\\.py-0\\.5 { padding: 1px 3px !important; }
            .leading-relaxed { line-height: 1.25 !important; }
          `;
          clonedDoc.head.appendChild(s);
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();

      const iw = pw;
      let ih = (canvas.height * pw) / canvas.width;

      if (ih > ph) {
        const s = ph / ih;
        pdf.addImage(imgData, 'PNG', (pw - iw * s) / 2, 0, iw * s, ph);
      } else {
        pdf.addImage(imgData, 'PNG', 0, (ph - ih) / 2, iw, ih);
      }

      pdf.save('CV_Ihor_Metelskyi.pdf');
      setFeedback({ type: 'ok', text: 'PDF downloaded' });
      setTimeout(() => setFeedback(null), 2500);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'PDF generation failed';
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
        onClick={handleDownload}
        disabled={loading}
        className="h-12 w-12 rounded-full bg-hacker-bg/80 backdrop-blur border border-hacker-cyan/30 flex items-center justify-center text-hacker-cyan hover:border-hacker-cyan hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
        aria-label="Download CV as PDF"
        title="Download as PDF"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <FileDown size={18} />
        )}
      </motion.button>
    </div>
  );
}
