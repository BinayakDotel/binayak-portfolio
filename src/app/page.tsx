import Image from "next/image";
import photo from "@/assets/binayak.jpg";
import { content } from "@/lib/content";
import { AskButton } from "@/components/AskButton";
import {
  AskBlock,
  ContactBlock,
  ExperienceList,
  Section,
  SkillsGrid,
  WorkList,
} from "@/components/Sections";

export default function Home() {
  const { hero, person } = content;
  return (
    <>
      <section className="wrap hero">
        <Image className="ph" src={photo} alt={person.name} width={64} height={64} priority />
        <h1>{hero.headline}</h1>
        <p className="lede">{hero.lede}</p>
        <div className="btns">
          <AskButton />
          <a className="btn" href={`mailto:${person.email}`}>
            Email me
          </a>
        </div>
        <dl className="facts">
          {hero.facts.map((f) => (
            <div key={f.label} className={f.open ? "open" : undefined}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <div className="wrap">
        <Section id="work">
          <WorkList />
        </Section>
        <Section id="experience">
          <ExperienceList />
        </Section>
        <Section id="skills">
          <SkillsGrid />
        </Section>
        <Section id="ask">
          <AskBlock />
        </Section>
        <Section id="contact">
          <ContactBlock />
        </Section>
      </div>
    </>
  );
}
