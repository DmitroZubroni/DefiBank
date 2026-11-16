// Единый набор кастомных line-иконок студии «Калибр» для DefiBank.
// Заменяет эмодзи-иконки (АI-slop): один стиль, один вес обводки (1.6),
// согласован с палитрой — используется через currentColor.
// Д5: иконка внутри кнопки/бейджа всегда aria-hidden, смысл несёт текст рядом.

const PATHS = {
  vault: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2.4" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 9.3v1.4M12 13.3v1.4M9.3 12h1.4M13.3 12h1.4" />
      <path d="M7 3.5v17M17 3.5v17" opacity="0.5" />
    </>
  ),
  bolt: <path d="M12.9 2.6 5.3 13.4h4.9l-1.1 8 7.6-10.8h-4.9z" />,
  gem: (
    <>
      <path d="M3.5 9 8 3.5h8L20.5 9 12 20.5z" />
      <path d="M3.5 9h17M8 3.5 12 9l4-5.5M8 20.5 12 9l4 11.5" opacity="0.55" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 5.8v5.6c0 5 3.3 7.9 7.5 9.2 4.2-1.3 7.5-4.2 7.5-9.2V5.8z" />
      <path d="m9 12 2.1 2.1L15.5 9.5" />
    </>
  ),
  crown: (
    <>
      <path d="M3.5 17.5h17L19 8l-4 3.5-3-5-3 5-4-3.5z" />
      <path d="M4.5 20h15" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.8L12 12.6 3.5 7.8z" />
      <path d="m3.5 12 8.5 4.8 8.5-4.8M3.5 16.2 12 21l8.5-4.8" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.8a4 4 0 0 1 7.3-2.3" />
    </>
  ),
  wallet: (
    <>
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h11a2 2 0 0 1 2 2v2" />
      <rect x="3.5" y="7.5" width="17" height="11" rx="2" />
      <circle cx="16.3" cy="13" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="M4.5 12.5 9 17l10.5-10.5" />,
  alert: (
    <>
      <path d="M12 3.5 21 19.5H3z" />
      <path d="M12 9.5v4.2M12 16.8h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.2M12 7.8h.01" />
    </>
  ),
  inbox: (
    <>
      <path d="M3.5 12 6 5h12l2.5 7" />
      <path d="M3.5 12v6a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-6h-5l-1.5 2.5h-6L6.5 12z" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.3-4.6M4 13a8 8 0 0 0 14.3 4.6" />
      <path d="M5.2 4v4.4h4.4M18.8 20v-4.4h-4.4" />
    </>
  ),
  arrowRight: <path d="M4.5 12h15M14 6l6 6-6 6" />,
  gauge: (
    <>
      <path d="M4 15.5a8 8 0 0 1 16 0" />
      <path d="M12 15.5 15.3 10" />
      <circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.6, title }) {
  const content = PATHS[name] || PATHS.layers;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {content}
    </svg>
  );
}
