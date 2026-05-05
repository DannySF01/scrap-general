import { motion } from "framer-motion";
import { REGISTRY } from "../data/registry";
import { useGameStore } from "../store/useGameStore";
import { Play, RotateCcw } from "lucide-react";

export function MainMenu() {
  const { status, startGame, resetGame, scrap, wave } = useGameStore();

  if (status !== "IDLE") return null;

  return (
    <div className="fixed inset-0 z-100 bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl flex flex-col gap-12 z-10"
      >
        <div className="text-center">
          <h1 className="text-7xl font-black tracking-tighter text-white mb-2 italic">
            SCRAP <span className="text-indigo-500">GENERAL</span>
          </h1>
          <p className="text-slate-500 font-mono tracking-[0.3em] uppercase text-sm">
            Tactical Command & Harvesting Simulator
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-4">
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
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-900 pb-2">
              Unit Intel
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(REGISTRY.ROBOTS).map(([key, robot]) => (
                <div
                  key={key}
                  className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex items-center gap-3"
                >
                  <div
                    className={`p-2 rounded bg-${robot.color}-500/10 text-${robot.color}-400`}
                  >
                    <robot.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black text-slate-300">
                      {robot.type}
                    </p>
                    <p className="text-[10px] text-slate-500 italic">
                      DAMAGE: {robot.damage}
                    </p>
                    <p className="text-[10px] text-slate-500 italic">
                      FIRE RATE: {robot.fireRate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-900 pb-2">
                Enemy Intel
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(REGISTRY.ENEMIES).map(([key, enemy]) => (
                  <div
                    key={key}
                    className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex items-center gap-3"
                  >
                    <div
                      className={`p-2 rounded bg-${enemy.color}-500/10 text-${enemy.color}-400`}
                    >
                      <enemy.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-slate-300">
                        {enemy.type}
                      </p>
                      <p className="text-[10px] text-slate-500 italic">
                        HEALTH: {enemy.maxHp}
                      </p>
                      <p className="text-[10px] text-slate-500 italic">
                        DAMAGE: {enemy.damage}
                      </p>
                      <p className="text-[10px] text-slate-500 italic">
                        MOVEMENT SPEED: {enemy.speed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 text-[10px] text-slate-700 font-mono">
        VERSION 0.0.1-ALPHA
      </div>
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
