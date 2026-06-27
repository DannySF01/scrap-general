import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REGISTRY } from "../data/registry";
import { useGameStore } from "../store/useGameStore";
import ActionSlot from "./ActionSlot";
import { StatPanel } from "./StatPanel";
import { TurretHotbar } from "./TurretHotbar";
import { resolveStat } from "../utils/stats";

export default function CommandCenter() {
  const { unlocks, hp, baseHp, upgrades } = useGameStore();
  const [hoveredMetric, setHoveredMetric] = useState<"HEALTH" | "STATS" | null>(
    null,
  );

  const dmgMult = resolveStat("damage", 1, upgrades);
  const fireRateMult = 1 / resolveStat("fireRate", 1, upgrades);
  const critMult = resolveStat("critChance", 0, upgrades) * 100;

  const unlockedAbilities = Object.entries(REGISTRY.ABILITIES).filter(
    ([key]) => unlocks[`ABILITY_${key}`],
  );

  return (
    <div className="fixed bottom-0 inset-x-0 w-full h-35 z-50 select-none flex items-center justify-center cursor-default">
      <div className="flex gap-4 items-stretch p-2 bg-slate-950/90 border-2 border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-auto cursor-default">
        {/* LEFT: Turret Hotbar */}
        <div className="flex items-center">
          <TurretHotbar />
        </div>

        {/* CENTER: Base Stats */}
        <div className="flex flex-col justify-center items-center px-4 border-x border-slate-800/60 min-w-64 gap-1.5 relative">
          {/* 1. Base Health */}
          <div
            className="w-full flex flex-col gap-1 cursor-help relative group"
            onMouseEnter={() => setHoveredMetric("HEALTH")}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            {/* Health Tooltip */}
            <AnimatePresence>
              {hoveredMetric === "HEALTH" && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-2xl flex flex-col gap-1 min-w-44 z-50 backdrop-blur-md"
                >
                  <div className="border-b border-slate-900 pb-1 flex justify-between items-center text-[10px] font-black uppercase text-rose-400">
                    <span>Base Diagnostics</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-[9px] font-mono font-black text-slate-400 tracking-tighter">
                    <div className="flex justify-between">
                      <span>MAX INTEGRITY:</span>
                      <span className="text-white">{Math.ceil(hp)} HP</span>
                    </div>
                  </div>
                  {/* Tooltip Triangle Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-800" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-950" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center text-[10px] font-mono font-black tracking-tight text-slate-400">
              <span className="uppercase text-rose-500 group-hover:text-rose-400 transition-colors">
                Base Integrity
              </span>
              <span className="text-white">{Math.ceil(hp)} HP</span>
            </div>

            <div className="w-full h-2 bg-slate-900 border border-slate-800 rounded-xs overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-rose-600 to-red-500 transition-all duration-300 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                style={{
                  width: `${Math.max(0, Math.min(baseHp, Math.ceil(hp)))}%`,
                }}
              />
            </div>
          </div>

          {/* 2. Turret Modifier Stats */}
          <div
            className="w-full mt-0.5 relative cursor-help"
            onMouseEnter={() => setHoveredMetric("STATS")}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            {/* Stats Tooltip */}
            <AnimatePresence>
              {hoveredMetric === "STATS" && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-slate-950 border border-slate-800 p-2.5 rounded-lg shadow-2xl flex flex-col gap-1 min-w-44 z-50 backdrop-blur-md"
                >
                  <div className="border-b border-slate-900 pb-1 flex justify-between items-center text-[10px] font-black uppercase text-amber-400">
                    <span>Turret Modifiers</span>
                  </div>
                  <div className="flex flex-col gap-0.5 text-[9px] font-mono font-black text-slate-400 tracking-tighter">
                    <div className="flex justify-between">
                      <span>ATTACK MODIFIER:</span>
                      <span className="text-white">x{dmgMult}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FIRE RATE MODIFIER:</span>
                      <span className="text-white">
                        x{fireRateMult.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>CRIT MODIFIER:</span>
                      <span className="text-white">{critMult}%</span>
                    </div>
                  </div>
                  {/* Tooltip Triangle Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-800" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-950" />
                </motion.div>
              )}
            </AnimatePresence>

            <StatPanel />
          </div>
        </div>

        {/* RIGHT: ABILITIES SLOTS */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => {
            const targetAbility = unlockedAbilities[i]?.[1];
            return (
              <ActionSlot
                key={i}
                abilityId={targetAbility ? targetAbility.type : undefined}
                hotkey={i + 1}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
