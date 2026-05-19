import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { useEffect, useState } from "react";
import { LEVELS_MANIFEST } from "../data/levels";
import { REGISTRY } from "../data/registry";
import { Skull } from "lucide-react";

export function WaveAlert() {
  const { wave, status, currentLevelId } = useGameStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (status === "PLAYING") {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [wave, status, currentLevelId]);

  const levelData = LEVELS_MANIFEST[currentLevelId];
  const currentWaveConfig = levelData?.waves[wave];
  const allowedEnemyTypes = currentWaveConfig?.allowedTypes || [];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0, 0.15, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-red-600 pointer-events-none z-40 bg-linear-to-b from-red-500/10 to-transparent mix-blend-color-dodge"
          />

          <div className="absolute inset-x-0 top-1/4 flex flex-col items-center justify-center pointer-events-none z-50 font-mono">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-xl bg-slate-950/95 border-y-2 border-red-500/60 p-5 flex flex-col items-center justify-center backdrop-blur-md shadow-[0_0_50px_rgba(239,68,68,0.2)] relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-[repeating-linear-gradient(-45deg,#ef4444,#ef4444_6px,#020617_6px,#020617_12px)]" />

              <motion.h1
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-black italic tracking-tighter text-white uppercase"
              >
                Sector <span className="text-red-500">{currentLevelId}</span>{" "}
                WAVE
                <span className="text-red-500"> {wave + 1}</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-4 mt-4 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-sm w-full max-w-sm justify-center items-center"
              >
                <div className="flex flex-col text-left mr-auto">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
                    Intel Scan
                  </span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-tight">
                    Threat Manifest
                  </span>
                </div>

                <div className="flex gap-2">
                  {allowedEnemyTypes.map((type) => {
                    const enemyConfig = REGISTRY.ENEMIES[type];
                    if (!enemyConfig) return null;
                    const EnemyIcon = enemyConfig.icon || Skull;

                    return (
                      <div
                        key={type}
                        className={`p-2 bg-slate-950 border border-${enemyConfig.color}-500/20 rounded-xs flex items-center justify-center relative group`}
                        title={enemyConfig.type}
                      >
                        <div
                          className={`absolute inset-0 bg-${enemyConfig.color}-500/5 rounded-xs animate-ping opacity-40`}
                        />
                        <EnemyIcon
                          size={16}
                          className={`text-${enemyConfig.color}-500 relative z-10`}
                        />
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <div className="absolute bottom-0 inset-x-0 h-1 bg-[repeating-linear-gradient(-45deg,#ef4444,#ef4444_6px,#020617_6px,#020617_12px)]" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
