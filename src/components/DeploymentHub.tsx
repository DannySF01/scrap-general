import { motion } from "framer-motion";
import { REGISTRY } from "../data/registry";
import { useGameStore } from "../store/useGameStore";
import type { Robot } from "../types/game";

export function DeploymentHub() {
  const { selectedRobotType, selectRobot, unlocks } = useGameStore();

  const unlockedRobots = Object.entries(REGISTRY.ROBOTS).filter(
    ([key]) => key === "SENTRY" || unlocks[`${key}_BLUEPRINT`],
  );

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30 group">
      <motion.div
        initial={false}
        className="group flex flex-col gap-2 p-2 bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl transition-all duration-300 w-20 hover:w-44 overflow-hidden"
      >
        {unlockedRobots.map(([key, config]) => {
          const isSelected = selectedRobotType === key;

          return (
            <button
              key={key}
              onClick={() => selectRobot(key as Robot["type"])}
              className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-1
              ${isSelected ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]" : "border-slate-800 bg-slate-950 opacity-60"}`}
            >
              <config.icon
                size={24}
                className={isSelected ? "text-indigo-400" : "text-slate-500"}
              />
              <span className="text-sm font-bold">{config.type}</span>
              <span className="text-xs text-yellow-500">
                DAMAGE {config.damage}
              </span>
              <span className="text-xs text-yellow-500">
                FIRE RATE {config.fireRate}
              </span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
