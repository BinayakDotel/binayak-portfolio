import type { QA } from "@/lib/content";

/** Other questions worth asking after an answer. */
export function Related({ items, onPick }: { items: QA[]; onPick: (q: QA) => void }) {
  if (!items.length) return null;
  return (
    <div className="rel">
      <p>You could also ask</p>
      <div>
        {items.map((q) => (
          <button key={q.id} type="button" onClick={() => onPick(q)}>
            {q.q}
          </button>
        ))}
      </div>
    </div>
  );
}
