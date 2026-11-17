// Кастомная институциональная иллюстрация «Титановая камера хранилища».
// Полностью инлайн SVG (без растровых ассетов и WebGL/three.js — легче, быстрее,
// не требует GPU) — соответствует требованию «уникальная графика под проект» (О1, О7)
// и бюджету производительности. Состояние door задаёт визуальный статус сейфа:
// управляется родителем (кнопка открыть/закрыть), сам компонент не хранит бизнес-логику.

export default function VaultIllustration({ locked = true, className = '' }) {
  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      role="img"
      aria-label={
        locked
          ? 'Иллюстрация: титановая камера хранилища, сейф заблокирован'
          : 'Иллюстрация: титановая камера хранилища, сейф разблокирован'
      }
    >
      <defs>
        <radialGradient id="vaultGlow" cx="50%" cy="46%" r="60%">
          <stop offset="0%" stopColor={locked ? '#d8bb7b' : '#10b981'} stopOpacity="0.35" />
          <stop offset="55%" stopColor={locked ? '#d8bb7b' : '#10b981'} stopOpacity="0.08" />
          <stop offset="100%" stopColor="#030712" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vaultMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#0b132b" />
        </linearGradient>
        <linearGradient id="vaultMetalLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#718196" />
          <stop offset="32%" stopColor="#34465e" />
          <stop offset="48%" stopColor="#53667c" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      <circle cx="210" cy="196" r="190" fill="url(#vaultGlow)" />

      {/* Внешняя рама */}
      <circle cx="210" cy="196" r="150" fill="url(#vaultMetal)" stroke="#334155" strokeWidth="2" />
      <circle cx="210" cy="196" r="150" fill="none" stroke="#000" strokeOpacity="0.35" strokeWidth="10" />

      {/* Заклёпки по периметру рамы */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = 210 + Math.cos(angle) * 150;
        const y = 196 + Math.sin(angle) * 150;
        return <circle key={i} cx={x} cy={y} r="4.2" fill="#d8bb7b" opacity="0.8" />;
      })}

      {/* Дверь сейфа */}
      <circle cx="210" cy="196" r="128" fill="url(#vaultMetalLight)" stroke="#475569" strokeWidth="1.5" />

      {/* Machined concentric grooves and indexed locking ring. */}
      <g fill="none" stroke="#bac5d1" opacity="0.22">
        {[112, 116, 120, 124].map(r => <circle key={r} cx="210" cy="196" r={r} strokeWidth="0.7" />)}
      </g>
      <g stroke="#d8bb7b" strokeWidth="1.2">
        {Array.from({ length: 48 }, (_, i) => (
          <path key={i} d={`M210 60v${i % 4 === 0 ? 7 : 3}`} transform={`rotate(${i * 7.5} 210 196)`} opacity={i % 4 === 0 ? '.9' : '.45'} />
        ))}
      </g>
      {/* Концентрическая HUD-кольцо статуса */}
      <circle
        cx="210"
        cy="196"
        r="100"
        fill="none"
        stroke={locked ? '#d8bb7b' : '#10b981'}
        strokeWidth="2.5"
        strokeDasharray="4 7"
        opacity="0.85"
        className="vault-ring-spin"
      />
      <circle cx="210" cy="196" r="86" fill="none" stroke="#0f172a" strokeWidth="14" opacity="0.6" />

      {/* Болты блокировки — расходятся наружу, когда сейф разблокирован */}
      <g className={locked ? 'vault-bolts' : 'vault-bolts vault-bolts--retracted'}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = 210 + Math.cos(angle) * 72;
          const y1 = 196 + Math.sin(angle) * 72;
          const x2 = 210 + Math.cos(angle) * 96;
          const y2 = 196 + Math.sin(angle) * 96;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ebd39a" strokeWidth="7" strokeLinecap="round" />
          );
        })}
      </g>

      {/* Центральное колесо-штурвал */}
      <g className="vault-wheel" style={{ transformOrigin: '210px 196px' }}>
        <circle cx="210" cy="196" r="46" fill="none" stroke="#d8bb7b" strokeWidth="5" />
        {Array.from({ length: 4 }).map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          const x = 210 + Math.cos(angle) * 46;
          const y = 196 + Math.sin(angle) * 46;
          return <line key={i} x1="210" y1="196" x2={x} y2={y} stroke="#cbd5e1" strokeWidth="4" />;
        })}
        <circle cx="210" cy="196" r="20" fill="#ead8ae" stroke="#d8bb7b" strokeWidth="3" />
        <circle cx="210" cy="196" r="8" fill={locked ? '#d8bb7b' : '#10b981'} />
      </g>

      {/* Эмблема ERC-4626 внизу камеры */}
      <text
        x="210"
        y="326"
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="12"
        letterSpacing="2"
        fill="#aeb9d6"
      >
        ERC-4626 VAULT
      </text>
    </svg>
  );
}
