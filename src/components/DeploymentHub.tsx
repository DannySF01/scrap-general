import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REGISTRY } from "../data/registry";
import { useGameStore } from "../store/useGameStore";
import type { Robot } from "../types/game";
import { resolveStat } from "../utils/stats";

export function DeploymentHub() {
  const { selectedRobotType, selectRobot, unlocks, upgrades } = useGameStore();
  const [isHovered, setIsHovered] = useState(false);

  const unlockedRobots = Object.entries(REGISTRY.ROBOTS).filter(
    ([key]) => key === "SENTRY" || unlocks[`${key}_BLUEPRINT`],
  );

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30">
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 260 : 64 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="flex flex-col gap-2 p-2 bg-slate-950/95 backdrop-blur-xl border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden"
      >
        {unlockedRobots.map(([key, config]) => {
          const isSelected = selectedRobotType === key;

          const damage = resolveStat(
            key.toLowerCase() + "Damage",
            config.damage,
            upgrades,
          );

          const fireRate = resolveStat(
            key.toLowerCase() + "FireRate",
            config.fireRate,
            upgrades,
          );

          const level = upgrades[key + "_DAMAGE"] || 0; // TEMPORARY - MAKE UPGRADE IMPROVE ALL STATS FOR EVERY LEVEL

          return (
            <button
              key={key}
              onClick={() => selectRobot(key as Robot["type"])}
              className={`relative h-12 rounded-lg border transition-all flex items-center overflow-hidden select-none shrink-0
                ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                }`}
            >
              {/* FIXED ICON */}
              <div className="w-8 h-8 ml-1.5 flex items-center justify-center shrink-0">
                <config.icon
                  size={18}
                  className={
                    isSelected
                      ? "text-indigo-400"
                      : "text-slate-500 group-hover:text-slate-400"
                  }
                />
              </div>

              {/* SLIDING CONTENT */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1  p-2  flex items-center justify-between whitespace-nowrap"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-black uppercase tracking-tight text-white leading-none">
                        {config.type}
                      </span>
                      <div className="flex gap-2 mt-1 text-[10px] font-black text-slate-500 tracking-tighter">
                        <span className="text-red-400/80">ATK: {damage}</span>
                        <span className="text-indigo-400/80">
                          FR: {fireRate}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-black bg-slate-950 px-1.5 py-0.5 border border-slate-800 text-yellow-500 rounded-xs">
                      LVL {level}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
