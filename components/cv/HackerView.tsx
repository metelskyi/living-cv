import { getCV, getTelegramLink, getMailtoLink, getTelLink } from '@/lib/cv';
import { Hero } from './Hero';
import { SkillBar } from './SkillBar';
import { Timeline } from './Timeline';
import { ContactPR } from './ContactPR';
import { LinkedInShare } from './LinkedInShare';
import { ForDevsTrigger } from '@/components/cv/ForDevsTrigger';
import { TerminalLines } from '@/components/decorations/TerminalLines';
import { Mail, Phone, MapPin, Send, Github, Linkedin } from 'lucide-react';

export function HackerView() {
  const cv = getCV();

  return (
    <div className="min-h-screen bg-hacker-bg text-hacker-fg font-sans relative overflow-x-hidden">
      <TerminalLines />

      <div className="relative z-10">
        <Hero
          tagline={cv.hero.tagline}
          subtitle={cv.hero.subtitle}
          stats={cv.stats}
        />

        <SkillBar groups={cv.skillGroups} />

        <Timeline experiences={cv.experiences} />

        <EducationAndMore cv={cv} />

        <ContactPR contacts={cv.personal.contacts} contactsCfg={cv.display.contacts} />

        <LinkedInShare />

        {cv.display.showFooter && <Footer cv={cv} />}
      </div>
    </div>
  );
}

function EducationAndMore({ cv }: { cv: ReturnType<typeof getCV> }) {
  return (
    <section className="py-20 px-6" id="more">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-mono mb-2">
          <span className="text-hacker-cyan">$</span> cat{' '}
          <span className="text-hacker-green">background.txt</span>
        </h2>
        <p className="text-hacker-cyan/60 font-mono text-sm mb-10">
          {'// education • courses • languages • interests'}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Block title="education">
            <div className="space-y-3 font-mono text-sm">
              {cv.education.map((edu) => (
                <div key={`${edu.period}-${edu.institution}`}>
                  <p className="text-hacker-cyan">{edu.period}</p>
                  <p className="text-hacker-fg font-semibold">
                    {edu.institution}
                  </p>
                  {edu.specialty && (
                    <p className="text-hacker-fg/70 text-xs">
                      {edu.specialty}
                      {edu.degree && ` — ${edu.degree}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Block>

          <Block title="courses">
            <div className="space-y-3 font-mono text-sm">
              {cv.courses.map((c) => (
                <div key={`${c.period}-${c.title}`}>
                  <p className="text-hacker-cyan">{c.period}</p>
                  <p className="text-hacker-fg">
                    {c.title}{' '}
                    {c.certificateUrl && (
                      <a
                        href={c.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-hacker-green hover:underline text-xs"
                      >
                        (cert ↗)
                      </a>
                    )}
                  </p>
                  <p className="text-hacker-fg/70 text-xs">{c.provider}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="languages">
            <div className="space-y-2 font-mono text-sm">
              {cv.languages.map((l) => (
                <div
                  key={l.name}
                  className="flex justify-between items-center"
                >
                  <span className="text-hacker-fg">{l.name}</span>
                  <span className="text-hacker-cyan text-xs px-2 py-0.5 rounded bg-hacker-cyan/10 border border-hacker-cyan/30">
                    {l.level}
                  </span>
                </div>
              ))}
            </div>
          </Block>

          <Block title="interests">
            <ul className="space-y-2 font-mono text-sm">
              {cv.interests.map((i) => (
                <li key={i} className="flex items-start gap-2 text-hacker-fg">
                  <span className="text-hacker-green">▸</span>
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </div>
    </section>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="terminal-card rounded-lg p-5">
      <h3 className="font-mono text-sm font-bold text-hacker-green mb-3 uppercase tracking-wider">
        # {title}
      </h3>
      {children}
    </div>
  );
}

function Footer({ cv }: { cv: ReturnType<typeof getCV> }) {
  const c = cv.display.contacts;
  const show = c.showAll;
  return (
    <footer className="py-10 px-6 border-t border-hacker-green/20 mt-10">
      <div className="max-w-5xl mx-auto font-mono text-sm">
        <div className="flex flex-wrap gap-4 mb-6">
          {show && c.showEmail && (
            <FooterItem icon={<Mail className="w-4 h-4" />} label="email" value={cv.personal.contacts.email} href={getMailtoLink(cv.personal.contacts.email)} />
          )}
          {show && c.showPhone && (
            <FooterItem icon={<Phone className="w-4 h-4" />} label="phone" value={cv.personal.contacts.phone} href={getTelLink(cv.personal.contacts.phone)} />
          )}
          {show && c.showTelegram && (
            <FooterItem icon={<Send className="w-4 h-4" />} label="telegram" value={cv.personal.contacts.telegram} href={getTelegramLink(cv.personal.contacts.telegram)} />
          )}
          {show && c.showGithub && cv.personal.contacts.github && (
            <FooterItem icon={<Github className="w-4 h-4" />} label="github" value="@IgorMet" href={cv.personal.contacts.github} />
          )}
          {show && c.showLinkedin && cv.personal.contacts.linkedin && (
            <FooterItem icon={<Linkedin className="w-4 h-4" />} label="linkedin" value="ihor-metelskyi" href={cv.personal.contacts.linkedin} />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-hacker-cyan/60 pt-4 border-t border-hacker-green/10">
          <MapPin className="w-3 h-3" />
          <span>
            {cv.personal.location.city}, {cv.personal.location.country}
          </span>
          <span className="ml-auto">© {new Date().getFullYear()} Ihor Metelskyi</span>
        </div>
        <div className="flex justify-center mt-4">
          <ForDevsTrigger />
        </div>
      </div>
    </footer>
  );
}

function FooterItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex items-start gap-2 p-2 rounded hover:bg-hacker-green/5 transition-colors group flex-1 min-w-[160px]"
    >
      <span className="text-hacker-green mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-hacker-cyan/60 uppercase">{label}</p>
        <p className="text-hacker-fg truncate group-hover:text-hacker-green transition-colors">
          {value}
        </p>
      </div>
    </a>
  );
}
