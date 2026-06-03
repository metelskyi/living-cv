import { getCV, getTelegramLink, getTelLink, getMailtoLink } from '@/lib/cv';
import { Briefcase, GraduationCap, Award, Languages, Heart, BookOpen } from 'lucide-react';

export function ClassicView() {
  const cv = getCV();
  const { personal, summary, skillGroups, softSkills, experiences, education, courses, languages, interests } = cv;

  return (
    <div id="cv-classic-content" className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 print:py-0">
        <Header personal={personal} />

        <Section title="Professional Summary" icon={<BookOpen className="w-5 h-5" />}>
          <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            {summary}
          </p>
        </Section>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="md:col-span-1 space-y-8">
            <Section title="Technical Skills" icon={<Award className="w-5 h-5" />}>
              <div className="space-y-4">
                {skillGroups.map((group) => (
                  <div key={group.category}>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                      {group.category}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {group.skills.map((s) => s.name).join(' • ')}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Soft Skills" icon={<Heart className="w-5 h-5" />}>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                {softSkills.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">▸</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Education" icon={<GraduationCap className="w-5 h-5" />}>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {education.map((edu) => (
                  <div key={`${edu.period}-${edu.institution}`}>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {edu.period}
                    </p>
                    <p>{edu.institution}</p>
                    {edu.specialty && (
                      <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                        {edu.specialty}
                        {edu.degree && ` — ${edu.degree} degree`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Courses" icon={<Award className="w-5 h-5" />}>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                {courses.map((c) => (
                  <div key={`${c.period}-${c.title}`}>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {c.period}
                    </p>
                    <p>
                      {c.title}{' '}
                      {c.certificateUrl && (
                        <a
                          href={c.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          (Certificate ↗)
                        </a>
                      )}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      {c.provider}
                    </p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Languages" icon={<Languages className="w-5 h-5" />}>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                {languages.map((l) => (
                  <li key={l.name} className="flex justify-between gap-2">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {l.level}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Interests" icon={<Heart className="w-5 h-5" />}>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                {interests.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-1">▸</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          <div className="md:col-span-2">
            <Section
              title="Work Experience"
              icon={<Briefcase className="w-5 h-5" />}
            >
              <div className="space-y-8">
                {experiences.map((exp) => (
                  <article
                    key={exp.id}
                    className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                  >
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400 ring-4 ring-white dark:ring-slate-950" />
                    <header className="mb-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {exp.position}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold">
                        {exp.company} — {exp.project}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {exp.period} • {exp.domain}
                      </p>
                    </header>
                    <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-blue-600 dark:text-blue-400 mt-1.5 flex-shrink-0">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </Section>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-500">
          <p>
            References available upon request • Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </footer>
      </div>
    </div>
  );
}

function Header({
  personal,
}: {
  personal: ReturnType<typeof getCV>['personal'];
}) {
  return (
    <header className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {personal.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {personal.name}
          </h1>
          <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-semibold mt-1">
            {personal.title}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
            <a
              href={getTelLink(personal.contacts.phone)}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {personal.contacts.phone}
            </a>
            <a
              href={getMailtoLink(personal.contacts.email)}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {personal.contacts.email}
            </a>
            <a
              href={getTelegramLink(personal.contacts.telegram)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Telegram: {personal.contacts.telegram}
            </a>
            {personal.contacts.linkedin && (
              <a
                href={personal.contacts.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                LinkedIn
              </a>
            )}
            <span>
              {personal.location.city}, {personal.location.country}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b-2 border-blue-600 dark:border-blue-400">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}
