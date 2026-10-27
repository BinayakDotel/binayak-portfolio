"use client";

import { useEffect, useState } from "react";
import { applyMode, currentMode, savedMode, toggleMode, type Mode } from "@/lib/mode";
import { Moon, Sun } from "./Icons";

export function ModeToggle() {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    setMode(currentMode());
    const sync = () => setMode(currentMode());
    window.addEventListener("bd-mode", sync);

    // With no saved choice, follow the system setting as it changes.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = (e: MediaQueryListEvent) => {
      if (!savedMode()) applyMode(e.matches ? "dark" : "light", false);
    };
    mq.addEventListener("change", onSystem);
    return () => {
      window.removeEventListener("bd-mode", sync);
      mq.removeEventListener("change", onSystem);
    };
  }, []);

  const label = mode === "dark" ? "Switch to light mode" : mode === "light" ? "Switch to dark mode" : "Switch colour mode";

  return (
    <button className="mode" type="button" aria-label={label} onClick={toggleMode}>
      <Moon />
      <Sun />
    </button>
  );
}
