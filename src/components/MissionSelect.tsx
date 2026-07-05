import { useGameStore } from "../store/useGameStore";
import { CAMPAIGN_MANIFEST } from "../data/levels";
import { ArrowLeft } from "lucide-react";
import { ChapterRow } from "./ChapterRow";

export function MissionSelect() {
  const { setView, selectLevel, startGame, completedLevels } = useGameStore();

  return (
    <div className="h-full w-full bg-[#0c0a09] font-mono p-12 flex flex-col relative select-none overflow-y-auto custom-scrollbar">
      <div className="flex items-center gap-6 border-b border-stone-900/60 pb-6 mb-10">
        <button
          onClick={() => setView("MAIN")}
          className="p-2.5 bg-stone-900/40 border border-stone-900 hover:border-stone-800 text-stone-400 hover:text-white rounded-sm cursor-pointer transition-colors duration-150"
        >
          <ArrowLeft size={14} />
        </button>
        <div className="text-left">
          <h1 className="text-2xl font-light tracking-[0.18em] text-stone-100 uppercase leading-none mb-1">
            CAMPAIGN MAP
          </h1>
          <p className="text-[8px] text-stone-500 font-bold uppercase tracking-widest">
            Select an active zone to deploy your defense chassis
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-10 pb-12">
        {Object.values(CAMPAIGN_MANIFEST).map((chapter) => (
          <div
            key={chapter.id}
            className="flex flex-col border-l border-stone-900 pl-6 relative"
          >
            <div className="absolute top-1.5 -left-1 w-2 h-2 rounded-full bg-orange-500/40 border border-orange-500/20" />

            <div className="mb-4 text-left">
              <h2 className="text-xs font-bold text-orange-500/80 uppercase tracking-widest">
                {chapter.name}
              </h2>
              <p className="text-[9px] tracking-wide text-stone-500 max-w-lg mt-1 leading-relaxed font-sans normal-case">
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
