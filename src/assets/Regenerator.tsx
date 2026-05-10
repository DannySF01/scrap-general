export const Regenerator = ({
  color,
  size,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle
      cx="50"
      cy="50"
      r="40"
      fill="none"
      stroke={color === "green" ? "#22c55e" : color}
      strokeWidth="4"
      strokeDasharray="20 10"
      opacity="0.6"
    />

    <path
      d="M50 15 L85 50 L50 85 L15 50 Z"
      fill="#064e3b"
      stroke={color === "green" ? "#4ade80" : color}
      strokeWidth="6"
    />

    <circle cx="50" cy="50" r="15" fill="#4ade80">
      <animate
        attributeName="opacity"
        values="0.4;1;0.4"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>

    <path
      d="M50 30 V40 M50 60 V70 M30 50 H40 M60 50 H70"
      stroke="white"
      strokeWidth="2"
      opacity="0.5"
    />
  </svg>
);
