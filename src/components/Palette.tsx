"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MIN_SCORE, rank } from "@/lib/ask";
import { ask, content, index, listedQA, suggestAfter, type Block, type QA } from "@/lib/content";
import { currentMode, toggleMode } from "@/lib/mode";
import { Blocks } from "./Blocks";
import { RowIcon, Search, type IconName } from "./Icons";
import { Related } from "./Related";

interface PaletteApi {
  open: () => void;
}

const Ctx = createContext<PaletteApi>({ open: () => {} });
export const usePalette = () => useContext(Ctx);

type Row = {
  group: "Go to" | "Ask" | "Settings";
  label: string;
  icon: IconName;
  run: () => void;
  answer?: Answer;
};

interface Answer {
  title: string;
  blocks: Block[];
  related: QA[];
}

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isOpen) return;
      const el = document.activeElement as HTMLElement | null;
      const typing = !!el && (/INPUT|TEXTAREA|SELECT/.test(el.tagName) || el.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const api = useMemo(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {isOpen && <CommandBar onClose={() => setOpen(false)} />}
    </Ctx.Provider>
  );
}

function CommandBar({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const { person, sections, noAnswer } = content;

  // Freeze the page behind the bar, and give focus back when it closes.
  useEffect(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    const page = document.getElementById("page");
    if (page) page.inert = true;
    inputRef.current?.focus();
    return () => {
      if (page) page.inert = false;
      lastFocus.current?.focus?.();
    };
  }, []);

  const goTo = useCallback(
    (id: string) => {
      onClose();
      if (onHome) window.location.hash = `#${id}`;
      else router.push(`/${id}/`);
    },
    [onClose, onHome, router],
  );

  const rows = useMemo<Row[]>(() => {
    const t = query.trim().toLowerCase();
    const out: Row[] = [];
    const modeWords = /dark|light|mode|theme/.test(t);

    const go: { label: string; icon: IconName; run: () => void }[] = [
      ...sections.map((s) => ({
        label: s.id === "ask" ? "Ask me, on the page" : s.label,
        icon: "page" as IconName,
        run: () => goTo(s.id),
      })),
      {
        label: "Send an email",
        icon: "mail",
        run: () => {
          onClose();
          window.location.href = `mailto:${person.email}`;
        },
      },
      {
        label: "Open GitHub",
        icon: "out",
        run: () => {
          onClose();
          window.open(person.github, "_blank", "noopener");
        },
      },
    ];
    const goRows = go.filter((g) => !t || g.label.toLowerCase().includes(t));
    goRows.forEach((g) => out.push({ group: "Go to", ...g }));

    // With nothing typed, show the listed questions. Otherwise show the best matches from every question.
    const qs: QA[] = t
      ? rank(t, index)
          .filter((r) => r.raw >= MIN_SCORE)
          .slice(0, 5)
          .map((r) => r.qa)
      : listedQA.slice(0, 5);
    qs.forEach((q) =>
      out.push({
        group: "Ask",
        label: q.q,
        icon: "ask",
        run: () => {},
        answer: { title: q.q, blocks: q.blocks, related: suggestAfter(q.id) },
      }),
    );
    if (t && !qs.length && !goRows.length && !modeWords) {
      const free = query.trim();
      const { best, related } = ask(free);
      out.push({
        group: "Ask",
        label: `Ask “${free}”`,
        icon: "ask",
        run: () => {},
        answer: best
          ? { title: best.q, blocks: best.blocks, related }
          : { title: "I don’t have that one", blocks: noAnswer, related },
      });
    }
    const modeLabel = currentMode() === "dark" ? "Switch to light mode" : "Switch to dark mode";
    if (!t || modeWords || modeLabel.toLowerCase().includes(t)) {
      out.push({
        group: "Settings",
        label: modeLabel,
        icon: "mode",
        run: () => {
          onClose();
          toggleMode();
        },
      });
    }
    return out;
  }, [query, sections, noAnswer, person, goTo, onClose]);

  const run = (n: number) => {
    const r = rows[n];
    if (!r) return;
    if (r.answer) {
      setAnswer(r.answer);
      return;
    }
    r.run();
  };

  useEffect(() => {
    if (answer) backRef.current?.focus();
  }, [answer]);

  useEffect(() => {
    document.getElementById(`po${sel}`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const backToSearch = () => {
    setAnswer(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (answer) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!rows.length) return;
      setSel((s) => (s + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(sel);
    }
  };

  let lastGroup = "";

  return (
    <div className="pal" onKeyDown={onKeyDown}>
      <div className="pal-bg" onClick={onClose} />
      <div className="pal-box" role="dialog" aria-modal="true" aria-label="Search or ask">
        {!answer && (
          <div className="pal-in">
            <Search />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSel(0);
              }}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls="plist"
              aria-activedescendant={rows.length ? `po${sel}` : undefined}
              placeholder="Jump to a section, or ask a question"
              aria-label="Search or ask"
              autoComplete="off"
            />
            <kbd>Esc</kbd>
          </div>
        )}
        {!answer && (
          <div className="pal-list" id="plist" role="listbox" aria-label="Results">
            {!rows.length && <div className="none">Nothing matches.</div>}
            {rows.map((r, n) => {
              const heading = r.group !== lastGroup ? <h5 aria-hidden="true">{r.group}</h5> : null;
              lastGroup = r.group;
              return (
                <div key={r.group + r.label} role="presentation">
                  {heading}
                  <button
                    type="button"
                    role="option"
                    id={`po${n}`}
                    aria-selected={n === sel}
                    onMouseMove={() => n !== sel && setSel(n)}
                    onClick={() => run(n)}
                  >
                    <i aria-hidden="true">
                      <RowIcon name={r.icon} />
                    </i>
                    {r.label}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {answer && (
          <div className="pal-ans">
            <button ref={backRef} className="bk" type="button" onClick={backToSearch}>
              ← Back to search
            </button>
            <h3>{answer.title}</h3>
            <div className="ans">
              <Blocks blocks={answer.blocks} />
            </div>
            <Related
              items={answer.related}
              onPick={(q) => setAnswer({ title: q.q, blocks: q.blocks, related: suggestAfter(q.id) })}
            />
          </div>
        )}
        <div className="pal-ft">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> to move
          </span>
          <span>
            <kbd>Enter</kbd> to open
          </span>
        </div>
      </div>
    </div>
  );
}
