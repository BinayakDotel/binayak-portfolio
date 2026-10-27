import type { Metadata } from "next";
import { section } from "@/lib/content";
import { SkillsGrid, Section } from "@/components/Sections";

export const metadata: Metadata = {
  title: section("skills").label,
  description: section("skills").note || undefined,
};

export default function Page() {
  return (
    <div className="wrap">
      <Section id="skills" asPage>
        <SkillsGrid />
      </Section>
    </div>
  );
}
