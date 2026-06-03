'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save, Send, LogOut, Loader2, Check, AlertCircle, Github, Terminal, Eye } from 'lucide-react';
import type { CV } from '@/types/cv';
import { CVEditor } from '@/components/admin/CVEditor';
import { LivePreview } from '@/components/admin/LivePreview';
import { ForDevsDialog } from '@/components/admin/ForDevsDialog';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cv, setCv] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [forDevsOpen, setForDevsOpen] = useState(false);
  const [visits, setVisits] = useState<{ totalVisits: number; uniqueVisitors: number } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/signin?callbackUrl=/admin');
    }
  }, [status, router]);

  const fetchVisits = useCallback(async () => {
    try {
      const res = await fetch('/api/visits');
      const data = await res.json();
      setVisits(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetch('/api/cv')
      .then((r) => r.json())
      .then((data) => {
        setCv(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    fetchVisits();
    const interval = setInterval(fetchVisits, 30000);
    return () => clearInterval(interval);
  }, [fetchVisits]);

  const handleSave = async () => {
    if (!cv) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/cv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cv),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSaveMsg({ type: 'ok', text: 'cv.json saved' });
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e) {
      setSaveMsg({
        type: 'err',
        text: e instanceof Error ? e.message : 'Save failed',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/publish', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSaveMsg({
        type: 'ok',
        text: data.deployed ? 'Deployment triggered' : 'Webhook not configured — set VERCEL_DEPLOY_HOOK',
      });
    } catch (e) {
      setSaveMsg({
        type: 'err',
        text: e instanceof Error ? e.message : 'Publish failed',
      });
    } finally {
      setPublishing(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hacker-bg">
        <div className="font-mono text-hacker-green flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> loading cv.json...
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-fg">
      <header className="sticky top-0 z-50 bg-hacker-bg/95 backdrop-blur border-b border-hacker-green/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="font-mono text-hacker-green font-bold">
            <span className="text-hacker-cyan">$</span> cv editor
          </h1>
          <span className="font-mono text-xs text-hacker-cyan/60">
            {session.user?.email}
          </span>
          {visits && (
            <span className="font-mono text-xs text-yellow-400/80 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {visits.totalVisits} · {visits.uniqueVisitors} uniq
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {saveMsg && (
              <span
                className={`font-mono text-xs flex items-center gap-1 ${
                  saveMsg.type === 'ok' ? 'text-hacker-green' : 'text-hacker-red'
                }`}
              >
                {saveMsg.type === 'ok' ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {saveMsg.text}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-mono rounded border border-hacker-green/40 bg-hacker-green/10 hover:bg-hacker-green/20 text-hacker-green disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Save
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-mono rounded border border-hacker-cyan/40 bg-hacker-cyan/10 hover:bg-hacker-cyan/20 text-hacker-cyan disabled:opacity-50"
            >
              {publishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Publish
            </button>
            <button
              onClick={() => setForDevsOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-mono rounded border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
            >
              <Terminal className="w-3 h-3" />
              For Devs
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-mono rounded border border-slate-500/40 bg-slate-500/10 hover:bg-slate-500/20 text-slate-300"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {cv && <CVEditor cv={cv} onChange={setCv} />}
        </div>
        <div className="sticky top-20 self-start">
          <h2 className="font-mono text-sm text-hacker-cyan/60 mb-2">
            {'// live preview'}
          </h2>
          <div className="rounded border border-hacker-green/20 overflow-hidden bg-white">
            {cv && <LivePreview cv={cv} />}
          </div>
        </div>
      </div>

      <ForDevsDialog open={forDevsOpen} onClose={() => setForDevsOpen(false)} />
    </div>
  );
}
