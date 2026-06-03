'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitPullRequest,
  GitMerge,
  Check,
  Copy,
  Phone,
  Mail,
  Send,
  Linkedin,
} from 'lucide-react';
import type { ContactInfo, Display } from '@/types/cv';
import { getTelLink, getMailtoLink, getTelegramLink } from '@/lib/cv';

export function ContactPR({ contacts, contactsCfg }: { contacts: ContactInfo; contactsCfg: Display['contacts'] }) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = async (text: string) => {
    const ok = await (async () => {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch {
          /* fallback */
        }
      }
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const r = document.execCommand('copy');
        document.body.removeChild(ta);
        return r;
      } catch {
        return false;
      }
    })();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <section className="py-20 px-6" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-mono mb-2">
          <span className="text-hacker-cyan">$</span> gh pr create{' '}
          <span className="text-hacker-green">--assignee ihor</span>
        </h2>
        <p className="text-hacker-cyan/60 font-mono text-sm mb-10">
          {'// ready to collaborate? open a pull request to my inbox.'}
        </p>

        <div className="terminal-card rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-hacker-green/20 flex items-center gap-2 bg-hacker-bg/40">
            <GitPullRequest className="w-4 h-4 text-hacker-green" />
            <span className="font-mono text-sm text-hacker-green font-semibold">
              feat: open position for QA Engineer
            </span>
            <span className="ml-auto font-mono text-xs px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
              draft
            </span>
          </div>

          <div className="p-5 space-y-5 font-mono text-sm">
            <Field label="from" value="your.email@company.com" />
            <Field
              label="to"
              value={contacts.email}
              onCopy={() => handleCopy(contacts.email)}
              copied={copied}
            />

            <div>
              <p className="text-hacker-cyan mb-2">## description</p>
              <p className="text-hacker-fg/90 pl-4 border-l-2 border-hacker-green/30">
                I&apos;m looking for a Senior QA Engineer with your background.
                <br />
                <br />
                <span className="text-hacker-green">## checklist</span>
                <br />
                <span className="text-hacker-green">[x]</span> Manual testing
                experience (web + mobile)
                <br />
                <span className="text-hacker-green">[x]</span> API testing
                (Postman, REST, GraphQL)
                <br />
                <span className="text-hacker-green">[x]</span> IoT or iGaming
                domain knowledge
                <br />
                <span className="text-hacker-green">[x]</span> Available within
                30 days
              </p>
            </div>

            <div className="pt-4 border-t border-hacker-green/20">
              <p className="text-hacker-cyan mb-3">## quick actions</p>
              <div className="flex flex-wrap gap-3">
                {contactsCfg.showAll && contactsCfg.showEmail && (
                  <a href={getMailtoLink(contacts.email)} onClick={() => setSubmitted(true)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-hacker-green/10 hover:bg-hacker-green/20 border border-hacker-green/30 text-hacker-green transition-colors flex-1 min-w-[180px]"
                  >
                    <Mail className="w-4 h-4 shrink-0" /><span className="truncate">Email me</span>
                  </a>
                )}
                {contactsCfg.showAll && contactsCfg.showTelegram && (
                  <a href={getTelegramLink(contacts.telegram)} target="_blank" rel="noopener noreferrer" onClick={() => setSubmitted(true)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-hacker-cyan/10 hover:bg-hacker-cyan/20 border border-hacker-cyan/30 text-hacker-cyan transition-colors flex-1 min-w-[180px]"
                  >
                    <Send className="w-4 h-4 shrink-0" /><span className="truncate">Telegram: {contacts.telegram}</span>
                  </a>
                )}
                {contactsCfg.showAll && contactsCfg.showPhone && (
                  <a href={getTelLink(contacts.phone)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 transition-colors flex-1 min-w-[180px]"
                  >
                    <Phone className="w-4 h-4 shrink-0" /><span className="truncate">{contacts.phone}</span>
                  </a>
                )}
                {contactsCfg.showAll && contactsCfg.showGithub && contacts.github && (
                  <a href={contacts.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 border border-slate-400/30 text-slate-300 transition-colors flex-1 min-w-[180px]"
                  >
                    <GitMerge className="w-4 h-4 shrink-0" /><span className="truncate">GitHub</span>
                  </a>
                )}
                {contactsCfg.showAll && contactsCfg.showLinkedin && contacts.linkedin && (
                  <a href={contacts.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/40 text-[#4d9ee0] transition-colors flex-1 min-w-[180px]"
                  >
                    <Linkedin className="w-4 h-4 shrink-0" /><span className="truncate">LinkedIn: {contacts.linkedin.replace('https://www.linkedin.com/in/', '@')}</span>
                  </a>
                )}
              </div>
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded bg-hacker-green/10 border border-hacker-green/30 text-hacker-green"
              >
                <Check className="w-4 h-4" />
                <span>
                  PR opened. Response SLA: 24h. Looking forward to your message.
                </span>
              </motion.div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-hacker-green/20 flex items-center justify-between bg-hacker-bg/40 font-mono text-xs text-hacker-cyan/60">
            <span>0 conflicts • ready to merge</span>
            <span className="text-hacker-green">✓ all checks pass</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Field({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-hacker-cyan w-12 flex-shrink-0">{label}:</span>
      <code className="text-hacker-fg flex-1 truncate">{value}</code>
      {onCopy && (
        <button
          onClick={onCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-hacker-green/20 rounded"
          aria-label="Copy"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-hacker-green" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-hacker-cyan" />
          )}
        </button>
      )}
    </div>
  );
}
