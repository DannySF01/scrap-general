import { motion } from "framer-motion";

export function NexusGhost({
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
        <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <motion.circle
        cx="32"
        cy="32"
        r="26"
        stroke="#a855f7"
        strokeWidth="1"
        strokeDasharray="4 8"
        className="opacity-30"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      />

      <motion.g
        animate={{
          x: [0, -2, 2, -1, 1, 0],
          y: [0, 1, -1, 1, 0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 0.4,
          ease: "linear",
        }}
      >
        <path
          d="M12 20 L24 8 L28 24 Z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M52 20 L40 8 L36 24 Z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 36 L32 56 L48 36 L40 28 L24 28 Z"
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </motion.g>

      <motion.path
        d="M20 32 L32 20 L44 32 L32 44 Z"
        stroke="#a855f7"
        strokeWidth="1.5"
        filter="url(#purpleGlow)"
        animate={{
          opacity: [0.4, 1, 0.4],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "easeInOut",
        }}
      />

      <motion.circle
        cx="32"
        cy="32"
        r="3"
        fill="#a855f7"
        filter="url(#purpleGlow)"
        animate={{
          scale: [1, 2, 0.5, 1],
          opacity: [0.8, 1, 0.3, 0.8],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      />

      <line
        x1="32"
        y1="4"
        x2="32"
        y2="16"
        stroke="#a855f7"
        strokeWidth="1"
        opacity="0.6"
        strokeDasharray="2 2"
      />
      <line
        x1="32"
        y1="48"
        x2="32"
        y2="60"
        stroke="#a855f7"
        strokeWidth="1"
        opacity="0.6"
        strokeDasharray="2 2"
      />
    </svg>
  );
}
