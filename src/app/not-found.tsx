import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap">
      <section className="sec first" aria-labelledby="h-404">
        <div className="lab">
          <h1 id="h-404">Page not found</h1>
        </div>
        <div className="contact">
          <p>That address doesn’t lead anywhere on this site. It may have moved.</p>
          <Link className="lnk" href="/">
            Go to the home page
          </Link>
        </div>
      </section>
    </div>
  );
}
