/** Light and dark mode. The mode lives on <html data-mode> and the choice is saved in localStorage. */
export type Mode = "light" | "dark";

const KEY = "bd-mode";

/** Runs in <head> before first paint, so the page never flashes the wrong colours. */
export const MODE_SCRIPT = `(function(){var m=null;try{m=localStorage.getItem('${KEY}')}catch(e){}
if(m!=='light'&&m!=='dark')m=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';
document.documentElement.dataset.mode=m})();`;

export function currentMode(): Mode {
  return document.documentElement.dataset.mode === "dark" ? "dark" : "light";
}

export function savedMode(): Mode | null {
  try {
    const m = localStorage.getItem(KEY);
    return m === "light" || m === "dark" ? m : null;
  } catch {
    return null;
  }
}

export function applyMode(mode: Mode, save: boolean) {
  document.documentElement.dataset.mode = mode;
  if (save) {
    try {
      localStorage.setItem(KEY, mode);
    } catch {
      /* private window or blocked storage: the choice just won't be remembered */
    }
  }
  window.dispatchEvent(new Event("bd-mode"));
}

export function toggleMode() {
  applyMode(currentMode() === "dark" ? "light" : "dark", true);
}
