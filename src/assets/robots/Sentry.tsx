export const Sentry = ({ color, size }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill="#1e293b" />

    <rect
      x="25"
      y="30"
      width="50"
      height="50"
      rx="8"
      fill="#334155"
      stroke="#0f172a"
      strokeWidth="4"
    />

    <rect
      x="40"
      y="5"
      width="20"
      height="40"
      rx="4"
      fill={color}
      stroke="#0f172a"
      strokeWidth="4"
    />

    <rect x="40" y="5" width="20" height="10" rx="2" fill="#0f172a" />

    <circle cx="50" cy="55" r="8" fill="white" opacity="0.9" />
  </svg>
);
