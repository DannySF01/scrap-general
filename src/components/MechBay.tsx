// components/MechBay.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import {
  ArrowLeft,
  Lock,
  Unlock,
  Hammer,
  Cpu,
  LayoutGrid,
  Layers,
} from "lucide-react";
import { REGISTRY } from "../data/registry";
import type { Blueprint } from "../types/game";

export default function MechBay() {
  const { setView, scrap, upgrades, unlocks, purchaseUpgrade, purchaseUnlock } =
    useGameStore();
  const [activeTab, setActiveTab] = useState<
    "TURRETS" | "EXPANSIONS" | "ABILITIES"
  >("TURRETS");

  const mockAlloy = 15;
  const mockCore = 0;

  const BLUEPRINTS = Object.values(REGISTRY.BLUEPRINTS);

  const filteredItems = BLUEPRINTS.filter((item) => item.tab === activeTab);

  return (
    <div className="h-full w-full bg-slate-950 font-mono flex flex-col p-12 overflow-hidden relative">
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px] opacity-20 pointer-events-none" />

      {/* HEADER */}
      <header className="flex justify-between items-start border-b-2 border-slate-900 pb-6 z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setView("MAIN")}
            className="p-3 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-indigo-500/50 transition-all rounded-xs"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-3">
              <Hammer className="text-indigo-500" size={28} /> Mechanic Bay
            </h1>
            <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-0.5">
              Structural upgrades, turret tuning, Ability upgrades
            </p>
          </div>
        </div>

        {/* MATERIAL DISPLAY */}
        <div className="flex gap-4 bg-slate-900/40 border border-slate-950 p-3 rounded-xs backdrop-blur-sm">
          <MaterialDisplay
            label="Scrap"
            val={scrap}
            unit="SC"
            color="text-emerald-400"
          />
          <div className="w-px bg-slate-800 self-stretch" />
          <MaterialDisplay
            label="Alloy"
            val={mockAlloy}
            unit="AL"
            color="text-indigo-400"
          />
          <div className="w-px bg-slate-800 self-stretch" />
          <MaterialDisplay
            label="Core"
            val={mockCore}
            unit="C"
            color="text-amber-500"
          />
        </div>
      </header>

      {/* TABS */}
      <div className="flex gap-3 my-8 z-10">
        <TerminalTab
          label="Turret Upgrades"
          active={activeTab === "TURRETS"}
          onClick={() => setActiveTab("TURRETS")}
          icon={<Cpu size={12} />}
        />
        <TerminalTab
          label="Base Expansion"
          active={activeTab === "EXPANSIONS"}
          onClick={() => setActiveTab("EXPANSIONS")}
          icon={<LayoutGrid size={12} />}
        />
        <TerminalTab
          label="Ability Upgrades"
          active={activeTab === "ABILITIES"}
          onClick={() => setActiveTab("ABILITIES")}
          icon={<Layers size={12} />}
        />
      </div>

      {/* BLUEPRINT DISPLAY */}
      <main className="flex-1 overflow-y-auto pr-2 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((bp) => {
              const isProgressive = typeof bp.maxLevel === "number";
              const currentLvl = upgrades[bp.id] || 0;
              const isMaxed = isProgressive && currentLvl >= (bp.maxLevel ?? 0);
              const isUnlocked = !isProgressive && !!unlocks[bp.id];

              const canAfford =
                (bp.costs.scrap ? scrap >= bp.costs.scrap : true) &&
                (bp.costs.alloy ? mockAlloy >= bp.costs.alloy : true) &&
                (bp.costs.core ? mockCore >= bp.costs.core : true);

              return (
                <motion.div
                  layout
                  key={bp.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-5 border flex flex-col justify-between rounded-sm relative overflow-hidden backdrop-blur-md transition-all
                    ${
                      isUnlocked || isMaxed
                        ? "bg-emerald-950/5 border-emerald-900/50 shadow-[inset_0_0_30px_rgba(16,185,129,0.02)]"
                        : "bg-slate-900/20 border-slate-900 hover:border-slate-800"
                    }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <SourceBadge source={bp.source} />
                        <h3
                          className={`text-sm font-black uppercase tracking-tight mt-2 ${isUnlocked || currentLvl > 0 ? "text-indigo-400" : "text-white"}`}
                        >
                          {bp.title}
                        </h3>
                      </div>
                      <div className="p-2 bg-slate-950 border border-slate-900 rounded-xs text-[10px] font-black text-slate-500">
                        {isProgressive ? (
                          `LVL ${currentLvl}/${bp.maxLevel}`
                        ) : isUnlocked ? (
                          <Unlock size={12} className="text-emerald-400" />
                        ) : (
                          <Lock size={12} />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-normal mb-6 pr-4">
                      {bp.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-900/60 pt-4 flex justify-between items-end mt-auto">
                    <div>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                        Source Pipeline Cost
                      </p>
                      <div className="flex gap-3 text-[10px] font-black">
                        {bp.source === "SCRAP" && (
                          <span
                            className={
                              canAfford ? "text-emerald-400" : "text-red-400"
                            }
                          >
                            {bp.costs.scrap} SC
                          </span>
                        )}
                        {bp.source === "MATERIAL_DROP" && (
                          <>
                            {bp.costs.scrap && (
                              <span
                                className={
                                  scrap >= bp.costs.scrap
                                    ? "text-emerald-400"
                                    : "text-red-400"
                                }
                              >
                                {bp.costs.scrap} SC
                              </span>
                            )}
                            {bp.costs.alloy && (
                              <span
                                className={
                                  mockAlloy >= bp.costs.alloy
                                    ? "text-indigo-400"
                                    : "text-red-400"
                                }
                              >
                                {bp.costs.alloy} AL
                              </span>
                            )}
                          </>
                        )}
                        {bp.source === "MISSION_REWARD" && (
                          <span
                            className={
                              mockCore >= (bp.costs.core ?? 0)
                                ? "text-amber-500"
                                : "text-red-400"
                            }
                          >
                            {bp.costs.core} C
                          </span>
                        )}
                        {bp.source === "STORE" && (
                          <span className="text-purple-400 font-bold tracking-widest">
                            [ SHOP ONLY ]
                          </span>
                        )}
                      </div>
                    </div>

                    {bp.source !== "STORE" && !isUnlocked && !isMaxed && (
                      <button
                        disabled={!canAfford}
                        onClick={() =>
                          isProgressive
                            ? purchaseUpgrade(bp.id)
                            : purchaseUnlock(bp.id, bp.costs)
                        }
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xs transition-all shadow-md shadow-indigo-600/10 border border-transparent hover:border-indigo-400/20 disabled:border-transparent"
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
      className={`px-4 py-2.5 border text-[10px] font-black tracking-widest uppercase transition-all rounded-xs flex items-center gap-2
      ${active ? "bg-indigo-600/10 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "bg-slate-900/30 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300"}`}
    >
      {icon} {label}
    </button>
  );
}

function SourceBadge({ source }: { source: Blueprint["source"] }) {
  const styles = {
    SCRAP: "border-emerald-900/40 text-emerald-500 bg-emerald-500/5",
    MATERIAL_DROP: "border-indigo-900/40 text-indigo-400 bg-indigo-400/5",
    MISSION_REWARD: "border-amber-900/40 text-amber-500 bg-amber-500/5",
    STORE: "border-purple-900/40 text-purple-400 bg-purple-500/5 animate-pulse",
  };
  return (
    <span
      className={`text-[8px] font-black px-2 py-0.5 rounded-xs border tracking-wider uppercase ${styles[source]}`}
    >
      {source.replace("_", " ")}
    </span>
  );
}
