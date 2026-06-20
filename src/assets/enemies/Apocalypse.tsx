import { motion } from "framer-motion";

export function Apocalypse({
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
        <filter
          id="apocalypseGlow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <motion.circle
        cx="32"
        cy="32"
        r="28"
        stroke="#ef4444"
        strokeWidth="1.5"
        strokeDasharray="6 12 18 6"
        className="opacity-40"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      />

      <motion.circle
        cx="32"
        cy="32"
        r="22"
        stroke="#ef4444"
        strokeWidth="1"
        strokeDasharray="20 4"
        className="opacity-30"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
      />

      <g className="opacity-90">
        <path
          d="M14 18 L32 4 L50 18 L42 24 L22 24 Z"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M14 46 L32 60 L50 46 L42 40 L22 40 Z"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M6 24 L18 32 L6 40 Z"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M58 24 L46 32 L58 40 Z"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>

      <circle
        cx="32"
        cy="32"
        r="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        className="opacity-50"
      />

      <motion.circle
        cx="32"
        cy="32"
        r="7"
        fill="#ef4444"
        filter="url(#apocalypseGlow)"
        animate={{
          scale: [0.7, 1.4, 0.9, 1.6, 0.7],
          opacity: [0.5, 1, 0.7, 1, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      />

      <motion.path
        d="M32 18 L32 25 M32 46 L32 39 M18 32 L25 32 M46 32 L39 32"
        stroke="#ef4444"
        strokeWidth="1.5"
        filter="url(#apocalypseGlow)"
        animate={{
          strokeWidth: ["1px", "3px", "1px"],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.5,
          ease: "linear",
        }}
      />
    </svg>
  );
}
