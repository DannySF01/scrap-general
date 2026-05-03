import ActionSlot from "./components/ActionSlot";
import Stat from "./components/Stat";
import { Arena } from "./components/Arena";
import { useGameStore } from "./store/useGameStore";
import { motion } from "framer-motion";
import { useGameLoop } from "./hooks/useGameLoop";

export default function App() {
  const { scrap, wave, luck, baseHp } = useGameStore();

  useGameLoop();

  return (
    <div className="h-screen w-300 mx-auto flex flex-col bg-slate-950 p-4 gap-4 overflow-hidden relative">
      <header className="flex justify-between items-center bg-slate-900 border-2 border-slate-800 p-4 rounded-xl">
        <div className="flex gap-10">
          <div className="w-48 h-4 my-auto bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: `${baseHp}%` }}
              className={`h-full transition-colors ${baseHp > 30 ? "bg-green-500" : "bg-red-600"}`}
            />
          </div>
          <Stat
            label="SCRAP"
            value={scrap.toLocaleString()}
            color="text-scrap"
          />
          <Stat label="LUCK" value={`${luck}`} color="text-energy" />
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
            Sector Threat
          </p>
          <p className="text-3xl font-black text-danger leading-none">
            WAVE {wave}
          </p>
        </div>
      </header>

      <main className="flex-1 bg-slate-900/50 border-2 border-slate-800 rounded-xl relative overflow-hidden group">
        <Arena />
      </main>

      <footer className="grid grid-cols-4 gap-4 h-28">
        <ActionSlot
          icon={null}
          label="Ability 1"
          cost="0"
          hotkey="1"
          isLocked
        />
        <ActionSlot
          icon={null}
          label="Ability 2"
          cost="0"
          hotkey="2"
          isLocked
        />
        <ActionSlot
          icon={null}
          label="Ability 3"
          cost="0"
          hotkey="3"
          isLocked
        />
        <ActionSlot
          icon={null}
          label="Ability 4"
          cost="0"
          hotkey="4"
          isLocked
        />
      </footer>
    </div>
  );
}
