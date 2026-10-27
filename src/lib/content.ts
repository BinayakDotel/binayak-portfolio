import raw from "@/data/portfolio.json";
import { answer, buildIndex, buildQA, relatedTo } from "./ask";

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "tags"; items: string[] }
  | { t: "projects"; ids: string[] }
  | { t: "experience"; id: string }
  | { t: "src"; text: string }
  | { t: "link"; href: string; text: string }
  | { t: "mail" }
  | { t: "links" };

export interface Project {
  id: string;
  name: string;
  kind: string;
  year: string;
  desc: string;
  did: string[];
  stack: string[];
  repo: string;
}

export interface Job {
  id: string;
  years: string;
  title: string;
  org: string;
  summary: string;
  bullets: string[];
}

export interface SkillGroup {
  group: string;
  items: { name: string; note: string }[];
}

export interface QA {
  id: string;
  q: string;
  /** Shown in the question list. Unlisted questions are only found by typing. */
  listed?: boolean;
  /** Built from the projects and skills, not written by hand. */
  generated?: boolean;
  keywords: string[];
  /** Whole phrases that count as a strong match, e.g. a project name. */
  phrases?: string[];
  blocks: Block[];
}

export interface SectionInfo {
  id: "work" | "experience" | "skills" | "ask" | "contact";
  label: string;
  note: string;
}

export interface Portfolio {
  person: {
    name: string;
    email: string;
    location: string;
    github: string;
    linkedin: string;
    resume: string;
  };
  site: { title: string; description: string; url: string };
  hero: {
    headline: string;
    lede: string;
    facts: { label: string; value: string; open?: boolean }[];
  };
  sections: SectionInfo[];
  contact: { intro: string };
  projects: Project[];
  experience: Job[];
  skills: SkillGroup[];
  qa: QA[];
  noAnswer: Block[];
}

export const content = raw as unknown as Portfolio;

/** Prefix for files in /public (Next does not add the basePath to plain links). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${BASE_PATH}${path}`;

export const section = (id: SectionInfo["id"]) =>
  content.sections.find((s) => s.id === id)!;

export const project = (id: string) =>
  content.projects.find((p) => p.id === id);

export const job = (id: string) => content.experience.find((j) => j.id === id);

const all = buildQA(content);
export const index = buildIndex(all, content);

/** Every question that can be answered, written or generated. */
export const allQA = all;
/** The questions shown as buttons. */
export const listedQA = all.filter((q) => q.listed);

export const ask = (text: string) => answer(text, index);
export const suggestAfter = (id: string) => relatedTo(id, index);
