import { motion } from "framer-motion";
import { Lock, Plus } from "lucide-react";
import type { Base, Robot } from "../types/game";
import { useGameStore } from "../store/useGameStore";
import { REGISTRY } from "../data/registry";

interface BaseProps {
  base: Base;
  robot?: Robot;
}

export function Base({ base, robot }: BaseProps) {
  const { deployToBase, selectedRobotType } = useGameStore();

  const robotConfig = robot ? REGISTRY.ROBOTS[robot.type] : null;
  const Icon = robotConfig ? robotConfig.icon : Plus;

  const handleInteraction = () => {
    if (!base.isUnlocked) return;
    deployToBase(base.id, selectedRobotType);
  };

  return (
    <div
      style={{ left: `${base.x}%`, top: `${base.y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group"
    >
      <motion.div
        onClick={handleInteraction}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        className={`w-16 h-16 rounded-t-2xl border-x-2 border-t-2 transition-all cursor-pointer flex flex-col items-center justify-center
          ${
            !base.isUnlocked
              ? "border-slate-800 bg-slate-900/20 opacity-40 hover:opacity-100 hover:border-energy"
              : robot
                ? `border-${robotConfig?.color}-500 bg-slate-900/80 shadow-[0_-10px_20px_rgba(99,102,241,0.2)]`
                : "border-slate-700 bg-slate-800/40 hover:border-indigo-400"
          }`}
      >
        {robot ? (
          <div className="flex flex-col items-center">
            <motion.div
              animate={
                robot.lastShot && robot.lastShot > Date.now() - 100
                  ? {}
                  : {
                      scale: [1, 1.1],
                      transform: ["none", "translateY(-1px)"],
                    }
              }
              className={`text-${robotConfig?.color}-400`}
            >
              <Icon size={28} />
            </motion.div>
          </div>
        ) : base.isUnlocked ? (
          <Plus
            size={20}
            className="text-slate-600 group-hover:text-indigo-400 transition-colors"
          />
        ) : (
          <Lock
            size={16}
            className="text-slate-800 group-hover:text-energy transition-colors"
          />
        )}
      </motion.div>

      <div
        className={`px-2 py-0.5 rounded text-[8px] font-black whitespace-nowrap border transition-colors
        ${
          base.isUnlocked
            ? "bg-slate-900 border-slate-800 text-slate-500"
            : "bg-red-950/20 border-red-900/30 text-red-900 group-hover:text-energy group-hover:border-energy"
        }`}
      >
        {base.isUnlocked ? (robot ? robotConfig?.type : `DEPLOY`) : `LOCKED`}
      </div>
    </div>
  );
}
