export const Minion = ({ color, size }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M20 20 L80 80 M80 20 L20 80"
      stroke="#4b5563"
      strokeWidth="12"
      strokeLinecap="round"
    />
    <circle
      cx="50"
      cy="50"
      r="25"
      fill={color === "red" ? "#ef4444" : color}
      stroke="#7f1d1d"
      strokeWidth="4"
    />
    <circle cx="50" cy="50" r="10" fill="#1e293b" />
    <circle cx="47" cy="47" r="3" fill="#60a5fa" />
    <circle cx="20" cy="20" r="6" fill="#1e293b" />
    <circle cx="80" cy="20" r="6" fill="#1e293b" />
    <circle cx="20" cy="80" r="6" fill="#1e293b" />
    <circle cx="80" cy="80" r="6" fill="#1e293b" />
  </svg>
);
