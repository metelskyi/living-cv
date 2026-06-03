'use client';

import { useState, useRef } from 'react';
import { ChevronDown, User, FileText, Code, Briefcase, GraduationCap, BookOpen, Heart, Plus, Trash2, BarChart3, Eye, Upload } from 'lucide-react';
import type { CV, Experience, SkillGroup, Education, Course, Language } from '@/types/cv';
import { cn } from '@/lib/utils';

interface CVEditorProps {
  cv: CV;
  onChange: (cv: CV) => void;
}

type SectionId = 'personal' | 'summary' | 'hero' | 'stats' | 'skills' | 'softSkills' | 'experience' | 'education' | 'courses' | 'languages' | 'interests' | 'display';

export function CVEditor({ cv, onChange }: CVEditorProps) {
  const [open, setOpen] = useState<Set<SectionId>>(new Set(['personal', 'experience']));

  const toggle = (id: SectionId) => {
    const next = new Set(open);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpen(next);
  };

  return (
    <div className="space-y-2">
      <Section
        id="personal"
        title="Personal"
        icon={<User className="w-4 h-4" />}
        open={open.has('personal')}
        onToggle={() => toggle('personal')}
      >
        <Field
          label="Name"
          value={cv.personal.name}
          onChange={(v) => update(cv, onChange, { personal: { ...cv.personal, name: v } })}
        />
        <Field
          label="Title"
          value={cv.personal.title}
          onChange={(v) => update(cv, onChange, { personal: { ...cv.personal, title: v } })}
        />
        <Field
          label="Email"
          value={cv.personal.contacts.email}
          onChange={(v) => update(cv, onChange, { personal: { ...cv.personal, contacts: { ...cv.personal.contacts, email: v } } })}
        />
        <Field
          label="Phone"
          value={cv.personal.contacts.phone}
          onChange={(v) => update(cv, onChange, { personal: { ...cv.personal, contacts: { ...cv.personal.contacts, phone: v } } })}
        />
        <Field
          label="Telegram"
          value={cv.personal.contacts.telegram}
          onChange={(v) => update(cv, onChange, { personal: { ...cv.personal, contacts: { ...cv.personal.contacts, telegram: v } } })}
        />
        <Field
          label="GitHub URL"
          value={cv.personal.contacts.github || ''}
          onChange={(v) => update(cv, onChange, { personal: { ...cv.personal, contacts: { ...cv.personal.contacts, github: v } } })}
        />
        <Field
          label="LinkedIn URL"
          value={cv.personal.contacts.linkedin || ''}
          onChange={(v) => update(cv, onChange, { personal: { ...cv.personal, contacts: { ...cv.personal.contacts, linkedin: v } } })}
        />
        <Field
          label="City"
          value={cv.personal.location.city}
          onChange={(v) => update(cv, onChange, { personal: { ...cv.personal, location: { ...cv.personal.location, city: v } } })}
        />
        <PhotoUpload
          label="Photo"
          value={cv.personal.photo || ''}
          onChange={(v) => update(cv, onChange, { personal: { ...cv.personal, photo: v } })}
        />
      </Section>

      <Section
        id="summary"
        title="Summary"
        icon={<FileText className="w-4 h-4" />}
        open={open.has('summary')}
        onToggle={() => toggle('summary')}
      >
        <TextArea
          label="Professional Summary"
          value={cv.summary}
          onChange={(v) => update(cv, onChange, { summary: v })}
          rows={4}
        />
      </Section>

      <Section
        id="hero"
        title="Hero (Hacker mode)"
        icon={<FileText className="w-4 h-4" />}
        open={open.has('hero')}
        onToggle={() => toggle('hero')}
      >
        <Field
          label="Tagline line 1"
          value={cv.hero.tagline[0] || ''}
          onChange={(v) => update(cv, onChange, { hero: { ...cv.hero, tagline: [v, cv.hero.tagline[1] || ''] } })}
        />
        <Field
          label="Tagline line 2"
          value={cv.hero.tagline[1] || ''}
          onChange={(v) => update(cv, onChange, { hero: { ...cv.hero, tagline: [cv.hero.tagline[0] || '', v] } })}
        />
        <Field
          label="Subtitle"
          value={cv.hero.subtitle}
          onChange={(v) => update(cv, onChange, { hero: { ...cv.hero, subtitle: v } })}
        />
      </Section>

      <Section
        id="stats"
        title="Stats (Hero cards)"
        icon={<BarChart3 className="w-4 h-4" />}
        open={open.has('stats')}
        onToggle={() => toggle('stats')}
      >
        <div className="grid grid-cols-2 gap-2">
          <Field
            label="Years in IT"
            value={String(cv.stats.yearsInIT)}
            onChange={(v) => update(cv, onChange, { stats: { ...cv.stats, yearsInIT: Number(v) || 0 } })}
          />
          <Field
            label="Companies"
            value={String(cv.stats.companies)}
            onChange={(v) => update(cv, onChange, { stats: { ...cv.stats, companies: Number(v) || 0 } })}
          />
          <Field
            label="Projects"
            value={String(cv.stats.projects)}
            onChange={(v) => update(cv, onChange, { stats: { ...cv.stats, projects: Number(v) || 0 } })}
          />
          <Field
            label="Platforms"
            value={String(cv.stats.platforms)}
            onChange={(v) => update(cv, onChange, { stats: { ...cv.stats, platforms: Number(v) || 0 } })}
          />
          <Field
            label="Test cases authored"
            value={String(cv.stats.testCasesAuthored)}
            onChange={(v) => update(cv, onChange, { stats: { ...cv.stats, testCasesAuthored: Number(v) || 0 } })}
          />
        </div>
      </Section>

      <Section
        id="skills"
        title="Skills"
        icon={<Code className="w-4 h-4" />}
        open={open.has('skills')}
        onToggle={() => toggle('skills')}
      >
        {cv.skillGroups.map((group, gi) => (
          <SkillGroupEditor
            key={gi}
            group={group}
            onChange={(g) => {
              const next = [...cv.skillGroups];
              next[gi] = g;
              update(cv, onChange, { skillGroups: next });
            }}
            onRemove={() => {
              const next = cv.skillGroups.filter((_, i) => i !== gi);
              update(cv, onChange, { skillGroups: next });
            }}
          />
        ))}
        <button
          onClick={() => {
            update(cv, onChange, {
              skillGroups: [...cv.skillGroups, { category: 'New Group', skills: [] }],
            });
          }}
          className="flex items-center gap-1 text-xs font-mono text-hacker-cyan hover:text-hacker-green"
        >
          <Plus className="w-3 h-3" /> Add skill group
        </button>
      </Section>

      <Section
        id="softSkills"
        title="Soft Skills"
        icon={<Heart className="w-4 h-4" />}
        open={open.has('softSkills')}
        onToggle={() => toggle('softSkills')}
      >
        <ListEditor
          items={cv.softSkills}
          onChange={(items) => update(cv, onChange, { softSkills: items })}
          placeholder="Add a soft skill"
        />
      </Section>

      <Section
        id="experience"
        title="Work Experience"
        icon={<Briefcase className="w-4 h-4" />}
        open={open.has('experience')}
        onToggle={() => toggle('experience')}
      >
        {cv.experiences.map((exp) => (
          <ExperienceEditor
            key={exp.id}
            exp={exp}
            onChange={(e) => {
              const next = cv.experiences.map((x) => (x.id === exp.id ? e : x));
              update(cv, onChange, { experiences: next });
            }}
            onRemove={() => {
              const next = cv.experiences.filter((x) => x.id !== exp.id);
              update(cv, onChange, { experiences: next });
            }}
          />
        ))}
        <button
          onClick={() => {
            const id = `exp-${Date.now()}`;
            update(cv, onChange, {
              experiences: [
                ...cv.experiences,
                {
                  id,
                  company: 'Company',
                  project: 'Project',
                  position: 'Position',
                  period: '',
                  periodShort: '',
                  domain: '',
                  responsibilities: [],
                  version: 'v0.0.0',
                  tags: [],
                },
              ],
            });
          }}
          className="flex items-center gap-1 text-xs font-mono text-hacker-cyan hover:text-hacker-green"
        >
          <Plus className="w-3 h-3" /> Add experience
        </button>
      </Section>

      <Section
        id="education"
        title="Education"
        icon={<GraduationCap className="w-4 h-4" />}
        open={open.has('education')}
        onToggle={() => toggle('education')}
      >
        {cv.education.map((edu, i) => (
          <SimpleItemEditor
            key={i}
            label={`Education #${i + 1}`}
            fields={[
              { key: 'period', value: edu.period, label: 'Period', onChange: (v) => updateArrayItem(cv, 'education', i, { ...edu, period: v }, onChange) },
              { key: 'institution', value: edu.institution, label: 'Institution', onChange: (v) => updateArrayItem(cv, 'education', i, { ...edu, institution: v }, onChange) },
              { key: 'specialty', value: edu.specialty || '', label: 'Specialty', onChange: (v) => updateArrayItem(cv, 'education', i, { ...edu, specialty: v }, onChange) },
              { key: 'degree', value: edu.degree || '', label: 'Degree', onChange: (v) => updateArrayItem(cv, 'education', i, { ...edu, degree: v }, onChange) },
            ]}
            onRemove={() => update(cv, onChange, { education: cv.education.filter((_, j) => j !== i) })}
          />
        ))}
        <button
          onClick={() => update(cv, onChange, { education: [...cv.education, { period: '', institution: '' }] })}
          className="flex items-center gap-1 text-xs font-mono text-hacker-cyan hover:text-hacker-green"
        >
          <Plus className="w-3 h-3" /> Add education
        </button>
      </Section>

      <Section
        id="courses"
        title="Courses"
        icon={<BookOpen className="w-4 h-4" />}
        open={open.has('courses')}
        onToggle={() => toggle('courses')}
      >
        {cv.courses.map((c, i) => (
          <SimpleItemEditor
            key={i}
            label={`Course #${i + 1}`}
            fields={[
              { key: 'period', value: c.period, label: 'Period', onChange: (v) => updateArrayItem(cv, 'courses', i, { ...c, period: v }, onChange) },
              { key: 'title', value: c.title, label: 'Title', onChange: (v) => updateArrayItem(cv, 'courses', i, { ...c, title: v }, onChange) },
              { key: 'provider', value: c.provider, label: 'Provider', onChange: (v) => updateArrayItem(cv, 'courses', i, { ...c, provider: v }, onChange) },
              { key: 'certificateUrl', value: c.certificateUrl || '', label: 'Certificate URL', onChange: (v) => updateArrayItem(cv, 'courses', i, { ...c, certificateUrl: v }, onChange) },
            ]}
            onRemove={() => update(cv, onChange, { courses: cv.courses.filter((_, j) => j !== i) })}
          />
        ))}
        <button
          onClick={() => update(cv, onChange, { courses: [...cv.courses, { period: '', title: '', provider: '' }] })}
          className="flex items-center gap-1 text-xs font-mono text-hacker-cyan hover:text-hacker-green"
        >
          <Plus className="w-3 h-3" /> Add course
        </button>
      </Section>

      <Section
        id="languages"
        title="Languages"
        icon={<BookOpen className="w-4 h-4" />}
        open={open.has('languages')}
        onToggle={() => toggle('languages')}
      >
        {cv.languages.map((l, i) => (
          <SimpleItemEditor
            key={i}
            label={`Language #${i + 1}`}
            fields={[
              { key: 'name', value: l.name, label: 'Name', onChange: (v) => updateArrayItem(cv, 'languages', i, { ...l, name: v }, onChange) },
              { key: 'level', value: l.level, label: 'Level', onChange: (v) => updateArrayItem(cv, 'languages', i, { ...l, level: v }, onChange) },
            ]}
            onRemove={() => update(cv, onChange, { languages: cv.languages.filter((_, j) => j !== i) })}
          />
        ))}
        <button
          onClick={() => update(cv, onChange, { languages: [...cv.languages, { name: '', level: '' }] })}
          className="flex items-center gap-1 text-xs font-mono text-hacker-cyan hover:text-hacker-green"
        >
          <Plus className="w-3 h-3" /> Add language
        </button>
      </Section>

      <Section
        id="interests"
        title="Interests"
        icon={<Heart className="w-4 h-4" />}
        open={open.has('interests')}
        onToggle={() => toggle('interests')}
      >
        <ListEditor
          items={cv.interests}
          onChange={(items) => update(cv, onChange, { interests: items })}
          placeholder="Add an interest"
        />
      </Section>

      <Section
        id="display"
        title="Display"
        icon={<Eye className="w-4 h-4" />}
        open={open.has('display')}
        onToggle={() => toggle('display')}
      >
        <Toggle
          label="Show photo avatar (instead of initials)"
          checked={cv.display.showPhoto}
          onChange={(v) => update(cv, onChange, { display: { ...cv.display, showPhoto: v } })}
        />
        <Toggle
          label="Show footer (social networks, copyright)"
          checked={cv.display.showFooter}
          onChange={(v) => update(cv, onChange, { display: { ...cv.display, showFooter: v } })}
        />
        <Toggle
          label="Show social links in header / contact section"
          checked={cv.display.showSocialLinks}
          onChange={(v) => update(cv, onChange, { display: { ...cv.display, showSocialLinks: v } })}
        />
        <Toggle
          label="Show PDF download button"
          checked={cv.display.showPdfButton}
          onChange={(v) => update(cv, onChange, { display: { ...cv.display, showPdfButton: v } })}
        />
      </Section>
    </div>
  );
}

