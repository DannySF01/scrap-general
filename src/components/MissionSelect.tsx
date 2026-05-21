import { useGameStore } from "../store/useGameStore";
import { CAMPAIGN_MANIFEST } from "../data/levels";
import { ArrowLeft } from "lucide-react";
import { ChapterRow } from "./ChapterRow";

export function MissionSelect() {
  const { setView, selectLevel, startGame, completedLevels } = useGameStore();

  return (
    <div className="h-full w-full bg-slate-950 font-mono p-12 flex flex-col relative select-none overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-6 border-b-2 border-slate-900 pb-6 mb-8">
        <button
          onClick={() => setView("MAIN")}
          className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xs cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            CAMPAIGN
          </h1>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
            YOUR MUST ANIHILATE THE ENEMY FROM ALL PLANETS
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-12 pb-12">
        {Object.values(CAMPAIGN_MANIFEST).map((chapter) => (
          <div
            key={chapter.id}
            className="flex flex-col border-l border-slate-900 pl-6 relative"
          >
            <div className="absolute top-1 -left-1.5 w-3 h-3 rounded-full bg-indigo-500/40 border border-indigo-500 flex items-center justify-center shadow-[0_0_8px_#6366f1]" />
            <div className="mb-4 text-left">
              <h2 className="text-md font-black text-indigo-400 uppercase tracking-wider">
                {chapter.name}
              </h2>
              <p className="text-[10px] text-slate-500 max-w-xl mt-0.5 leading-tight">
                {chapter.description}
              </p>
            </div>
            <ChapterRow
              levels={chapter.levels}
              completedLevels={completedLevels}
              selectLevel={selectLevel}
              startGame={startGame}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
