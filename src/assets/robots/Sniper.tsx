export const Sniper = ({ color, size }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M50 45 L85 85 H15 Z"
      fill="#1e293b"
      stroke="#0f172a"
      strokeWidth="4"
    />

    <rect
      x="35"
      y="40"
      width="30"
      height="30"
      rx="4"
      fill="#334155"
      stroke="#0f172a"
      strokeWidth="3"
    />

    <rect
      x="46"
      y="0"
      width="8"
      height="50"
      rx="2"
      fill={color}
      stroke="#0f172a"
      strokeWidth="3"
    />

    <rect
      x="54"
      y="25"
      width="10"
      height="15"
      rx="2"
      fill="#1e293b"
      stroke="#0f172a"
      strokeWidth="2"
    />

    <circle cx="50" cy="5" r="3" fill="#ff0000">
      <animate
        attributeName="opacity"
        values="1;0.2;1"
        dur="0.8s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
