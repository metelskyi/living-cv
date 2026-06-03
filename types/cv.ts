export type SkillLevel = number;

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface ContactInfo {
  phone: string;
  email: string;
  telegram: string;
  github?: string;
  linkedin?: string;
}

export interface Location {
  city: string;
  country: string;
}

export interface Personal {
  name: string;
  title: string;
  photo?: string;
  location: Location;
  contacts: ContactInfo;
}

export interface Experience {
  id: string;
  company: string;
  project: string;
  position: string;
  period: string;
  periodShort: string;
  domain: string;
  responsibilities: string[];
  version: string;
  tags: string[];
}

export interface Education {
  period: string;
  institution: string;
  specialty?: string;
  degree?: string;
}

export interface Course {
  period: string;
  title: string;
  provider: string;
  certificateUrl?: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Hero {
  tagline: string[];
  subtitle: string;
}

export interface CVStats {
  yearsInIT: number;
  companies: number;
  projects: number;
  platforms: number;
  testCasesAuthored: number;
}

export interface Display {
  showFooter: boolean;
  showSocialLinks: boolean;
  showPdfButton: boolean;
  showPhoto: boolean;
}

export interface CV {
  personal: Personal;
  summary: string;
  hero: Hero;
  skillGroups: SkillGroup[];
  softSkills: string[];
  experiences: Experience[];
  education: Education[];
  courses: Course[];
  languages: Language[];
  interests: string[];
  stats: CVStats;
  display: Display;
}

export type ViewMode = 'classic' | 'hacker';
export type ThemeMode = 'light' | 'dark';
