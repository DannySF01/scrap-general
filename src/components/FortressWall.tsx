import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";

export function FortressWall() {
  const { baseHp } = useGameStore();

  const healthPercent = Math.max(0, baseHp);
  const wallColor = healthPercent > 50 ? "border-indigo-500" : "border-red-500";

  return (
    <div className="absolute bottom-[15%] left-0 w-full flex flex-col items-center gap-2 pointer-events-none">
      <motion.div
        animate={healthPercent < 30 ? { x: [-1, 1, -1] } : {}}
        transition={{ repeat: Infinity, duration: 0.1 }}
        className={`w-full h-4 border-t-4 bg-slate-900/80 backdrop-blur-sm ${wallColor} shadow-[0_-10px_20px_rgba(0,0,0,0.5)]`}
      />

      <div className="absolute top-1 bg-slate-950 px-3 py-1 rounded border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400">
        Shield Integrity:{" "}
        <span
          className={healthPercent < 30 ? "text-red-500" : "text-indigo-400"}
        >
          {Math.ceil(healthPercent)}%
        </span>
      </div>
    </div>
  );
}
