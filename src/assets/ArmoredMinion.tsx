export const ArmoredMinion = ({
  color,
  size,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M15 15 L35 35 M65 65 L85 85 M85 15 L65 35 M35 65 L15 85"
      stroke="#334155"
      strokeWidth="20"
      strokeLinecap="square"
    />

    <path
      d="M50 15 L80 30 L80 70 L50 85 L20 70 L20 30 Z"
      fill={color === "slate" ? "#475569" : color}
      stroke="#0f172a"
      strokeWidth="6"
    />

    <rect x="30" y="45" width="40" height="8" rx="1" fill="#0f172a" />

    <circle cx="20" cy="20" r="5" fill="#1e293b" />
    <circle cx="80" cy="20" r="5" fill="#1e293b" />
    <circle cx="20" cy="80" r="5" fill="#1e293b" />
    <circle cx="80" cy="80" r="5" fill="#1e293b" />

    <path d="M40 25 L60 25" stroke="white" strokeWidth="3" opacity="0.2" />
  </svg>
);
