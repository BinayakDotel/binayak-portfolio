"use client";

import { usePalette } from "./Palette";

export function AskButton() {
  const { open } = usePalette();
  return (
    <button className="btn dark" type="button" onClick={open}>
      Ask me anything <kbd>/</kbd>
    </button>
  );
}
