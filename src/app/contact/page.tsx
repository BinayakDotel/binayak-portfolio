import type { Metadata } from "next";
import { section } from "@/lib/content";
import { ContactBlock, Section } from "@/components/Sections";

export const metadata: Metadata = {
  title: section("contact").label,
  description: section("contact").note || undefined,
};

export default function Page() {
  return (
    <div className="wrap">
      <Section id="contact" asPage>
        <ContactBlock />
      </Section>
    </div>
  );
}
