import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { GitFork, Hammer, Map, Play, RotateCcw } from "lucide-react";
import { TechTree } from "./TechTree";
import MechBay from "./MechBay";
import { MissionSelect } from "./MissionSelect";

export function MainMenu() {
  const { status, startGame, resetGame, currentLevelId, currentView, setView } =
    useGameStore();

  const firstLevel = currentLevelId === "1-1";

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
              <MenuButton
                onClick={startGame}
                icon={<Play />}
                label={!firstLevel ? "CONTINUE MISSION" : "NEW MISSION"}
                sub={
                  !firstLevel
                    ? `CURRENT MISSION: ${currentLevelId}`
                    : "BEGINNING OF YOUR JOURNEY"
                }
                primary
              />

              <MenuButton
                onClick={() => setView("MISSION_SELECT")}
                icon={<Map />}
                label="MISSION SELECT"
                sub="SELECT YOUR MISSION"
              />

              <MenuButton
                onClick={resetGame}
                icon={<RotateCcw />}
                label="RESET MISSION PROGRESS"
                sub="START FROM THE BEGINNING"
              />

              <MenuButton
                onClick={() => setView("TECH_TREE")}
                icon={<GitFork />}
                label="TECH TREE"
                sub="RESEARCH & TECHNOLOGY"
              />

              <MenuButton
                onClick={() => setView("MECH_BAY")}
                icon={<Hammer />}
                label="MECHANIC BAY"
                sub="UPGRADES & EXPANSIONS"
              />
            </div>
          </motion.div>
        )}
        {currentView === "MISSION_SELECT" && (
          <motion.div
            key="mission"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            className="w-full h-full"
          >
            <MissionSelect />
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
        {currentView === "MECH_BAY" && (
          <motion.div
            key="mech"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <MechBay />
          </motion.div>
        )}
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
