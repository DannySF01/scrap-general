import { motion } from "framer-motion";

export function ApexStalker({
  size,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://w3.org"
      className={className}
    >
      <defs>
        <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <path
        d="M32 4 L60 20 L48 54 L32 60 L16 54 L4 20 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        className="opacity-40 animate-pulse"
      />

      <path
        d="M32 12 L52 24 L42 48 L32 52 L22 48 L12 24 Z"
        fill="currentColor"
        fillOpacity="0.05"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M12 24 L24 16 M52 24 L40 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <line
        x1="32"
        y1="12"
        x2="32"
        y2="52"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      <line
        x1="22"
        y1="48"
        x2="42"
        y2="48"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />

      <motion.circle
        cx="32"
        cy="28"
        r="5"
        fill="#06b6d4"
        filter="url(#cyanGlow)"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      />

      <circle
        cx="32"
        cy="28"
        r="9"
        stroke="#06b6d4"
        strokeWidth="1"
        strokeDasharray="2 1"
        opacity="0.7"
      />
    </svg>
  );
}
