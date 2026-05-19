import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { ResourceCounter } from "./ResourceCounter";
import { Pause, Play } from "lucide-react";

export default function UpperTerminal() {
  const { currentLevelId, wave, scrap, togglePause } = useGameStore();

  return (
    <div className="absolute top-0 inset-x-0 p-4 border-b border-red-500/20 bg-slate-950/60 backdrop-blur-md flex justify-between items-center z-20 pointer-events-none font-mono">
      <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/40 border border-slate-800/60 px-4 py-2 rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-0.5 h-full bg-emerald-500" />
        <div className="flex flex-col text-left">
          <span className="text-[7px] font-black text-slate-500 uppercase tracking-wider leading-none mb-1">
            Scrap
          </span>
          <ResourceCounter
            label="Scrap"
            value={scrap}
            color="text-emerald-500"
          />
        </div>
      </div>

      <div className="flex flex-col items-center relative px-8 py-1">
        <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-red-500/40" />
        <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-red-500/40" />
        <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-red-500/40" />
        <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-red-500/40" />

        <motion.div
          animate={{ x: [-80, 80, -80] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-y-0 w-4 bg-linear-to-r from-transparent via-red-500/10 to-transparent blur-xs"
        />

        <span className="text-[8px] font-black text-red-500 tracking-[0.4em] uppercase animate-pulse leading-none mb-1">
          Incursion_Sector_Active
        </span>

        <div className="flex items-baseline gap-2">
          <span className="text-xs font-black text-slate-400 tracking-tight">
            SECTOR {currentLevelId}
          </span>
          <div className="w-1 h-1 bg-red-500/40 rounded-full" />
          <span className="text-lg font-black text-red-500 italic tracking-tighter leading-none">
            WAVE {wave + 1}
          </span>
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-3">
        <div className="flex flex-col text-right">
          <Countdown />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePause}
          className={`p-2.5 border rounded-sm flex items-center justify-center transition-all cursor-pointer relative group
              ${
                status === "PAUSED"
                  ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-pulse"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
        >
          {status === "PAUSED" ? (
            <Play size={12} fill="currentColor" />
          ) : (
            <Pause size={12} fill="currentColor" />
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
          <span className="text-[7px] font-black text-red-500 tracking-[0.4em] uppercase animate-pulse leading-none mb-1"></span>

          <div className="flex items-baseline gap-2">
            <div className="w-1 h-1 bg-red-500/40 rounded-full animate-ping" />
            <span className="text-base font-black text-red-500 italic tracking-tighter leading-none">
              {formattedTime}
            </span>
          </div>
        </>
      ) : (
        <>
          <span className="text-[7px] font-black text-amber-500 tracking-[0.3em] uppercase leading-none mb-1 flex items-center gap-1"></span>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-black text-amber-500 italic tracking-tighter leading-none animate-pulse">
              Destroy remaining enemies
            </span>
          </div>
        </>
      )}
    </>
  );
}
