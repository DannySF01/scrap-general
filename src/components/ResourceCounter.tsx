import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ResourceCounter({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    setPulseKey((prev) => prev + 1);
  }, [value]);

  return (
    <motion.div
      key={pulseKey}
      initial={{ scale: 1 }}
      animate={
        pulseKey > 0
          ? {
              scale: [1, 1.05, 0.95, 1],
              x: [0, -0.1, 1, -0.1, 1, 0],
            }
          : {}
      }
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className={`text-[10px] font-black ${color} tabular-nums`}
    >
      {value.toLocaleString()} {label}
    </motion.div>
  );
}
