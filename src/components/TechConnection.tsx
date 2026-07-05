import { motion } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { useGameStore } from "../store/useGameStore";

export default function TechConnection({
  fromId,
  toId,
}: {
  fromId: string;
  toId: string;
}) {
  const { upgrades } = useGameStore();
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

  const isParentUnlocked = (upgrades[fromId] || 0) > 0;
  const strokeColor = isParentUnlocked
    ? "stroke-orange-500/40"
    : "stroke-stone-900/60";

  useLayoutEffect(() => {
    const updateLines = () => {
      const startEl = document.getElementById(`node-${fromId}`);
      const endEl = document.getElementById(`node-${toId}`);
      const container = startEl?.closest("main");

      if (startEl && endEl && container) {
        const cRect = container.getBoundingClientRect();
        const sRect = startEl.getBoundingClientRect();
        const eRect = endEl.getBoundingClientRect();

        const scrollOffsetLeft = container.scrollLeft;

        setCoords({
          x1: sRect.right - cRect.left + scrollOffsetLeft,
          y1: sRect.top + sRect.height / 2 - cRect.top,

          x2: eRect.left - cRect.left + scrollOffsetLeft,
          y2: eRect.top + eRect.height / 2 - cRect.top,
        });
      }
    };

    const timerId = setTimeout(updateLines, 0);

    window.addEventListener("resize", updateLines);

    const startEl = document.getElementById(`node-${fromId}`);
    const container = startEl?.closest("main");
    if (container) {
      container.addEventListener("scroll", updateLines, { passive: true });
    }

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("resize", updateLines);
      if (container) container.removeEventListener("scroll", updateLines);
    };
  }, [fromId, toId, upgrades]);

  const midX = coords.x1 + (coords.x2 - coords.x1) / 2;

  return (
    <motion.path
      d={`M ${coords.x1} ${coords.y1} L ${midX} ${coords.y1} L ${midX} ${coords.y2} L ${coords.x2} ${coords.y2}`}
      strokeWidth="1.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`${strokeColor} transition-colors duration-200 fill-none`}
    />
  );
}
