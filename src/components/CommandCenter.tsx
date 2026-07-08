import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { REGISTRY } from "../data/registry";
import ActionSlot from "./ActionSlot";
import { StatPanel } from "./StatPanel";
import { TurretHotbar } from "./TurretHotbar";
import { resolveStat } from "../utils/stats";

export default function CommandCenter() {
  const { unlocks, hp, maxHp, isEmergencyRepairSpent, upgrades } =
    useGameStore();
  const [hoveredMetric, setHoveredMetric] = useState<"HEALTH" | "STATS" | null>(
    null,
  );

  const dmgMult = resolveStat("damage", 1, upgrades);
  const fireRateMult = 1 / resolveStat("fireRate", 1, upgrades);
  const critMult = resolveStat("critChance", 0, upgrades) * 100;
  const hpRegen = resolveStat("regenFlat", 0, upgrades);

  const unlockedAbilities = Object.entries(REGISTRY.ABILITIES).filter(
    ([key]) => unlocks[`ABILITY_${key}`],
  );

  return (
    <div className="fixed bottom-0 inset-x-0 w-full h-24 z-50 select-none flex items-end justify-center pb-4 pointer-events-none font-mono">
      <div className="flex gap-6 items-stretch p-3 bg-stone-950/85 border border-stone-900/60 rounded-sm shadow-2xl backdrop-blur-xs pointer-events-auto">
        <div className="flex items-center shrink-0">
          <TurretHotbar />
        </div>

        <div className="flex flex-col justify-center items-center px-6 border-x border-stone-900/50 min-w-60 gap-2 relative">
          <div
            className="w-full flex flex-col gap-1.5 cursor-help relative group"
            onMouseEnter={() => setHoveredMetric("HEALTH")}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            <AnimatePresence>
              {hoveredMetric === "HEALTH" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.1 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-stone-950 border border-stone-900 p-3 rounded-sm shadow-xl flex flex-col gap-1 min-w-42.5 z-50 backdrop-blur-xs pointer-events-none"
                >
                  <div className="border-b border-stone-900 pb-1 text-[8px] font-bold uppercase tracking-widest text-orange-500/80">
                    Wall Integrity
                  </div>
                  <div className="flex flex-col gap-0.5 text-[8px] font-bold text-stone-400 tracking-wider">
                    <div className="flex justify-between font-mono">
                      <span>MAX INTEGRITY:</span>
                      <span className="text-stone-100">
                        {Math.ceil(hp)} / {maxHp} HP
                      </span>
                    </div>
                    <div className="flex justify-between font-mono border-t border-stone-900/50 pt-1 mt-0.5">
                      <span>NANO REPAIR RATE:</span>
                      {hpRegen > 0 ? (
                        <span className="text-emerald-400 font-bold">
                          +{hpRegen} HP / 5s
                        </span>
                      ) : (
                        <span className="text-stone-600">0.0 HP / 5s</span>
                      )}
                    </div>
                    <div className="flex justify-between font-mono border-t border-stone-900/50 pt-1 mt-0.5">
                      <span>EMERGENCY REPAIR:</span>
                      {isEmergencyRepairSpent ? (
                        <span className="text-red-500">UNAVAILABLE</span>
                      ) : (
                        <span className="text-emerald-400">AVAILABLE</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center text-[8px] font-bold tracking-widest text-stone-500 leading-none">
              <span className="uppercase text-stone-400 transition-colors group-hover:text-stone-300">
                Wall Integrity
              </span>
              <span className="text-stone-200 font-mono font-bold">
                {Math.ceil(hp)}HP
              </span>
            </div>

            <div className="w-full h-0.75 bg-stone-900/40 rounded-2xs overflow-hidden relative">
              <div
                className="h-full bg-linear-to-r from-red-600 via-red-500 to-orange-500 transition-all duration-300 ease-out"
                style={{
                  width: `${Math.max(0, Math.min(maxHp, (hp / maxHp) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* TURRET STAT PANEL */}
          <div
            className="w-full mt-0.5 relative cursor-help"
            onMouseEnter={() => setHoveredMetric("STATS")}
            onMouseLeave={() => setHoveredMetric(null)}
          >
            {/* TOOLTIP */}
            <AnimatePresence>
              {hoveredMetric === "STATS" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.1 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-stone-950 border border-stone-900 p-3 rounded-sm shadow-xl flex flex-col gap-1 min-w-42.5 z-50 backdrop-blur-xs pointer-events-none"
                >
                  <div className="border-b border-stone-900 pb-1 text-[8px] font-bold uppercase tracking-widest text-orange-500/80">
                    Hardpoint Offense
                  </div>
                  <div className="flex flex-col gap-1 text-[8px] font-bold text-stone-400 tracking-wider pt-1">
                    <div className="flex justify-between font-mono">
                      <span>DAMAGE CAP:</span>
                      <span className="text-stone-100">
                        x{dmgMult.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>FIRE CADENCE:</span>
                      <span className="text-stone-100">
                        x{fireRateMult.toFixed(1)}/s
                      </span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span>CRIT INDEX:</span>
                      <span className="text-stone-100">
                        {critMult.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <StatPanel />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {Array.from({ length: 4 }).map((_, i) => {
            const targetAbility = unlockedAbilities[i]?.[1];
            return (
              <ActionSlot
                key={i}
                abilityId={
                  targetAbility ? (targetAbility as any).type : undefined
                }
                hotkey={i + 5} // Ability hotkeys start at 5 to 8
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
