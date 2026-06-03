'use client';

import { Terminal } from 'lucide-react';
import { useState } from 'react';
import { ForDevsDialog } from '@/components/admin/ForDevsDialog';

export function ForDevsTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-mono"
      >
        <Terminal className="w-3 h-3" />
        [ for devs ]
      </button>
      <ForDevsDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
