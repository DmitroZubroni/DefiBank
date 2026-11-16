// Инлайн SVG-индикатор Health Factor (полудуговой гейдж) для экрана «Кредитование».
// Чисто презентационный компонент: принимает готовое числовое значение ratio (0..1,
// где 1 = заёмный лимит LLTV использован полностью) и зоны риска. Расчёт самого
// коэффициента остаётся на стороне экрана/контракта — здесь только отображение
// (Ц6: смысл передаётся одновременно цветом, текстом и позицией, не только цветом).
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function zoneFor(ratio) {
  if (ratio >= 0.9) return { tone: '#fb7185', label: 'Высокий риск' };
  if (ratio >= 0.65) return { tone: '#f59e0b', label: 'Умеренный риск' };
  return { tone: '#10b981', label: 'Безопасно' };
}

export default function HealthFactorGauge({ ratio = 0, className = '', caption }) {
  const r = clamp(ratio, 0, 1);
  const zone = zoneFor(r);
  const cx = 110;
  const cy = 100;
  const radius = 80;
  const startAngle = Math.PI; // 180deg (left)
  const endAngle = 0; // 0deg (right) — верхняя полудуга
  const angle = startAngle - r * (startAngle - endAngle);

  const toXY = (a) => ({ x: cx + Math.cos(a) * radius, y: cy - Math.sin(a) * radius });
  const start = toXY(startAngle);
  const needle = toXY(angle);

  const trackPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
  const circumference = Math.PI * radius;
  const dash = circumference * r;

  const describedId = `hf-desc-${Math.round(r * 100)}`;

  return (
    <svg viewBox="0 0 220 128" className={className} role="img" aria-labelledby={describedId}>
      <title id={describedId}>
        {`Health Factor: ${Math.round(r * 100)}% использованного лимита — ${zone.label}`}
      </title>
      <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" strokeLinecap="round" />
      <path
        d={trackPath}
        fill="none"
        stroke={zone.tone}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
      />
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="#f8fafc" />
      <text x={cx} y={cy - 18} textAnchor="middle" fontSize="20" fontWeight="700" fill="#f8fafc" fontFamily="'Space Grotesk', sans-serif">
        {Math.round(r * 100)}%
      </text>
      {caption && (
        <text x={cx} y={cy + 1} textAnchor="middle" fontSize="9.5" fill="#8c97b8" fontFamily="'JetBrains Mono', monospace" dy="18">
          {caption}
        </text>
      )}
    </svg>
  );
}

export { zoneFor };
