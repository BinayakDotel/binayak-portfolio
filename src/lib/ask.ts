/**
 * Answers typed questions from the ready-written Q&A. Nothing is generated: the text of the
 * question is matched against each answer's keywords, its question and its answer text, and
 * the best match is shown. Pure functions only, so they can be tested without a browser.
 */
import type { Block, Portfolio, QA } from "./content";

const STOP = new Set(
  `a an the is are am was were be been do does did you your yours i me my we our us can could would will should
   have has had how what which tell about please any some of to in on at for with and or it its this that there
   get got know use used using also just really very much many like want wanna hello hi hey howdy greetings`.split(/\s+/),
);

// Words that mean the same thing for our purposes. The right-hand words also appear as keywords in portfolio.json.
const SYN: Record<string, string[]> = {
  recruiter: ["contact", "hire"], recruit: ["contact", "hire"], vacancy: ["contact", "hire"], opening: ["contact", "hire"],
  phone: ["contact"], chat: ["contact"], schedule: ["contact", "meet"], reach: ["contact"],
  ctc: ["salary"], wage: ["salary"], payment: ["pay"], price: ["rate"],
  résumé: ["resume"], curriculum: ["resume"],
  city: ["location"], country: ["location"], located: ["location", "based"], from: ["location"],
  tz: ["timezone"], wfh: ["remote"], overseas: ["remote"],
  studied: ["education", "study"], qualification: ["education", "degree"], bachelor: ["education", "degree"],
  languages: ["language", "skill"], frameworks: ["framework", "skill"], technologies: ["tech", "skill"], tools: ["tool", "skill"],
  testing: ["test"], tested: ["test"], validate: ["test", "eval"], validation: ["test", "eval"],
  chatbot: ["agent", "ai"], agentic: ["agent"], genai: ["ai", "llm"], gpt: ["llm", "openai"], chatgpt: ["llm", "openai"],
  seeking: ["looking"], interested: ["looking"], goals: ["looking", "next"],
  portfolio: ["project"],
};

const IRREG: Record<string, string> = {
  built: "build", made: "make", ran: "run", remotely: "remot", evaluation: "eval", evaluations: "eval",
  evaluate: "eval", evaluating: "eval", evaluated: "eval", evals: "eval", shipped: "ship",
};

export function stem(w: string): string {
  if (IRREG[w]) return IRREG[w];
  if (w.length <= 3) return w;
  let s = w;
  if (s.endsWith("ies")) s = s.slice(0, -3) + "y";
  else if (s.endsWith("ing") && s.length > 5) s = s.slice(0, -3);
  else if (s.endsWith("ed") && s.length > 4) s = s.slice(0, -2);
  else if (s.endsWith("es") && s.length > 4) s = s.slice(0, -2);
  else if (s.endsWith("s") && !s.endsWith("ss")) s = s.slice(0, -1);
  if (s.length > 3 && s.endsWith("e")) s = s.slice(0, -1);
  return s;
}

