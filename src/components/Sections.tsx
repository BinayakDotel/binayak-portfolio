import Link from "next/link";
import { asset, content, section, type SectionInfo } from "@/lib/content";
import { AskPanel } from "./AskPanel";
import { CopyButton } from "./CopyButton";
import { ProjectArt } from "./ProjectArt";
import { Products } from "./Products";

/** One block of the page: a label column on the left, the content on the right. */
export function Section({
  id,
  asPage = false,
  children,
}: {
  id: SectionInfo["id"];
  asPage?: boolean;
  children: React.ReactNode;
}) {
  const s = section(id);
  return (
    <section className={`sec${asPage ? " first" : ""}`} id={id} aria-labelledby={`h-${id}`}>
      <div className="lab">
        {asPage ? (
          <h1 id={`h-${id}`}>{s.label}</h1>
        ) : (
          <h2 id={`h-${id}`}>
            <Link href={`/${id}/`}>{s.label}</Link>
          </h2>
        )}
        {s.note && <small>{s.note}</small>}
      </div>
      {children}
    </section>
  );
}

export function WorkList() {
  return (
    <div>
      {content.projects.map((p) => (
        <article className="proj" key={p.id}>
          <div className="art">
            <ProjectArt id={p.id} />
          </div>
          <div>
            <h3>
              <Link href={`/work/${p.id}/`}>{p.name}</Link>
            </h3>
            <div className="meta">
              {p.kind}, {p.year}
            </div>
            <p>{p.desc}</p>
            <ul className="stack">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <details>
              <summary>What I did</summary>
              <ul>
                {p.did.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </details>
            <a className="code" href={p.repo}>
              View the code
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ExperienceList() {
  return (
    <div>
      {content.experience.map((j) => (
        <article className="job" key={j.id}>
          <div className="y">{j.years}</div>
          <div>
            <h3>{j.title}</h3>
            <p className="o">{j.org}</p>
            <div>{j.summary}</div>
            {j.bullets.length > 0 && (
              <ul>
                {j.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            <Products items={j.products} />
          </div>
        </article>
      ))}
    </div>
  );
}

export function SkillsGrid() {
  return (
    <div className="sk">
      {content.skills.map((g) => (
        <div key={g.group}>
          <h3>{g.group}</h3>
          <dl>
            {g.items.map((s) => (
              <div key={s.name}>
                <dt>{s.name}</dt>
                <dd>{s.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

export function ContactBlock() {
  const { person, contact } = content;
  const short = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  return (
    <div className="contact">
      <p>{contact.intro}</p>
      <ul className="clist">
        <li>
          <span className="k">Email</span>
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <CopyButton text={person.email} label="email address" />
        </li>
        <li>
          <span className="k">LinkedIn</span>
          <a href={person.linkedin}>{short(person.linkedin)}</a>
        </li>
        <li>
          <span className="k">GitHub</span>
          <a href={person.github}>{short(person.github)}</a>
        </li>
        <li>
          <span className="k">Resume</span>
          <a href={asset(person.resume)}>Download as PDF</a>
        </li>
      </ul>
    </div>
  );
}

export function AskBlock() {
  return <AskPanel />;
}
