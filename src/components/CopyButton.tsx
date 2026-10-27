"use client";

import { useEffect, useRef, useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 2000);
    } catch {
      /* clipboard blocked: the address is still a normal link beside the button */
    }
  };

  return (
    <button className="copy" type="button" onClick={copy} aria-label={`Copy ${label}`}>
      <span aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}
