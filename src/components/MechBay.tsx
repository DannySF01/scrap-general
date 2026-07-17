import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { ArrowLeft, Lock, Unlock, Cpu, LayoutGrid, Layers } from "lucide-react";
import { REGISTRY } from "../data/registry";
import type { Blueprint } from "../types/game";

export default function MechBay() {
  const {
    setView,
    scrap,
    alloy,
    core,
    upgrades,
    unlocks,
    purchaseUpgrade,
    purchaseUnlock,
  } = useGameStore();
  const [activeTab, setActiveTab] = useState<
    "TURRETS" | "EXPANSIONS" | "ABILITIES"
  >("TURRETS");

  const BLUEPRINTS = Object.values(REGISTRY.BLUEPRINTS || {});
  const filteredItems = BLUEPRINTS.filter(
    (item: any) => item.tab === activeTab,
  );

  return (
    <div className="h-full w-full bg-[#0c0a09] font-mono flex flex-col p-12 overflow-hidden relative select-none">
      <header className="flex justify-between items-start border-b border-stone-900/60 pb-6 z-10 shrink-0">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setView("MAIN")}
            className="p-2.5 bg-stone-900/40 border border-stone-900 hover:border-stone-800 text-stone-400 hover:text-white rounded-sm cursor-pointer transition-colors duration-150"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="text-left">
            <h1 className="text-2xl font-light tracking-[0.18em] text-stone-100 uppercase leading-none mb-1">
              MECHANIC BAY
            </h1>
            <p className="text-[8px] text-stone-500 font-bold tracking-widest uppercase">
              Turret upgrades and utility expansions
            </p>
          </div>
        </div>

        <div className="flex gap-5 bg-stone-950/40 border border-stone-900/50 px-4 py-2 rounded-sm shadow-md">
          <MaterialDisplay
            label="SCRAP"
            val={scrap}
            unit="SC"
            color="text-orange-400"
          />
          <div className="w-px bg-stone-900 self-stretch opacity-60" />
          <MaterialDisplay
            label="ALLOY"
            val={alloy}
            unit="AL"
            color="text-purple-400"
          />
          <div className="w-px bg-slate-900 self-stretch opacity-60" />
          <MaterialDisplay
            label="CORE"
            val={core}
            unit="C"
            color="text-rose-500"
          />
        </div>
      </header>

      <div className="flex gap-1 bg-stone-950/40 p-1 border border-stone-900/50 rounded-sm my-6 z-10 w-fit">
        <TerminalTab
          label="Turret Upgrades"
          active={activeTab === "TURRETS"}
          onClick={() => setActiveTab("TURRETS")}
          icon={<Cpu size={11} />}
        />
        <TerminalTab
          label="Ability Upgrades"
          active={activeTab === "ABILITIES"}
          onClick={() => setActiveTab("ABILITIES")}
          icon={<Layers size={11} />}
        />
        <TerminalTab
          label="Expansions"
          active={activeTab === "EXPANSIONS"}
          onClick={() => setActiveTab("EXPANSIONS")}
          icon={<LayoutGrid size={11} />}
        />
      </div>

      <main className="flex-1 overflow-y-auto pr-2 z-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((bp: any) => {
              const isProgressive = typeof bp.maxLevel === "number";
              const currentLvl = upgrades[bp.id] || 0;
              const isMaxed = isProgressive && currentLvl >= (bp.maxLevel ?? 0);
              const isUnlocked = !isProgressive && !!unlocks[bp.id];

              // Prevent upgrading locked weapons/abilities
              const associateBlueprint = bp.id.split("_")[0];
              const isWeaponUnlocked =
                associateBlueprint === "SENTRY" ||
                !!unlocks[`${associateBlueprint}_BLUEPRINT`];
              if (!isWeaponUnlocked && bp.tab !== "EXPANSIONS") return null;

              const cost_scrap = dynamicCost(bp.cost.scrap || 0, currentLvl);
              const cost_alloy = dynamicCost(bp.cost.alloy || 0, currentLvl);
              const cost_core = dynamicCost(bp.cost.core || 0, currentLvl);

              const canAfford =
                (cost_scrap ? scrap >= cost_scrap : true) &&
                (cost_alloy ? alloy >= cost_alloy : true) &&
                (cost_core ? core >= cost_core : true);

              let cardStyle =
                "bg-stone-900/20 border-stone-900/60 hover:border-stone-800 text-stone-300";
              if (isMaxed) {
                cardStyle =
                  "bg-orange-500/5 border-orange-950/40 text-stone-400";
              }

              return (
                <motion.div
                  layout
                  key={bp.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className={`p-4 border flex flex-col justify-between rounded-sm relative overflow-hidden backdrop-blur-xs min-h-42.5
                    ${cardStyle}`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="text-left">
                        <SourceBadge source={bp.source} />
                        <h3
                          className={`text-[11px] font-bold uppercase tracking-widest mt-2`}
                        >
                          {bp.title}
                        </h3>
                      </div>

                      <div className="px-2 py-0.5 bg-stone-950/60 border border-stone-900 text-[8px] font-bold text-stone-500 tracking-wider uppercase rounded-2xs">
                        {isProgressive ? (
                          `RK ${currentLvl}/${bp.maxLevel}`
                        ) : isUnlocked ? (
                          <Unlock size={10} className="text-orange-500/70" />
                        ) : (
                          <Lock size={10} className="text-stone-700" />
                        )}
                      </div>
                    </div>

                    <p className="text-[9px] tracking-wide text-stone-500 leading-relaxed font-sans text-left normal-case mb-4 pr-2">
                      {bp.description}
                    </p>
                  </div>

                  <div className="border-t border-stone-900/50 pt-3 flex justify-between items-center mt-auto">
                    {!isUnlocked && !isMaxed ? (
                      <div className="text-left select-none">
                        <p className="text-[7.5px] text-stone-600 font-bold uppercase tracking-wider mb-0.5">
                          RESOURCES REQUIRED
                        </p>
                        <div className="flex gap-2.5 font-mono text-[9px] font-bold">
                          {cost_scrap > 0 && (
                            <span
                              className={
                                scrap >= cost_scrap
                                  ? "text-orange-400"
                                  : "text-rose-500/80"
                              }
                            >
                              {cost_scrap}SC
                            </span>
                          )}
                          {cost_alloy > 0 && (
                            <span
                              className={
                                alloy >= cost_alloy
                                  ? "text-purple-400"
                                  : "text-rose-500/80"
                              }
                            >
                              {cost_alloy}AL
                            </span>
                          )}
                          {cost_core > 0 && (
                            <span
                              className={
                                core >= cost_core
                                  ? "text-orange-500/80"
                                  : "text-rose-500/80"
                              }
                            >
                              {cost_core}C
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-left">
                        <span className="text-[8px] font-bold tracking-widest text-orange-500/40 uppercase">
                          {isMaxed ? "MAXED" : "UNLOCKED"}
                        </span>
                      </div>
                    )}

                    {!isMaxed && !isUnlocked && (
                      <button
                        onClick={() => {
                          if (!canAfford) return;
                          if (isProgressive) {
                            purchaseUpgrade(bp.id, bp.cost);
                          } else {
                            purchaseUnlock(bp.id);
                          }
                        }}
                        className={`px-3 py-1 text-[9px] font-bold uppercase rounded-sm border transition-colors duration-150
                          ${
                            canAfford
                              ? "bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-600 hover:text-white cursor-pointer"
                              : "bg-transparent border-stone-900/40 text-stone-700 pointer-events-none"
                          }`}
                      >
                        {isProgressive ? "Upgrade" : "Unlock"}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function MaterialDisplay({ label, val, unit, color }: any) {
  return (
    <div className="px-2 min-w-20">
      <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">
        {label}
      </p>
      <p className={`text-sm font-black tracking-tight mt-0.5 ${color}`}>
        {val.toLocaleString()}{" "}
        <span className="text-[9px] opacity-40 font-bold">{unit}</span>
      </p>
    </div>
  );
}

function TerminalTab({ label, active, onClick, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 border text-[9px] font-bold tracking-widest uppercase transition-colors duration-150 flex items-center gap-2 rounded-sm cursor-pointer
      ${
        active
          ? "bg-orange-500/10 border-orange-900/50 text-orange-400"
          : "bg-stone-900/30 border-stone-900/60 text-stone-500 hover:border-stone-800 hover:text-stone-300"
      }`}
    >
      {icon && <span className="opacity-60 scale-90">{icon}</span>}
      {label}
    </button>
  );
}

function SourceBadge({ source }: { source: Blueprint["source"] }) {
  const styles = {
    SCRAP: "border-stone-900 text-stone-400 bg-stone-950/20",
    MATERIAL_DROP: "border-stone-900 text-stone-400 bg-stone-950/20",
    MISSION_REWARD: "border-orange-950/40 text-orange-500 bg-orange-500/5",
    STORE: "border-orange-950/40 text-orange-400 bg-orange-500/5",
  };

  return (
    <span
      className={`text-[7.5px] font-bold px-1.5 py-0.5 rounded-2xs border tracking-widest uppercase inline-block select-none
        ${styles[source] || "border-stone-900 text-stone-500"}
      `}
    >
      {source.replace("_", " ")}
    </span>
  );
}

function dynamicCost(baseCost: number, currentLevel: number) {
  return baseCost * (currentLevel + 1);
}