function update(cv: CV, onChange: (c: CV) => void, patch: Partial<CV>) {
  onChange({ ...cv, ...patch });
}

function updateArrayItem<K extends keyof CV>(
  cv: CV,
  key: K,
  i: number,
  value: CV[K] extends (infer U)[] ? U : never,
  onChange: (c: CV) => void
) {
  const arr = cv[key] as unknown as unknown[];
  const next = [...arr];
  next[i] = value;
  onChange({ ...cv, [key]: next } as CV);
}

function Section({
  id,
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="terminal-card rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-2 font-mono text-sm hover:bg-hacker-green/5"
      >
        <span className="text-hacker-green">{icon}</span>
        <span className="text-hacker-fg font-semibold">{title}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 ml-auto text-hacker-cyan transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && <div className="px-4 pb-4 pt-2 space-y-2 border-t border-hacker-green/10">{children}</div>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-mono text-hacker-cyan/70">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-2 py-1.5 text-sm font-mono bg-hacker-bg border border-hacker-green/20 rounded text-hacker-fg focus:border-hacker-green focus:outline-none"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-mono text-hacker-cyan/70">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="mt-1 w-full px-2 py-1.5 text-sm font-mono bg-hacker-bg border border-hacker-green/20 rounded text-hacker-fg focus:border-hacker-green focus:outline-none resize-y"
      />
    </label>
  );
}

