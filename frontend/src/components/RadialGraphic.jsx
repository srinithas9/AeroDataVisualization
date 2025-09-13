import React from 'react';

const COLORS = [
  '#cfe8ff', '#bfe0ff', '#a5d6ff', '#78c6ff', '#47aefc',
  '#2d86e6', '#1f61c9', '#153f9d'
];

export default function RadialGraphic({ size = 380 }) {
  const cx = size / 2;
  const cy = size / 2;
  const segments = 32;
  const innerR = size * 0.22;
  const maxLen = size * 0.28;

  const bars = Array.from({ length: segments }).map((_, i) => {
    const angle = (360 / segments) * i;
    // vary length across slices for organic look
    const len = maxLen * (0.45 + 0.55 * Math.abs(Math.sin(i * 0.7)));
    const w = Math.max(6, Math.round(size * 0.03));
    const color = COLORS[i % COLORS.length];
    // we'll draw rects and rotate them around center
    const x = cx - w / 2;
    const y = cy - innerR - len;
    return (
      <rect
        key={i}
        x={x}
        y={y}
        width={w}
        height={len}
        rx={3}
        transform={`rotate(${angle} ${cx} ${cy})`}
        fill={color}
        opacity={0.95}
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="decorative radial visualization">
      <defs>
        <radialGradient id="g1" cx="50%" cy="50%">
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="95%" stopColor="#e7f0ff" stopOpacity="0.65" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow ring */}
      <circle cx={cx} cy={cy} r={size * 0.36} fill="none" stroke="#dff0ff" strokeOpacity="0.35" strokeWidth={8} />

      {/* radial bars */}
      {bars}

      {/* central disk */}
      <circle cx={cx} cy={cy} r={innerR} fill="url(#g1)" filter="url(#glow)" />
    </svg>
  );
}
