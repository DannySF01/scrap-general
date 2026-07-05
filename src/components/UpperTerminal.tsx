import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { ResourceCounter } from "./ResourceCounter";
import { Pause, Play } from "lucide-react";

export default function UpperTerminal() {
  const { currentLevelId, wave, scrap, togglePause, status } = useGameStore();

  return (
    <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-40 pointer-events-none font-mono select-none">
      <div className="pointer-events-auto flex items-center gap-3 bg-stone-950/20 border border-stone-900/40 px-4 py-2 rounded-md backdrop-blur-xs shadow-md">
        <div className="flex flex-col text-left">
          <span className="text-[7px] font-bold text-orange-500/60 uppercase tracking-widest leading-none mb-1">
            SCRAP
          </span>
          <ResourceCounter
            label="Scrap"
            value={scrap}
            color="text-stone-100 font-bold"
          />
        </div>
      </div>

      <div className="flex flex-col items-center pt-1 px-8 text-center">
        <div className="flex items-baseline gap-3 text-stone-300 tracking-widest">
          <span className="text-xs font-light tracking-widest text-stone-400">
            SECTOR {currentLevelId}
          </span>
          <span className="text-orange-500/20 text-xs font-thin">/</span>
          <span className="text-lg font-bold text-orange-500 tracking-wider">
            WAVE {wave + 1}
          </span>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-4 px-4 py-1.5 ">
        <div className="flex flex-col text-right justify-center">
          <Countdown />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePause}
          className={`p-2 border rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer relative h-8 w-8
            ${
              status === "PAUSED"
                ? "bg-amber-500/10 border-amber-500/60 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse"
                : "bg-stone-950/40 border-stone-800/60 text-stone-400 hover:text-white hover:border-stone-600"
            }`}
        >
          {status === "PAUSED" ? (
            <Play size={11} fill="currentColor" />
          ) : (
            <Pause size={11} fill="currentColor" />
          )}
        </motion.button>
      </div>
    </div>
  );
}

function Countdown() {
  const { waveTimeLeft } = useGameStore();

  const totalSecondsLeft = Math.ceil(waveTimeLeft / 1000);
  const formattedTime = `00:${totalSecondsLeft.toString().padStart(2, "0")}`;

  return (
    <>
      {waveTimeLeft > 0 ? (
        <>
          <span className="text-[7px] font-bold text-orange-500/50 tracking-widest uppercase leading-none mb-1">
            TIME REMAINING
          </span>
          <div className="flex items-center justify-end gap-1.5 leading-none">
            <span className="text-base font-bold text-slate-300 tracking-wide font-mono">
              {formattedTime}
            </span>
          </div>
        </>
      ) : (
        <>
          <span className="text-[7px] font-bold text-amber-500/50 tracking-widest uppercase leading-none mb-1">
            OBJECTIVE UPDATE
          </span>
          <div className="flex items-baseline gap-2 leading-none">
            <span className="text-xs font-bold text-amber-500 tracking-tight animate-pulse">
              Eliminate all enemies
            </span>
          </div>
        </>
      )}
    </>
  );
}
