// Инлайн SVG-график доходности хранилищ — замена стоковым графикам.
// Чисто презентационный компонент: принимает готовые точки (label, value) и рисует
// сглаженную кривую с подписями осей. Данные не вычисляются и не хранятся здесь —
// это ответственность экрана, передающего props (Л9: ось от нуля, подписи видимы).
export default function YieldCurveIllustration({ points = [], className = '', height = 160 }) {
  const width = 420;
  const padding = { top: 18, right: 16, bottom: 28, left: 16 };
  const maxVal = Math.max(...points.map((p) => p.value), 1) * 1.15;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const step = points.length > 1 ? innerW / (points.length - 1) : 0;

  const coords = points.map((p, i) => ({
    x: padding.left + step * i,
    y: padding.top + innerH - (p.value / maxVal) * innerH,
    ...p,
  }));

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');

  const areaPath =
    coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padding.top + innerH).toFixed(1)} ` +
        `L ${coords[0].x.toFixed(1)} ${(padding.top + innerH).toFixed(1)} Z`
      : '';

  const describedId = `yield-curve-desc-${points.map((p) => p.label).join('-')}`.replace(/\s+/g, '-');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-labelledby={describedId}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id={describedId}>
        Кривая доходности по хранилищам: {points.map((p) => `${p.label} ${p.value}%`).join(', ')}
      </title>
      <defs>
        <linearGradient id="yieldFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Базовая ось (от нуля) */}
      <line
        x1={padding.left}
        y1={padding.top + innerH}
        x2={width - padding.right}
        y2={padding.top + innerH}
        stroke="rgba(255,255,255,0.14)"
      />

      {areaPath && <path d={areaPath} fill="url(#yieldFill)" />}
      {linePath && <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

      {coords.map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r="4" fill="#030712" stroke="#f59e0b" strokeWidth="2.2" />
          <text x={c.x} y={height - 8} textAnchor="middle" fontSize="10.5" fill="#8c97b8" fontFamily="'JetBrains Mono', monospace">
            {c.label}
          </text>
          <text x={c.x} y={c.y - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbbf6b" fontFamily="'JetBrains Mono', monospace">
            {c.value}%
          </text>
        </g>
      ))}
    </svg>
  );
}
