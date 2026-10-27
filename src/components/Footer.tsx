import { content } from "@/lib/content";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-in">© 2026 {content.person.name}. Built with care in Bhaktapur.</div>
      </div>
    </footer>
  );
}
