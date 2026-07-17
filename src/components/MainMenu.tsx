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
    <div className="absolute inset-0 z-100 bg-stone-950 overflow-hidden font-mono select-none flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none bg-radial from-orange-500/3 via-transparent to-transparent opacity-60 z-0 animate-pulse"
        style={{ animationDuration: "8s" }}
      />

      <AnimatePresence mode="wait">
        {currentView === "MAIN" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-2xl flex flex-col justify-center p-8 gap-8 relative z-20"
          >
            <div className="text-center relative  border-stone-900/60 pb-3">
              <h1 className="text-5xl font-black tracking-[0.24em] text-stone-100 uppercase leading-none">
                SCRAP{" "}
                <span className="text-orange-500 tracking-[0.22em]">
                  GENERAL
                </span>
              </h1>
            </div>

            <div className="flex flex-col gap-3.5 px-2 w-full">
              <MenuButton
                onClick={startGame}
                icon={<Play size={14} />}
                label={
                  !firstLevel ? "RESUME OPERATION" : "INITIALIZE OPERATION"
                }
                sub={
                  !firstLevel
                    ? `ACTIVE OPERATION: SECTOR ${currentLevelId}`
                    : "SECTOR 1-1"
                }
                primary
              />

              <MenuButton
                onClick={() => setView("MISSION_SELECT")}
                icon={<Map size={14} />}
                label="OPERATION SELECTION"
                sub="CAMPAIGN OPERATIONS"
              />

              <MenuButton
                onClick={() => setView("TECH_TREE")}
                icon={<GitFork size={14} />}
                label="TECHNOLOGY TREE"
                sub="TECHNOLOGY UPGRADES"
              />

              <MenuButton
                onClick={() => setView("MECH_BAY")}
                icon={<Hammer size={14} />}
                label="MECHANIC BAY"
                sub="TURRET UPGRADES & EXPANSIONS"
              />

              <div className="mt-4 pt-4 border-t border-stone-900/40">
                <MenuButton
                  onClick={() => {
                    if (
                      window.confirm(
                        "WARNING: This will PERMANENTLY ERASE ALL PROGRESS. Confirm reset?",
                      )
                    ) {
                      resetGame();
                    }
                  }}
                  icon={<RotateCcw size={12} />}
                  label="RESET PROGRESS"
                  sub="CLEAR ALL PROGRESS DATA"
                  danger
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentView === "MISSION_SELECT" && (
          <motion.div
            key="mission"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative z-20"
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
            className="w-full h-full relative z-20"
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
            className="w-full h-full relative z-20"
          >
            <MechBay />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({
  label,
  sub,
  icon,
  onClick,
  primary = false,
  danger = false,
}: any) {
  let themeClasses =
    "bg-stone-900/20 border-stone-900 text-stone-400 hover:border-stone-700 hover:text-stone-200";
  let iconClasses = "text-stone-600 group-hover:text-orange-500/80";

  if (primary) {
    themeClasses =
      "bg-orange-950/10 border-orange-900/40 text-orange-400 hover:border-orange-500 hover:text-orange-300";
    iconClasses = "text-orange-500";
  } else if (danger) {
    themeClasses =
      "bg-stone-950/20 border-stone-900/40 text-stone-500 hover:border-rose-950 hover:text-rose-400";
    iconClasses = "text-stone-700 group-hover:text-rose-500/70";
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 border rounded-sm transition-all duration-150 group text-left cursor-pointer active:translate-y-0.5 relative overflow-hidden
        ${danger ? "py-3 px-6" : "py-4 px-6"}
        ${themeClasses}
      `}
    >
      {!danger ? (
        <div
          className={`absolute left-0 top-0 h-full w-0.5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-150 ease-out
            ${primary ? "bg-orange-500" : "bg-stone-400"}`}
        />
      ) : (
        <div className="absolute left-0 top-0 h-full w-0.5 bg-rose-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-150 ease-out" />
      )}

      <div
        className={`transition-colors duration-150 flex items-center justify-center shrink-0 ${iconClasses}`}
      >
        {icon}
      </div>

      <div className="flex flex-col select-none relative z-10">
        <p
          className={`text-[11px] font-bold tracking-[0.16em] uppercase leading-tight ${primary ? "font-black" : ""}`}
        >
          {label}
        </p>
        <p
          className={`text-[7.5px] tracking-widest font-mono uppercase mt-1
          ${primary ? "text-orange-600/60" : danger ? "text-stone-600" : "text-stone-500"}
        `}
        >
          {sub}
        </p>
      </div>
    </button>
  );
}
