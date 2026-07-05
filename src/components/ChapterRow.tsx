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
      className={`flex items-center gap-0 overflow-x-auto py-3 px-1 max-w-full overflow-y-hidden custom-horizontal-scrollbar select-none
        ${dragScroll.isDown ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {levels.map((lvl: LevelConfig) => {
        const isBeaten = completedLevels.includes(lvl.id);
        const isUnlocked = isLevelUnlocked(lvl, completedLevels);
        const isBossStage = lvl.name.includes("BOSS");

        let cardStyle =
          "bg-stone-900/20 border-stone-900/60 text-stone-300 hover:border-stone-800";
        if (isBeaten) {
          cardStyle = "bg-stone-900/10 border-stone-900/40 text-stone-400";
        } else if (isUnlocked && isBossStage) {
          cardStyle =
            "bg-orange-500/5 border-orange-950/40 hover:border-orange-500/50";
        } else if (!isUnlocked) {
          cardStyle =
            "bg-transparent border-transparent opacity-15 pointer-events-none grayscale";
        }

        return (
          <div key={lvl.id} className="flex items-center shrink-0">
            <div
              className={`w-64 p-4 border flex flex-col justify-between rounded-sm h-48 mx-2 transition-all duration-150 text-left
                ${cardStyle}
              `}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded-2xs border uppercase
                    ${isBossStage ? "border-orange-900/40 text-orange-500 bg-orange-500/5" : "border-stone-900 text-stone-500"}`}
                  >
                    SEC {lvl.id}
                  </span>
                  {isBeaten ? (
                    <CheckCircle2 size={12} className="text-stone-400" />
                  ) : (
                    isBossStage && (
                      <Skull size={12} className="text-orange-500/70" />
                    )
                  )}
                </div>

                <h3 className="text-[11px] font-bold text-stone-100 uppercase tracking-widest line-clamp-1">
                  {lvl.name.replace("BOSS:", "")}
                </h3>

                <p className="text-[9px] tracking-wide text-stone-500 mt-2 line-clamp-3 font-sans normal-case leading-relaxed">
                  {isUnlocked
                    ? lvl.description
                    : "Locked — Vector coordinates unavailable."}
                </p>
              </div>

              <div className="border-t border-stone-900/50 pt-2 flex justify-between items-center mt-auto">
                <div className="flex flex-col gap-0.5 text-[8px] font-bold tracking-wider select-none">
                  <span className="text-stone-600">CARGO</span>
                  <div className="flex gap-2.5 font-mono">
                    {lvl.rewards.scrap && (
                      <span className="text-stone-300">
                        +{lvl.rewards.scrap} SCRAP
                      </span>
                    )}
                    {lvl.rewards.core && (
                      <span className="text-orange-500/80">
                        +{lvl.rewards.core} CORE
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
                    className={`px-3 py-1 text-[9px] font-bold uppercase rounded-sm border cursor-pointer transition-colors duration-150
                      ${
                        isBossStage
                          ? "bg-orange-500/10 border-orange-900/60 text-orange-400 hover:border-orange-500 hover:text-orange-300"
                          : "bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-600 hover:text-white"
                      }`}
                  >
                    Deploy
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
