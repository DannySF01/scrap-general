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
    <div className="absolute inset-0 z-100 bg-stone-950 overflow-hidden font-mono select-none">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[3px_3px] pointer-events-none mix-blend-overlay" />

      <AnimatePresence mode="wait">
        {currentView === "MAIN" && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full h-full max-w-xl m-auto flex flex-col justify-center p-8 gap-10"
          >
            <div className="text-center relative">
              <h1 className="text-5xl font-black tracking-widest text-stone-100 uppercase leading-none mb-3">
                SCRAP{" "}
                <span className=" text-orange-500  tracking-normal">
                  GENERAL
                </span>
              </h1>

              <div className="w-24 h-px bg-linear-to-r from-transparent via-stone-800 to-transparent m-auto mt-6" />
            </div>

            <div className="flex flex-col gap-2 px-12">
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

              <div className="mt-4 pt-4 border-t border-stone-900/60">
                <MenuButton
                  onClick={() => {
                    if (
                      window.confirm(
                        "WARNING: Operating a complete core memory wipe will delete all gathered scraps and upgrades. Confirm reset?",
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

function MenuButton({
  label,
  sub,
  icon,
  onClick,
  primary = false,
  danger = false,
}: any) {
  let themeClasses =
    "bg-stone-900/40 border-stone-900 text-stone-400 hover:border-stone-800 hover:text-stone-200";
  let iconClasses = "text-stone-600 group-hover:text-orange-500/80";

  if (primary) {
    themeClasses =
      "bg-orange-950/20 border-orange-900/50 text-orange-400 hover:border-orange-500 hover:text-orange-300";
    iconClasses = "text-orange-500";
  } else if (danger) {
    themeClasses =
      "bg-transparent border-transparent text-stone-600 hover:text-rose-500/80 p-2 py-1";
    iconClasses = "text-stone-700 group-hover:text-rose-600/60";
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-2 border rounded-xs transition-all duration-150 group text-left cursor-pointer
        ${themeClasses}
      `}
    >
      <div
        className={`transition-colors duration-150 flex items-center justify-center shrink-0 ${iconClasses}`}
      >
        {icon}
      </div>

      <div className="flex flex-col select-none">
        <p
          className={`text-[11px] font-bold tracking-widest uppercase leading-tight ${primary ? "font-black" : ""}`}
        >
          {label}
        </p>
        <p
          className={`text-[7.5px] tracking-wider font-mono uppercase mt-0.5
          ${primary ? "text-orange-600/60" : danger ? "text-stone-700" : "text-stone-600"}
        `}
        >
          {sub}
        </p>
      </div>
    </button>
  );
}
