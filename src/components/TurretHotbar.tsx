import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REGISTRY } from "../data/registry";
import { useGameStore } from "../store/useGameStore";
import type { Turret } from "../types/game";
import { resolveStat } from "../utils/stats";
import { TURRET_SKINS } from "./TurretSkins";
import { Lock } from "lucide-react";

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
        {Array.from({ length: 4 }).map((_, index) => {
          const turretData = unlockedTurrets[index];
          const hotkeyNumber = index + 1;

          // Locked slot
          if (!turretData) {
            return (
              <div
                key={`locked-slot-${index}`}
                className="relative w-14 h-14 rounded-sm border border-stone-900/40 bg-stone-950/20 flex flex-col justify-center items-center select-none"
              >
                <span className="absolute top-0.5 left-0.5 text-[8px] font-bold font-mono px-1 rounded-2xs leading-tight scale-90 origin-top-left bg-stone-900/60 text-stone-600">
                  {hotkeyNumber}
                </span>
                <Lock
                  size={12}
                  className="text-stone-800/80 tracking-normal shrink-0"
                />
                <span className="text-[7.5px] font-bold uppercase text-stone-700 tracking-widest leading-none scale-90 mt-2.5">
                  LOCKED
                </span>
              </div>
            );
          }

          // Unlocked slot
          const [key, config] = turretData;
          const isSelected = selectedTurretType === key;
          const isCurrentHovered = hoveredKey === key;

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
              {/* Turret Tooltip */}
              <AnimatePresence>
                {isCurrentHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-stone-950 border border-stone-900 p-3 rounded-sm shadow-xl flex flex-col items-center gap-2 min-w-36 z-50 pointer-events-none backdrop-blur-xs"
                  >
                    <div className="flex items-center justify-between w-full gap-4 border-b border-stone-900/60 pb-1">
                      <span className="text-[9px] font-bold uppercase text-stone-200 tracking-widest">
                        {config.type}
                      </span>
                      <span className="text-[8px] font-bold bg-stone-900/60 px-1 py-0.5 border border-stone-800/40 text-orange-500/80 rounded-2xs leading-none">
                        LVL {level}
                      </span>
                    </div>

                    <div className="flex flex-col w-full text-left gap-1 font-mono text-[8px] font-bold tracking-wider">
                      <div className="flex justify-between gap-3">
                        <span className="text-stone-500">DAMAGE:</span>
                        <span className="text-stone-300">{damage}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-stone-500">COOLDOWN:</span>
                        <span className="text-stone-400">
                          {(fireRate / 1000).toFixed(2)}s
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hotkey Button */}
              <button
                onClick={() => selectTurret(key as Turret["type"])}
                className={`relative w-14 h-14 rounded-sm border transition-colors duration-150 flex flex-col justify-center items-center overflow-hidden select-none cursor-pointer
                  ${
                    isSelected
                      ? "border-orange-500/60 bg-orange-500/10"
                      : "border-stone-900 bg-stone-950/40 hover:border-stone-800"
                  }`}
              >
                {/* Hotkey Number */}
                <span
                  className={`absolute top-0.5 left-0.5 text-[8px] font-bold font-mono px-1 rounded-2xs leading-tight scale-90 origin-top-left z-30
                  ${isSelected ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-stone-900 text-stone-500"}
                `}
                >
                  {hotkeyNumber}
                </span>

                {/* Turret Icon */}
                <div className="w-10 h-10 flex items-center justify-center shrink-0 relative overflow-hidden filter brightness-[0.85] contrast-[1.2] z-10">
                  {ActiveTurretIcon && (
                    <div className="absolute inset-0 flex items-center justify-center scale-[0.85]">
                      <ActiveTurretIcon isIcon={true} />
                    </div>
                  )}
                </div>

                {/* Turret Type */}
                <span className="absolute bottom-1 text-[7.5px] font-bold uppercase text-stone-500 tracking-widest leading-none scale-90 z-20">
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
