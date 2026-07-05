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
        <div className="absolute inset-x-0 top-1/4 flex flex-col items-center justify-center pointer-events-none z-50 font-mono select-none">
          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, filter: "blur(4px)", y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center text-center px-8 py-2 min-w-112.5"
          >
            <div className="flex items-baseline justify-center gap-4 text-2xl font-light tracking-[0.18em] text-stone-100 uppercase leading-none">
              <h1 className="font-light">
                WAVE <span className="font-bold">{wave + 1}</span>
              </h1>
            </div>

            <div className="w-48 h-px bg-linear-to-r from-transparent via-slate-500/50 to-transparent my-2 relative" />

            <div className="flex gap-4 justify-center items-center h-4">
              {allowedEnemyTypes.map((type) => {
                const enemyConfig = REGISTRY.ENEMIES[type];
                if (!enemyConfig) return null;
                const EnemyIcon = enemyConfig.icon || Skull;

                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5"
                  >
                    <EnemyIcon size={14} style={{ color: enemyConfig.color }} />
                    <span className="text-[8px] tracking-widest text-stone-200 font-bold uppercase">
                      {enemyConfig.type}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
