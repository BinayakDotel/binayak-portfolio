/** Small illustrations for each project. Colours come from CSS variables, so they follow the theme and the mode. */
export function ProjectArt({ id, slice = false }: { id: string; slice?: boolean }) {
  const common = {
    viewBox: "0 0 340 170",
    role: "img" as const,
    preserveAspectRatio: slice ? "xMidYMid slice" : undefined,
  };
  const bg = <rect width="340" height="170" className="art-bg" />;

  if (id === "dekko")
    return (
      <svg {...common} aria-label="Lines of code and a flow diagram">
        {bg}
        <rect x="30" y="30" width="150" height="9" rx="4.5" className="art-a" />
        <g className="art-b">
          <rect x="30" y="50" width="210" height="9" rx="4.5" />
          <rect x="30" y="68" width="170" height="9" rx="4.5" />
          <rect x="30" y="86" width="230" height="9" rx="4.5" />
        </g>
        <g className="art-c">
          <rect x="30" y="112" width="40" height="28" rx="8" />
          <rect x="100" y="112" width="40" height="28" rx="8" />
          <rect x="170" y="112" width="40" height="28" rx="8" />
        </g>
        <path d="M70 126H100M140 126H170" className="art-sink" fill="none" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );

  if (id === "skills")
    return (
      <svg {...common} aria-label="A grid of skill tiles">
        {bg}
        <rect x="40" y="26" width="76" height="56" rx="12" className="art-a" />
        <rect x="132" y="26" width="76" height="56" rx="12" fill="none" className="art-sline" strokeWidth="3" />
        <rect x="224" y="26" width="76" height="56" rx="12" fill="none" className="art-sline" strokeWidth="3" />
        <rect x="40" y="96" width="76" height="56" rx="12" fill="none" className="art-sline" strokeWidth="3" />
        <rect x="132" y="96" width="76" height="56" rx="12" className="art-c" />
        <rect x="224" y="96" width="76" height="56" rx="12" fill="none" className="art-sline" strokeWidth="3" />
      </svg>
    );

  if (id === "pasal")
    return (
      <svg {...common} aria-label="A phone with a searchable bill list">
        {bg}
        <rect x="120" y="14" width="100" height="148" rx="16" fill="none" className="art-sink" strokeWidth="3" />
        <rect x="136" y="38" width="68" height="8" rx="4" className="art-c" />
        <g className="art-line">
          <rect x="136" y="56" width="52" height="8" rx="4" />
          <rect x="136" y="72" width="62" height="8" rx="4" />
          <rect x="136" y="88" width="44" height="8" rx="4" />
        </g>
        <circle cx="238" cy="104" r="20" fill="none" className="art-sb" strokeWidth="6" />
        <path d="M252 119L270 137" className="art-sb" fill="none" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );

  return (
    <svg {...common} aria-label="Three lanes with colour blocks">
      {bg}
      <g opacity=".35" className="art-line">
        <rect x="40" y="0" width="80" height="170" />
        <rect x="130" y="0" width="80" height="170" />
        <rect x="220" y="0" width="80" height="170" />
      </g>
      <rect x="52" y="20" width="56" height="40" rx="12" className="art-a" />
      <rect x="142" y="62" width="56" height="40" rx="12" className="art-b" />
      <rect x="232" y="30" width="56" height="40" rx="12" className="art-c" />
      <circle cx="170" cy="140" r="13" className="art-ink" />
    </svg>
  );
}
