import { motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";

export default function TechConnection({
  fromId,
  toId,
}: {
  fromId: string;
  toId: string;
}) {
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  /*  const isParentUnlocked = upgrades[fromId] > 0;
  const color = isParentUnlocked ? "stroke-indigo-500" : "stroke-slate-800"; */

  useLayoutEffect(() => {
    const updateLines = () => {
      const startEl = document.getElementById(`node-${fromId}`);
      const endEl = document.getElementById(`node-${toId}`);
      const container = startEl?.closest("main");

      if (startEl && endEl && container) {
        const cRect = container.getBoundingClientRect();
        const sRect = startEl.getBoundingClientRect();
        const eRect = endEl.getBoundingClientRect();

        setCoords({
          x1: sRect.left + sRect.width / 2 - cRect.left,
          y1: sRect.bottom - cRect.top,
          x2: eRect.left + eRect.width / 2 - cRect.left,
          y2: eRect.top - cRect.top,
        });
      }
    };

    updateLines();
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, [fromId, toId]);

  return (
    <motion.path
      d={`M ${coords.x1} ${coords.y1} L ${coords.x1} ${coords.y1 + 20} L ${coords.x2} ${coords.y2 - 20} L ${coords.x2} ${coords.y2}`}
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      className="stroke-indigo-500/30"
    />
  );
}
