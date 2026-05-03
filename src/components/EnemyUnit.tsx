import { motion } from "framer-motion";
import { Triangle } from "lucide-react";
import type { Enemy } from "../types/game";

export function EnemyUnit({ enemy }: { enemy: Enemy }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${enemy.position.x}%`, top: `${enemy.position.y}%` }}
    >
      <motion.div
        animate={{ y: [0, 2, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
        className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
      >
        <Triangle size={18} className="rotate-180 fill-red-500/20" />
      </motion.div>

      <div className="w-6 h-0.5 bg-slate-800 mt-1 rounded-full overflow-hidden">
        <div
          className="bg-red-500 h-full transition-all"
          style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
        />
      </div>
    </div>
  );
}
