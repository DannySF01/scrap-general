// components/icons/CrusherPrimeIcon.tsx
import { motion } from "framer-motion";

export function CrusherPrime({
  size = 100,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const ultraSoftHydraulic = [0.4, 0.0, 0.2, 1] as const;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://w3.org"
      className={`${className} overflow-visible`}
    >
      <defs>
        <filter id="crusherGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <path
        d="M14 16 L50 16 L46 48 L18 48 Z"
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      <motion.rect
        x="24"
        y="22"
        width="16"
        height="16"
        rx="2"
        fill="#f43f5e"
        filter="url(#crusherGlow)"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />

      <path
        d="M16 48 L20 54 L24 48 L28 54 L32 48 L36 54 L42 48 L46 54 L48 48"
        stroke="#f43f5e"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <motion.g
        style={{ transformOrigin: "16px 20px" }}
        animate={{
          rotate: [0, 0, -8, 4, -1, 0],
          y: [0, 0, -0.5, 1, 0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          times: [0, 0.72, 0.82, 0.88, 0.94, 1],
          ease: ultraSoftHydraulic,
        }}
      >
        <path
          d="M16 20 L4 28 L6 40"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-400"
        />
        <circle
          cx="16"
          cy="20"
          r="2.5"
          fill="currentColor"
          className="text-slate-700"
        />
        <circle
          cx="4"
          cy="28"
          r="3"
          fill="currentColor"
          className="text-slate-600"
        />{" "}
        <motion.g
          style={{ transformOrigin: "6px 40px" }}
          animate={{
            rotate: [0, 0, -22, 10, -2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            times: [0, 0.72, 0.82, 0.88, 0.94, 1],
            ease: ultraSoftHydraulic,
          }}
        >
          <circle
            cx="6"
            cy="40"
            r="3"
            fill="currentColor"
            className="text-slate-700"
          />

          <rect
            x="-2"
            y="38"
            width="16"
            height="18"
            rx="2"
            fill="#e11d48"
            stroke="currentColor"
            strokeWidth="2"
            filter="url(#crusherGlow)"
          />
          <rect
            x="1"
            y="41"
            width="10"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M14 42 L20 47 L14 52"
            fill="#e11d48"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </motion.g>
      </motion.g>

      <motion.g
        style={{ transformOrigin: "48px 20px" }}
        animate={{
          rotate: [0, 0, 8, -4, 1, 0],
          y: [0, 0, -0.5, 1, 0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          times: [0, 0.72, 0.82, 0.88, 0.94, 1],
          ease: ultraSoftHydraulic,
        }}
      >
        <path
          d="M48 20 L60 28 L58 40"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-400"
        />
        <circle
          cx="48"
          cy="20"
          r="2.5"
          fill="currentColor"
          className="text-slate-700"
        />
        <circle
          cx="60"
          cy="28"
          r="3"
          fill="currentColor"
          className="text-slate-600"
        />

        <motion.g
          style={{ transformOrigin: "58px 40px" }}
          animate={{
            rotate: [0, 0, 22, -10, 2, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            times: [0, 0.72, 0.82, 0.88, 0.94, 1],
            ease: ultraSoftHydraulic,
          }}
        >
          <circle
            cx="58"
            cy="40"
            r="3"
            fill="currentColor"
            className="text-slate-700"
          />

          <rect
            x="50"
            y="38"
            width="16"
            height="18"
            rx="2"
            fill="#e11d48"
            stroke="currentColor"
            strokeWidth="2"
            filter="url(#crusherGlow)"
          />
          <rect
            x="53"
            y="41"
            width="10"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M50 42 L44 47 L50 52"
            fill="#e11d48"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </motion.g>
      </motion.g>
    </svg>
  );
}
