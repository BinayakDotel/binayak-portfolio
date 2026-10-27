"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { content } from "@/lib/content";
import { ModeToggle } from "./ModeToggle";

export function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);

  // On the home page the nav follows the section in view.
  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }
    const spy = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          setActive(en.target.classList.contains("hero") ? null : en.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    document.querySelectorAll(".sec, .hero").forEach((el) => spy.observe(el));
    return () => spy.disconnect();
  }, [onHome]);

  return (
    <header className="top">
      <div className="wrap">
        <Link className="brand" href="/">
          {content.person.name}
        </Link>
        <nav className="nav" aria-label="Sections">
          {content.sections.map((s) =>
            onHome ? (
              <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
                {s.label}
              </a>
            ) : (
              <Link
                key={s.id}
                href={`/${s.id}/`}
                aria-current={pathname.startsWith(`/${s.id}/`) ? "page" : undefined}
              >
                {s.label}
              </Link>
            ),
          )}
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}
