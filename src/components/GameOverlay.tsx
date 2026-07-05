import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";

export function GameOverlay() {
  const { status, restartGame, quitGame, togglePause } = useGameStore();

  if (status === "PLAYING") return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)", scale: 0.98 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-stone-950/90 border border-stone-800/80 p-10 rounded-md text-center shadow-2xl min-w-85 font-mono relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[3px_3px] pointer-events-none mix-blend-overlay" />

        {status === "PAUSED" && (
          <>
            <h1 className="text-2xl font-light tracking-[0.18em] text-stone-100 uppercase mb-8">
              GAME PAUSED
            </h1>

            <div className="flex flex-col gap-2.5 pointer-events-auto">
              <button
                onClick={togglePause}
                className="w-full py-2 bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-stone-300 hover:text-white text-xs font-bold tracking-widest uppercase rounded-sm transition-all duration-150 cursor-pointer shadow-sm"
              >
                Resume Operation
              </button>

              <button
                onClick={restartGame}
                className="w-full py-2 bg-stone-950/40 border border-stone-900 hover:border-amber-600/50 text-stone-400 hover:text-amber-500 text-xs font-bold tracking-widest uppercase rounded-sm transition-all duration-150 cursor-pointer shadow-sm"
              >
                Restart Operation
              </button>

              <button
                onClick={quitGame}
                className="w-full py-2 bg-stone-950/20 border border-stone-950 text-stone-500 hover:text-rose-500 text-xs font-bold tracking-widest uppercase rounded-sm transition-all duration-150 cursor-pointer"
              >
                Return to Base
              </button>
            </div>
          </>
        )}

        {status === "GAME_OVER" && (
          <>
            <h1 className="text-3xl font-extralight tracking-[0.15em] text-rose-600 uppercase mb-8">
              Base Destroyed
            </h1>

            <div className="flex flex-col gap-2.5 pointer-events-auto">
              <button
                onClick={restartGame}
                className="w-full py-2.5 bg-rose-950/30 border border-rose-900 hover:border-rose-500 text-rose-400 hover:text-rose-300 text-xs font-bold tracking-widest uppercase rounded-sm transition-all duration-150 cursor-pointer shadow-md shadow-rose-500/5"
              >
                Restart Operation
              </button>

              <button
                onClick={quitGame}
                className="w-full py-2 bg-stone-950/20 text-stone-500 hover:text-stone-400 text-xs font-bold tracking-widest uppercase rounded-sm transition-colors duration-150 cursor-pointer"
              >
                Return to Base
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
