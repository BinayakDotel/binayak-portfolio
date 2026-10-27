"use client";

import { useState } from "react";
import { content, matchQA, type Block } from "@/lib/content";
import { Blocks } from "./Blocks";

interface Shown {
  id: string | null;
  title: string;
  blocks: Block[];
}

export function AskPanel() {
  const [shown, setShown] = useState<Shown | null>(null);
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    setText("");
    const m = matchQA(v);
    setShown(
      m
        ? { id: m.id, title: m.q, blocks: m.blocks }
        : { id: null, title: "I don’t have that one", blocks: content.noAnswer },
    );
  };

  return (
    <div className="ask">
      <div className="aqs" role="group" aria-label="Questions">
        {content.qa.map((q) => (
          <button
            key={q.id}
            type="button"
            aria-current={shown?.id === q.id}
            onClick={() => setShown({ id: q.id, title: q.q, blocks: q.blocks })}
          >
            {q.q}
          </button>
        ))}
      </div>
      <div className="apane">
        <div className="aout" aria-live="polite">
          {shown ? (
            <>
              <h3>{shown.title}</h3>
              <div className="ans">
                <Blocks blocks={shown.blocks} />
              </div>
            </>
          ) : (
            <p className="hint">Choose a question on the left, or type your own below.</p>
          )}
        </div>
        <div className="afoot">
          <form onSubmit={submit}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="Ask a question"
              aria-label="Ask a question"
              autoComplete="off"
            />
            <button type="submit">Ask</button>
          </form>
          <small>
            Tip: press <kbd>/</kbd> anywhere to search or ask.
          </small>
        </div>
      </div>
    </div>
  );
}
