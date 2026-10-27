import { asset, content, job, project, type Block } from "@/lib/content";
import { ProjectArt } from "./ProjectArt";

/** Renders an answer. Each block is one paragraph, list, tag row or card set from portfolio.json. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  const { person } = content;
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "h":
            return <h4 key={i}>{b.text}</h4>;
          case "src":
            return (
              <p key={i} className="src">
                {b.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            );
          case "tags":
            return (
              <ul key={i} className="tags">
                {b.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            );
          case "experience": {
            const j = job(b.id);
            return j ? (
              <ul key={i}>
                {j.bullets.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : null;
          }
          case "projects":
            return (
              <div key={i} className="pcs">
                {b.ids.map((id) => {
                  const p = project(id);
                  return p ? (
                    <div key={id} className="pc">
                      <ProjectArt id={id} slice />
                      <div className="t">
                        <b>{p.name}</b>
                        <span>{p.desc}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            );
          case "mail":
            return (
              <p key={i}>
                <a className="lnk" href={`mailto:${person.email}`}>
                  {person.email}
                </a>
              </p>
            );
          case "links":
            return (
              <p key={i} className="alinks">
                <a className="lnk" href={person.github}>
                  GitHub
                </a>
                <a className="lnk" href={person.linkedin}>
                  LinkedIn
                </a>
                <a className="lnk" href={asset(person.resume)}>
                  Resume (PDF)
                </a>
              </p>
            );
        }
      })}
    </>
  );
}
