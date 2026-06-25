import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";

export function BaseWall() {
  const { hp, maxHp } = useGameStore();

  const healthPercent = Math.ceil((hp / maxHp) * 100);
  const wallColor = healthPercent > 50 ? "border-indigo-500" : "border-red-500";

  return (
    <div className="absolute bottom-[15%] left-0 w-full flex flex-col items-center gap-2 pointer-events-none">
      <motion.div
        animate={healthPercent < 30 ? { x: [-1, 1, -1] } : {}}
        transition={{ repeat: Infinity, duration: 0.1 }}
        className={`w-full h-4 border-t-4 bg-slate-900/80 backdrop-blur-sm ${wallColor} shadow-[0_-10px_20px_rgba(0,0,0,0.5)]`}
      />
    </div>
  );
}
