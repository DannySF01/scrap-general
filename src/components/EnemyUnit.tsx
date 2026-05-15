import { motion } from "framer-motion";
import { REGISTRY } from "../data/registry";
import type { Enemy } from "../types/game";

export function EnemyUnit({ enemy }: { enemy: Enemy }) {
  const config = REGISTRY.ENEMIES[enemy.type];
  const Icon = config.icon;
  const hpPercent = (enemy.hp / enemy.maxHp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 1.3,
        rotate: 15,
      }}
      transition={{ duration: 0.2 }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center will-change-transform "
      style={{
        left: `${enemy.position.x}%`,
        top: `${enemy.position.y}%`,
      }}
    >
      <div className={`text-${config.color}-500`}>
        <Icon size={config.size} className={`fill-${config.color}-500/20`} />
      </div>

      <div className="w-6 h-1 bg-slate-900 mt-1 rounded-full">
        <div
          style={{ width: `${hpPercent}%` }}
          className={"bg-red-500 h-full"}
        />
      </div>
    </motion.div>
  );
}