function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 px-2 py-1 text-sm font-mono bg-hacker-bg border border-hacker-green/20 rounded text-hacker-fg"
            placeholder={placeholder}
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="p-1 text-hacker-red/60 hover:text-hacker-red"
            aria-label="Remove"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ''])}
        className="flex items-center gap-1 text-xs font-mono text-hacker-cyan hover:text-hacker-green"
      >
        <Plus className="w-3 h-3" /> Add
      </button>
    </div>
  );
}

function SimpleItemEditor({
  label,
  fields,
  onRemove,
}: {
  label: string;
  fields: { key: string; value: string; label: string; onChange: (v: string) => void }[];
  onRemove: () => void;
}) {
  return (
    <div className="p-3 rounded border border-hacker-green/10 bg-hacker-bg/30 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-hacker-cyan/70">{label}</span>
        <button
          onClick={onRemove}
          className="text-hacker-red/60 hover:text-hacker-red"
          aria-label="Remove"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {fields.map((f) => (
        <Field key={f.key} label={f.label} value={f.value} onChange={f.onChange} />
      ))}
    </div>
  );
}

function SkillGroupEditor({
  group,
  onChange,
  onRemove,
}: {
  group: SkillGroup;
  onChange: (g: SkillGroup) => void;
  onRemove: () => void;
}) {
  return (
    <div className="p-3 rounded border border-hacker-green/10 bg-hacker-bg/30 space-y-2">
      <div className="flex items-center gap-2">
        <input
          value={group.category}
          onChange={(e) => onChange({ ...group, category: e.target.value })}
          className="flex-1 px-2 py-1 text-sm font-mono bg-hacker-bg border border-hacker-green/20 rounded text-hacker-green font-bold"
        />
        <button
          onClick={onRemove}
          className="text-hacker-red/60 hover:text-hacker-red"
          aria-label="Remove group"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {group.skills.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            value={s.name}
            onChange={(e) => {
              const next = [...group.skills];
              next[i] = { ...s, name: e.target.value };
              onChange({ ...group, skills: next });
            }}
            className="flex-1 px-2 py-1 text-xs font-mono bg-hacker-bg border border-hacker-green/20 rounded text-hacker-fg"
          />
          <input
            type="number"
            min="0"
            max="100"
            value={s.level}
            onChange={(e) => {
              const next = [...group.skills];
              next[i] = { ...s, level: Number(e.target.value) };
              onChange({ ...group, skills: next });
            }}
            className="w-16 px-1 py-1 text-xs font-mono bg-hacker-bg border border-hacker-green/20 rounded text-hacker-cyan text-center"
          />
          <button
            onClick={() => onChange({ ...group, skills: group.skills.filter((_, j) => j !== i) })}
            className="p-1 text-hacker-red/60 hover:text-hacker-red"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange({ ...group, skills: [...group.skills, { name: '', level: 50 }] })}
        className="flex items-center gap-1 text-xs font-mono text-hacker-cyan hover:text-hacker-green"
      >
        <Plus className="w-3 h-3" /> Add skill
      </button>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer py-1">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? 'bg-hacker-green' : 'bg-hacker-bg border border-hacker-green/30'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      <span className="text-sm font-mono text-hacker-fg">{label}</span>
    </label>
  );
}

function PhotoUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-mono text-hacker-cyan/70">{label}</span>
      {value && (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt="avatar preview"
            className="w-12 h-12 rounded-full object-cover border border-hacker-green/30"
          />
          <button
            onClick={() => onChange('')}
            className="text-xs font-mono text-hacker-red/60 hover:text-hacker-red"
          >
            Remove
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded border border-hacker-green/30 bg-hacker-green/10 hover:bg-hacker-green/20 text-hacker-green"
        >
          <Upload className="w-3 h-3" />
          {value ? 'Change photo' : 'Upload photo'}
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          className="flex-1 px-2 py-1.5 text-xs font-mono bg-hacker-bg border border-hacker-green/20 rounded text-hacker-fg focus:border-hacker-green focus:outline-none"
        />
      </div>
    </div>
  );
}

function ExperienceEditor({
  exp,
  onChange,
  onRemove,
}: {
  exp: Experience;
  onChange: (e: Experience) => void;
  onRemove: () => void;
}) {
  return (
    <div className="p-3 rounded border border-hacker-green/10 bg-hacker-bg/30 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-hacker-green font-bold">
          {exp.position} @ {exp.company}
        </span>
        <button onClick={onRemove} className="text-hacker-red/60 hover:text-hacker-red">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Company" value={exp.company} onChange={(v) => onChange({ ...exp, company: v })} />
        <Field label="Project" value={exp.project} onChange={(v) => onChange({ ...exp, project: v })} />
        <Field label="Position" value={exp.position} onChange={(v) => onChange({ ...exp, position: v })} />
        <Field label="Domain" value={exp.domain} onChange={(v) => onChange({ ...exp, domain: v })} />
        <Field label="Period" value={exp.period} onChange={(v) => onChange({ ...exp, period: v })} />
        <Field label="Period short" value={exp.periodShort} onChange={(v) => onChange({ ...exp, periodShort: v })} />
        <Field label="Version" value={exp.version} onChange={(v) => onChange({ ...exp, version: v })} />
        <Field
          label="Tags (comma)"
          value={exp.tags.join(', ')}
          onChange={(v) => onChange({ ...exp, tags: v.split(',').map((s) => s.trim()).filter(Boolean) })}
        />
      </div>
      <TextArea
        label="Responsibilities (one per line)"
        value={exp.responsibilities.join('\n')}
        onChange={(v) => onChange({ ...exp, responsibilities: v.split('\n').filter(Boolean) })}
        rows={5}
      />
    </div>
  );
}
