import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REGISTRY } from "../data/registry";
import { useGameStore } from "../store/useGameStore";
import type { Turret } from "../types/game";
import { resolveStat } from "../utils/stats";
import { TURRET_SKINS } from "./TurretSkins";

export function TurretHotbar() {
  const { selectedTurretType, selectTurret, unlocks, upgrades } =
    useGameStore();

  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const unlockedTurrets = Object.entries(REGISTRY.TURRETS).filter(
    ([key]) => key === "SENTRY" || unlocks[`${key}_BLUEPRINT`],
  );

  return (
    <div className="relative">
      <div className="flex gap-2 items-center h-14">
        {unlockedTurrets.map(([key, config], index) => {
          const isSelected = selectedTurretType === key;
          const isCurrentHovered = hoveredKey === key;
          const hotkeyNumber = index + 1;

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

          const level = upgrades[key + "_DAMAGE"] || 0;

          const ActiveTurretIcon = TURRET_SKINS[key as Turret["type"]];

          return (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {/* Weapon Tooltip */}
              <AnimatePresence>
                {isCurrentHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-2xl flex flex-col items-center gap-1.5 min-w-32 z-50 pointer-events-none"
                  >
                    {/* Tooltip Header */}
                    <div className="flex items-center justify-between w-full gap-4 border-b border-slate-900 pb-1">
                      <span className="text-[10px] font-black uppercase text-white tracking-wide">
                        {config.type}
                      </span>
                      <span className="text-[9px] font-black bg-slate-900/60 px-1 py-0.5 border border-slate-800/50 text-yellow-500 rounded-xs leading-none">
                        LVL {level}
                      </span>
                    </div>

                    {/* Weapon Stats */}
                    <div className="flex flex-col w-full text-left gap-0.5 font-mono text-[9px] font-black tracking-tighter">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">DAMAGE:</span>
                        <span className="text-red-400 font-bold">{damage}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">COOLDOWN:</span>
                        <span className="text-indigo-400 font-bold">
                          {fireRate / 1000}s
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Select Turret Button */}
              <button
                onClick={() => selectTurret(key as Turret["type"])}
                className={`relative w-14 h-14 rounded-lg border-2 transition-all flex flex-col justify-center items-center overflow-hidden select-none cursor-pointer pt-2
                  ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                  }`}
              >
                {/* Hotkey Number */}
                <span
                  className={`absolute top-0.5 left-0.5 text-[9px] font-bold font-mono px-1 rounded-xs leading-tight scale-90 origin-top-left
                  ${isSelected ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"}
                `}
                >
                  {hotkeyNumber}
                </span>

                {/* Turret Icon */}
                <div className="w-8 h-8 flex items-center justify-center shrink-0 relative overflow-hidden">
                  {ActiveTurretIcon && (
                    <div className="absolute inset-0 scale-[0.75] translate-y-4">
                      <ActiveTurretIcon />
                    </div>
                  )}
                </div>

                {/* Turret Type */}
                <span className="text-[8px] font-black uppercase text-slate-500 tracking-tight leading-none scale-90 mt-1 mb-0.5">
                  {config.type}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
