import React from "react";

interface LogoProps {
  className?: string;
}

/**
 * High-fidelity SVG recreation of the BragBoard Group_D Shield Logo.
 */
const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-xl transition-transform duration-300 hover:scale-105`}
    >
      <defs>
        <linearGradient id="shieldMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <linearGradient id="shieldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="starGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* External Shield Border */}
      <path
        d="M256 20 L440 90 V240 C440 380 256 480 256 480 C256 480 72 380 72 240 V90 L256 20Z"
        fill="url(#shieldBorder)"
      />

      {/* Inner Shield Body */}
      <path
        d="M256 45 L410 105 V235 C410 355 256 445 256 445 C256 445 102 355 102 235 V105 L256 45Z"
        fill="url(#shieldMain)"
        stroke="#3b82f6"
        strokeWidth="4"
      />

      {/* The Gold Star */}
      <path
        d="M256 70 L280 135 H350 L295 175 L315 240 L256 200 L197 240 L217 175 L162 135 H232 L256 70Z"
        fill="url(#starGold)"
        stroke="#fef08a"
        strokeWidth="2"
      />

      {/* BragBoard Text Banner Container */}
      <rect
        x="80"
        y="280"
        width="352"
        height="80"
        rx="12"
        fill="#0f172a"
        stroke="#fbbf24"
        strokeWidth="3"
      />

      {/* Logo Typography */}
      <text
        x="256"
        y="335"
        fontFamily="Inter, sans-serif"
        fontSize="52"
        fill="#fbbf24"
        fontWeight="900"
        textAnchor="middle"
        letterSpacing="-1"
      >
        BRAGBOARD
      </text>

      {/* Group D Subtext */}
      <rect x="160" y="380" width="192" height="30" rx="4" fill="#1e293b" />
      <text
        x="256"
        y="402"
        fontFamily="Inter, sans-serif"
        fontSize="20"
        fill="white"
        fontWeight="700"
        textAnchor="middle"
        letterSpacing="2"
      >
        GROUP_D
      </text>

      {/* Decorative Shine */}
      <path
        d="M120 120 Q200 150 256 120"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.2"
      />
    </svg>
  );
};

export default Logo;
