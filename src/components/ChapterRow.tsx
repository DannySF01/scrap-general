import { useDragScroll } from "../hooks/useDragScroll";
import { CheckCircle2, Skull } from "lucide-react";
import type LevelConfig from "../types/levels";
import { CAMPAIGN_MANIFEST } from "../data/levels";
interface ChapterRowProps {
  levels: LevelConfig[];
  completedLevels: string[];
  selectLevel: (id: string) => void;
  startGame: () => void;
}

export function ChapterRow({
  levels,
  completedLevels,
  selectLevel,
  startGame,
}: ChapterRowProps) {
  const dragScroll = useDragScroll();

  return (
    <div
      ref={dragScroll.ref}
      onMouseDown={dragScroll.onMouseDown}
      onMouseLeave={dragScroll.onMouseLeave}
      onMouseUp={dragScroll.onMouseUp}
      onMouseMove={dragScroll.onMouseMove}
      className={`flex items-center gap-0 overflow-x-auto py-4 px-2 max-w-full overflow-y-hidden custom-horizontal-scrollbar select-none
        ${dragScroll.isDown ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {levels.map((lvl: LevelConfig) => {
        const isBeaten = completedLevels.includes(lvl.id);
        const isUnlocked = isLevelUnlocked(lvl, completedLevels);
        const isBossStage = lvl.name.includes("BOSS");

        return (
          <div key={lvl.id} className="flex items-center shrink-0">
            <div
              className={`w-70 p-5 border flex flex-col justify-between rounded-lg h-55 mx-2 backdrop-blur-sm transition-all text-left
              ${
                isBeaten
                  ? "bg-emerald-950/5 border-emerald-500/20"
                  : isUnlocked
                    ? isBossStage
                      ? "bg-red-950/10 border-red-500/60 hover:border-red-500 shadow-[0_0_25px_rgba(239,104,104,0.05)]"
                      : "bg-indigo-950/10 border-indigo-500/40 hover:border-indigo-500"
                    : "bg-slate-950/40 border-slate-900/60 opacity-20 pointer-events-none grayscale"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-xs border uppercase
                    ${isBossStage ? "border-red-900 text-red-400 bg-red-500/5" : "border-slate-800 text-slate-400"}`}
                  >
                    LEVEL {lvl.id}
                  </span>
                  {isBeaten ? (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  ) : (
                    isBossStage && (
                      <Skull size={14} className="text-red-400 animate-pulse" />
                    )
                  )}
                </div>

                <h3 className="text-xs font-black text-white uppercase tracking-tight line-clamp-1">
                  {lvl.name.replace("BOSS:", "💀")}
                </h3>
                <p className="text-[10px] text-slate-400 leading-normal mt-1.5 line-clamp-3">
                  {isUnlocked
                    ? lvl.description
                    : "COGNITIVE BLOCK PROTOCOLS ENGAGED."}
                </p>
              </div>

              <div className="border-t border-slate-900 pt-3 flex justify-between items-center mt-auto">
                <div className="flex flex-col gap-0.5 text-[9px] font-black">
                  <span className="text-slate-300">REWARDS</span>
                  <div className="flex gap-3">
                    {lvl.rewards.scrap && (
                      <span className="text-emerald-400">
                        {lvl.rewards.scrap} SC
                      </span>
                    )}
                    {lvl.rewards.core && (
                      <span className="text-amber-500">
                        {lvl.rewards.core} CORE
                      </span>
                    )}
                  </div>
                </div>

                {isUnlocked && (
                  <button
                    onClick={() => {
                      selectLevel(lvl.id);
                      startGame();
                    }}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-sm border cursor-pointer 
                      ${
                        isBossStage
                          ? "bg-red-600 text-white border-transparent hover:bg-red-500 shadow-md shadow-red-500/10"
                          : "bg-indigo-600 border-transparent text-white hover:bg-indigo-500"
                      }`}
                  >
                    Launch
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function isLevelUnlocked(level: LevelConfig, completedLevels: string[]) {
  const [chapterId, levelId] = level.id.split("-");

  if (level.id === "1-1") return true;

  if (completedLevels.includes(`${chapterId}-${Number(levelId) - 1}`))
    return true;

  const previousChapter = CAMPAIGN_MANIFEST[Number(chapterId) - 1];
  if (!previousChapter) return false;
  const lastLevelOfPrevChapter =
    previousChapter.levels[previousChapter.levels.length - 1];

  return levelId === "1" && completedLevels.includes(lastLevelOfPrevChapter.id);
}
