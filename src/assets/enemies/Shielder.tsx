export const Shielder = ({
  color,
  size,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M50 5 L95 30 L95 70 L50 95 L5 70 L5 30 Z"
      fill="none"
      stroke={color === "indigo" ? "#6366f1" : color}
      strokeWidth="4"
      strokeDasharray="8 4"
      opacity="0.5"
    />

    <path
      d="M20 20 H80 V60 L50 90 L20 60 Z"
      fill={color === "indigo" ? "#312e81" : color}
      stroke="#1e1b4b"
      strokeWidth="6"
    />

    <rect x="40" y="35" width="20" height="20" rx="2" fill="#818cf8" />

    <path
      d="M25 30 H75 M25 45 H75 M25 60 L50 80 L75 60"
      stroke="white"
      strokeWidth="2"
      opacity="0.3"
    />

    <rect x="5" y="40" width="10" height="20" rx="2" fill="#1e1b4b" />
    <rect x="85" y="40" width="10" height="20" rx="2" fill="#1e1b4b" />
  </svg>
);
