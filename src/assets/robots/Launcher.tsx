export const Launcher = ({ color = "#f97316", size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path
      d="M10 90 L30 60 H70 L90 90 Z"
      fill="#1e293b"
      stroke="#0f172a"
      strokeWidth="4"
    />
    <rect
      x="30"
      y="35"
      width="40"
      height="30"
      rx="4"
      fill="#334155"
      stroke="#0f172a"
      strokeWidth="4"
    />
    <rect
      x="35"
      y="10"
      width="30"
      height="25"
      rx="2"
      fill={color}
      stroke="#0f172a"
      strokeWidth="4"
    />
    <circle cx="50" cy="30" r="6" fill="#0f172a" />
  </svg>
);
