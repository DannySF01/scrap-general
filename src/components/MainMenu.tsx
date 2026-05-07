import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { Play, RotateCcw } from "lucide-react";
import { TechTree } from "./TechTree";

export function MainMenu() {
  const { status, startGame, resetGame, scrap, wave, currentView, setView } =
    useGameStore();

  if (status !== "IDLE") return null;

  return (
    <div className="fixed inset-0 z-100 bg-slate-950 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentView === "MAIN" && (
          <motion.div
            key="main"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="w-full h-full max-w-4xl m-auto flex flex-col justify-center p-8 gap-12"
          >
            <div className="text-center">
              <h1 className="text-7xl font-black tracking-tighter text-white mb-2 italic">
                SCRAP <span className="text-indigo-500">GENERAL</span>
              </h1>
              <p className="text-slate-500 font-mono tracking-[0.3em] uppercase text-sm">
                Tactical Command & Harvesting Simulator
              </p>
            </div>

            <div className="flex flex-col gap-4 px-24">
              <h2 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-900 pb-2">
                Operations
              </h2>

              <MenuButton
                onClick={startGame}
                icon={<Play />}
                label={wave > 1 ? "RESUME DEPLOYMENT" : "INITIALIZE MISSION"}
                sub={`SECTOR WAVE: ${wave}`}
                primary
              />

              <MenuButton
                onClick={resetGame}
                icon={<RotateCcw />}
                label="WIPE LOCAL DATA"
                sub={`CURRENT SCRAP: ${scrap} SC`}
              />

              <MenuButton
                onClick={() => setView("TECH_TREE")}
                icon={<Play />}
                label="TECH TREE"
                sub="UPGRADES & TECHNOLOGY"
              />

              <MenuButton
                onClick={() => setView("INTEL")}
                icon={<Play />}
                label="DATABASE"
                sub="INTELIGENCE"
              />
            </div>
          </motion.div>
        )}
        {currentView === "TECH_TREE" && (
          <motion.div
            key="tech"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <TechTree />
          </motion.div>
        )}
        <div className="absolute place-self-center bottom-8 text-[10px] text-slate-700">
          VERSION 0.0.1-ALPHA
        </div>
      </AnimatePresence>
    </div>
  );
}

function MenuButton({ label, sub, icon, onClick, primary = false }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all group text-left
        ${primary ? "bg-indigo-600 border-indigo-500 hover:bg-indigo-500" : "bg-slate-900 border-slate-800 hover:border-slate-700"}
      `}
    >
      <div
        className={`${primary ? "text-white" : "text-slate-500 group-hover:text-indigo-400"}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-black tracking-tight">{label}</p>
        <p
          className={`text-[10px] font-mono ${primary ? "text-indigo-200" : "text-slate-600"}`}
        >
          {sub}
        </p>
      </div>
    </button>
  );
}
