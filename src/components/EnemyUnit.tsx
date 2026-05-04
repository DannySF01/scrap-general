import { motion } from "framer-motion";
import { REGISTRY } from "../data/registry";
import type { Enemy } from "../types/game";

export function EnemyUnit({ enemy }: { enemy: Enemy }) {
  const config = REGISTRY.ENEMIES[enemy.type];
  const Icon = config.icon;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      style={{ left: `${enemy.position.x}%`, top: `${enemy.position.y}%` }}
    >
      <motion.div
        animate={config.speed > 0.2 ? { x: [-1, 1, -1] } : { y: [0, 2, 0] }}
        transition={{
          repeat: Infinity,
          duration: config.hp > 100 ? 2 : 1,
        }}
        className={`text-${config.color}-500 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
      >
        <Icon
          size={config.size}
          className={`fill-${config.color}-500/20`}
          style={{
            transform: enemy.type === "MINION" ? "rotate(180deg)" : "none",
          }}
        />
      </motion.div>

      <div className="w-6 h-1 bg-slate-900 mt-1 rounded-full overflow-hidden">
        <div
          style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
          className={"bg-red-500 h-full transition-all"}
        />
      </div>
    </div>
  );
}
