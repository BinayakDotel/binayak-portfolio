"use client";

import { useState } from "react";
import { ask, content, listedQA, suggestAfter, type Block, type QA } from "@/lib/content";
import { Blocks } from "./Blocks";
import { Related } from "./Related";

interface Shown {
  id: string | null;
  title: string;
  blocks: Block[];
  related: QA[];
}

export function AskPanel() {
  const [shown, setShown] = useState<Shown | null>(null);
  const [text, setText] = useState("");

  const showQuestion = (q: QA) =>
    setShown({ id: q.id, title: q.q, blocks: q.blocks, related: suggestAfter(q.id) });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    setText("");
    const { best, related } = ask(v);
    setShown(
      best
        ? { id: best.id, title: best.q, blocks: best.blocks, related: related.length ? related : suggestAfter(best.id) }
        : { id: null, title: "I don’t have that one", blocks: content.noAnswer, related },
    );
  };

  return (
    <div className="ask">
      <div className="aqs" role="group" aria-label="Questions">
        {listedQA.map((q) => (
          <button key={q.id} type="button" aria-current={shown?.id === q.id} onClick={() => showQuestion(q)}>
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
              <Related items={shown.related} onPick={showQuestion} />
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
            Answers are written in advance from my CV and projects. Tip: press <kbd>/</kbd> anywhere to ask from any page.
          </small>
        </div>
      </div>
    </div>
  );
}
