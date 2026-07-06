import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";

import desertWallImg from "../assets/fields/desert/desert_wall.png";

export function BaseWall() {
  const { baseHp, hp } = useGameStore();

  const healthPercent = Math.max(0, Math.min(baseHp, Math.ceil(hp)));
  const isCritical = healthPercent <= 10;

  return (
    <div className="absolute top-[70%] left-0 w-full flex flex-col items-center pointer-events-none z-10 select-none -translate-y-1/2">
      <motion.div
        animate={
          isCritical ? { x: [-1.1, 1.1, -1.1], y: [0.1, -0.1, 0.1] } : {}
        }
        transition={{ repeat: Infinity, duration: 0.08, ease: "linear" }}
        className="w-full relative flex flex-col items-center"
      >
        <div
          className="w-full h-50 relative"
          style={{
            backgroundImage: `url(${desertWallImg})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "repeat-x",
            filter: "brightness(0.55) contrast(1.2) saturate(0.85)",
          }}
        />
      </motion.div>
    </div>
  );
}
