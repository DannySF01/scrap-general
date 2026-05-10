export const Overlord = ({
  color,
  size,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M10 30 L50 5 L90 30 L90 70 L50 95 L10 70 Z"
      fill="#1e293b"
      stroke={color || "#f59e0b"}
      strokeWidth="4"
    />

    <rect
      x="35"
      y="35"
      width="30"
      height="30"
      rx="4"
      fill="#451a03"
      stroke="#f59e0b"
      strokeWidth="2"
    />

    <rect x="20" y="40" width="10" height="10" fill="#0f172a" />
    <rect x="70" y="40" width="10" height="10" fill="#0f172a" />
    <rect x="45" y="75" width="10" height="10" fill="#0f172a" />

    <rect x="40" y="45" width="20" height="5" fill="#fbbf24">
      <animate
        attributeName="opacity"
        values="0.3;1;0.3"
        dur="1s"
        repeatCount="indefinite"
      />
    </rect>

    <path d="M50 5 V-10 M40 8 V-5 M60 8 V-5" stroke="#f59e0b" strokeWidth="2" />
  </svg>
);
