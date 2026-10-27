import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content, project } from "@/lib/content";
import { ProjectArt } from "@/components/ProjectArt";

export const dynamicParams = false;

export function generateStaticParams() {
  return content.projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = project((await params).id);
  return p ? { title: p.name, description: p.desc } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const p = project((await params).id);
  if (!p) notFound();
  return (
    <div className="wrap">
      <section className="sec first" aria-labelledby="h-project">
        <div className="lab">
          <p className="crumb">
            <Link href="/work/">← Work</Link>
          </p>
        </div>
        <article className="proj" style={{ padding: 0 }}>
          <div className="art">
            <ProjectArt id={p.id} />
          </div>
          <div>
            <h1 id="h-project">{p.name}</h1>
            <div className="meta">
              {p.kind}, {p.year}
            </div>
            <p>{p.desc}</p>
            <ul className="stack">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <h2 style={{ fontSize: 16.5, margin: "18px 0 6px" }}>What I did</h2>
            <ul className="did">
              {p.did.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <a className="code" href={p.repo}>
              View the code
            </a>
          </div>
        </article>
      </section>
    </div>
  );
}
