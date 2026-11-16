import React from 'react'

export default function DefiVaultHeroArt({ className = '', width = 360, height = 210 }) {
  return (
    <svg
      viewBox="0 0 360 210"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${className}`}
      role="img"
      aria-label="Atlant DeFi Institutional Vault & Yield Liquidity Illustration"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="defiEmeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="defiGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Gradients */}
        <linearGradient id="vaultOuterGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0B132B" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="vaultInnerGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#064E3B" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="goldCoinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="yieldArcGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="cardDarkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E293B" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* Background Orbital Rings / Smart Contract Network */}
      <circle cx="180" cy="105" r="95" fill="none" stroke="#10B981" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="180" cy="105" r="130" fill="none" stroke="#F59E0B" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="6 8" />

      {/* Main Central Vault Door (Heavy Cryptographic Titanium Lock) */}
      <g transform="translate(180, 105)">
        {/* Outer Bezel */}
        <circle r="66" fill="url(#vaultOuterGrad)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
        <circle r="60" fill="none" stroke="#10B981" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="16 8" />

        {/* Locking Bolt Teeth */}
        <g stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
          <line x1="0" y1="-64" x2="0" y2="-52" />
          <line x1="0" y1="52" x2="0" y2="64" />
          <line x1="-64" y1="0" x2="-52" y2="0" />
          <line x1="52" y1="0" x2="64" y2="0" />
          <line x1="-45" y1="-45" x2="-37" y2="-37" />
          <line x1="37" y1="37" x2="45" y2="45" />
          <line x1="-45" y1="45" x2="-37" y2="37" />
          <line x1="37" y1="-37" x2="45" y2="-45" />
        </g>

        {/* Inner Core Glass Door */}
        <circle r="44" fill="url(#vaultInnerGrad)" stroke="#10B981" strokeWidth="1.5" filter="url(#defiEmeraldGlow)" />

        {/* Central Cryptographic Cipher Lock */}
        <rect x="-16" y="-12" width="32" height="26" rx="6" fill="#0B132B" stroke="#F59E0B" strokeWidth="1.2" />
        <path d="M-8 -12 V -18 C -8 -23, 8 -23, 8 -18 V -12" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="0" cy="0" r="3" fill="#10B981" />
        <line x1="0" y1="3" x2="0" y2="7" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Floating Left Card: APY & Yield Pool Analytics */}
      <g transform="translate(24, 48)">
        <rect
          width="100"
          height="115"
          rx="14"
          fill="url(#cardDarkGrad)"
          stroke="rgba(16, 185, 129, 0.3)"
          strokeWidth="1.2"
        />
        <text x="50" y="20" fill="#94A3B8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">АТЛАНТ ПУЛ 01</text>
        <text x="50" y="38" fill="#10B981" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">14.85%</text>
        <text x="50" y="48" fill="#34D399" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ЧИСТАЯ APY</text>

        {/* Yield Curve Graph */}
        <path
          d="M12 85 Q 35 75, 55 68 T 88 56"
          fill="none"
          stroke="url(#yieldArcGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="88" cy="56" r="3" fill="#F59E0B" filter="url(#defiGoldGlow)" />

        <line x1="12" y1="95" x2="88" y2="95" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
        <text x="50" y="105" fill="#64748B" fontSize="6" textAnchor="middle" fontFamily="monospace">TVL $42.8M</text>
      </g>

      {/* Floating Right Card: Collateral & Health Factor */}
      <g transform="translate(236, 48)">
        <rect
          width="100"
          height="115"
          rx="14"
          fill="url(#cardDarkGrad)"
          stroke="rgba(245, 158, 11, 0.3)"
          strokeWidth="1.2"
        />
        <text x="50" y="20" fill="#94A3B8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HEALTH FACTOR</text>
        <text x="50" y="38" fill="#F59E0B" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">2.45</text>
        <text x="50" y="48" fill="#FBBF24" fontSize="6.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">БЕЗОПАСНО</text>

        {/* Safe Gauge Arc */}
        <circle cx="50" cy="74" r="16" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="3" />
        <circle
          cx="50"
          cy="74"
          r="16"
          fill="none"
          stroke="#10B981"
          strokeWidth="3.5"
          strokeDasharray="100"
          strokeDashoffset="30"
          strokeLinecap="round"
          transform="rotate(-90 50 74)"
        />
        <text x="50" y="77" fill="#F8FAFC" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">70%</text>

        <line x1="12" y1="95" x2="88" y2="95" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
        <text x="50" y="105" fill="#64748B" fontSize="6" textAnchor="middle" fontFamily="monospace">LLTV: 86.0%</text>
      </g>

      {/* Floating Gold Coin / Asset Badge */}
      <g transform="translate(68, 142)">
        <circle cx="16" cy="16" r="14" fill="url(#goldCoinGrad)" filter="url(#defiGoldGlow)" stroke="#FFFBEB" strokeWidth="1" />
        <text x="16" y="20" fill="#78350F" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="monospace">$</text>
      </g>

      {/* Circuit Nodes & Connectors */}
      <circle cx="50" cy="30" r="2" fill="#10B981" opacity="0.8" />
      <circle cx="310" cy="35" r="2" fill="#F59E0B" opacity="0.8" />
      <circle cx="305" cy="180" r="2.5" fill="#06B6D4" opacity="0.7" />
    </svg>
  )
}
