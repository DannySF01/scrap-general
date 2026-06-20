import { motion } from "framer-motion";

export function OvershieldTitan({
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
        <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <motion.path
        d="M6 14 L32 2 L58 14 L50 48 L32 62 L14 48 Z"
        stroke="#f59e0b"
        strokeWidth="1.5"
        filter="url(#amberGlow)"
        animate={{
          opacity: [0.2, 0.6, 0.2],
          strokeWidth: ["1.5px", "3px", "1.5px"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      />

      <path
        d="M12 18 L32 8 L52 18 L46 44 L32 54 L18 44 Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      <path
        d="M20 22 L32 16 L44 22 L40 40 L32 46 L24 40 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />

      <line
        x1="32"
        y1="8"
        x2="32"
        y2="54"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
      />
      <line
        x1="18"
        y1="44"
        x2="46"
        y2="44"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />

      <motion.circle
        cx="32"
        cy="30"
        r="4"
        fill="#f59e0b"
        filter="url(#amberGlow)"
        animate={{
          scale: [0.9, 1.3, 0.9],
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </svg>
  );
}