/** Lower-case words, stop words removed, reduced to a common stem. */
export function tokens(text: string, expand = false): string[] {
  const words = text
    .toLowerCase()
    .replace(/[.’'`]/g, "")
    .split(/[^a-z0-9#+é]+/)
    .filter((w) => w.length > 1 || w === "c")
    .filter((w) => !STOP.has(w));
  const out = new Set<string>();
  for (const w of words) {
    out.add(stem(w));
    if (expand) for (const x of SYN[w] ?? []) out.add(stem(x));
  }
  return [...out];
}

function blockText(b: Block, data: Portfolio): string {
  switch (b.t) {
    case "p":
    case "h":
    case "src":
      return b.text;
    case "ul":
    case "tags":
      return b.items.join(" ");
    case "experience":
      return data.experience.find((j) => j.id === b.id)?.bullets.join(" ") ?? "";
    case "projects":
      return b.ids.map((id) => data.projects.find((p) => p.id === id)?.desc ?? "").join(" ");
    default:
      return "";
  }
}

export interface Ranked {
  qa: QA;
  /** Score used for ordering. */
  score: number;
  /** Score from the words alone, which is what MIN_SCORE is checked against. */
  raw: number;
}

export interface Index {
  list: QA[];
  keys: Map<string, Set<string>>;
  qtok: Map<string, Set<string>>;
  text: Map<string, Set<string>>;
}

/** The written questions, plus one question per project and per skill so "do you know X?" has an answer. */
export function buildQA(data: Portfolio): QA[] {
  const projectQs: QA[] = data.projects.map((p) => ({
    id: `project-${p.id}`,
    generated: true,
    q: `Tell me about ${p.name}`,
    // "Skills Marketplace" must not answer every question that contains the word "skills".
    keywords: p.id === "skills" ? ["marketplace"] : tokens(p.name),
    phrases: [p.name.toLowerCase()],
    blocks: [
      { t: "h", text: p.name },
      { t: "p", text: p.desc },
      { t: "ul", items: p.did },
      { t: "tags", items: p.stack },
      { t: "link", href: p.repo, text: "View the code" },
    ],
  }));
  const skillQs: QA[] = data.skills.flatMap((g) =>
    g.items.map((s) => ({
      id: `skill-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      generated: true,
      q: `Do you use ${s.name}?`,
      keywords: tokens(s.name),
      blocks: [
        { t: "h", text: s.name } as Block,
        { t: "p", text: s.note } as Block,
        { t: "src", text: `Under “${g.group}” in my skills.` } as Block,
      ],
    })),
  );
  return [...data.qa, ...projectQs, ...skillQs];
}

export function buildIndex(list: QA[], data: Portfolio): Index {
  const keys = new Map<string, Set<string>>();
  const qtok = new Map<string, Set<string>>();
  const text = new Map<string, Set<string>>();
  for (const q of list) {
    keys.set(q.id, new Set(q.keywords.map(stem)));
    qtok.set(q.id, new Set(tokens(q.q)));
    text.set(q.id, new Set(tokens(q.blocks.map((b) => blockText(b, data)).join(" "))));
  }
  return { list, keys, qtok, text };
}

const W_PHRASE = 6;
const W_KEY = 4;
const W_QUESTION = 3;
const W_TEXT = 1;
/** Written answers beat generated ones when the score is close. */
const W_WRITTEN = 2;
/** A match needs at least one keyword or one word from the question itself. */
export const MIN_SCORE = 3;

export function rank(query: string, ix: Index): Ranked[] {
  const q = tokens(query, true);
  const plain = query.toLowerCase().replace(/[’'`]/g, "");
  const out: Ranked[] = [];
  for (const qa of ix.list) {
    let score = 0;
    for (const t of q) {
      if (ix.keys.get(qa.id)!.has(t)) score += W_KEY;
      if (ix.qtok.get(qa.id)!.has(t)) score += W_QUESTION;
      if (ix.text.get(qa.id)!.has(t)) score += W_TEXT;
    }
    for (const ph of qa.phrases ?? []) if (plain.includes(ph)) score += W_PHRASE;
    if (score > 0) out.push({ qa, score: score + (qa.generated ? 0 : W_WRITTEN), raw: score });
  }
  // Higher score first; on a tie the questions shown in the list win.
  return out.sort((a, b) => b.score - a.score || Number(!!b.qa.listed) - Number(!!a.qa.listed));
}

export interface Reply {
  best: QA | null;
  related: QA[];
}

/** Best answer for a typed question, plus up to three other questions worth asking next. */
export function answer(query: string, ix: Index, n = 3): Reply {
  const clean = query.trim();
  const tok = tokens(clean, true);
  const ranked = rank(clean, ix);
  let best: QA | null = null;
  if (ranked[0] && ranked[0].raw >= MIN_SCORE) best = ranked[0].qa;
  // "Hi", "what do you do?" and similar say nothing specific: start with the introduction.
  else if (!tok.length) best = ix.list.find((x) => x.id === "intro") ?? null;

  const related = ranked
    .filter((r) => r.qa.id !== best?.id && r.raw >= (best ? W_QUESTION : 2))
    .map((r) => r.qa);
  for (const l of ix.list.filter((x) => x.listed)) {
    if (related.length >= n) break;
    if (l.id !== best?.id && !related.includes(l)) related.push(l);
  }
  return { best, related: related.slice(0, n) };
}

/** For a question picked from the list: the next few questions worth asking. */
export function relatedTo(id: string, ix: Index, n = 3): QA[] {
  const me = ix.list.find((x) => x.id === id);
  if (!me) return [];
  const ranked = rank(me.q, ix).filter((r) => r.qa.id !== id && r.raw >= MIN_SCORE).map((r) => r.qa);
  const listed = ix.list.filter((x) => x.listed && x.id !== id);
  const out: QA[] = [];
  for (const q of [...ranked, ...listed]) if (!out.includes(q) && out.length < n) out.push(q);
  return out;
}
