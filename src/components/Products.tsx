/** Products worked on in a role, each with a link. */
export function Products({ items }: { items?: { name: string; url: string; desc: string }[] }) {
  if (!items?.length) return null;
  return (
    <div className="prods">
      <h4>Products I worked on</h4>
      <ul>
        {items.map((p) => (
          <li key={p.url}>
            <a href={p.url}>{p.name}</a>
            <span>{p.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
