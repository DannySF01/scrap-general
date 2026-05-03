import { Zap } from "lucide-react";

export default function ActionSlot({
  icon,
  label,
  cost,
  hotkey,
  isLocked = false,
}: any) {
  return (
    <button
      disabled={isLocked}
      className={`relative flex flex-col items-center justify-center rounded-xl border-2 transition-all 
      ${
        isLocked
          ? "bg-slate-950 border-slate-900 opacity-50 cursor-not-allowed"
          : "bg-slate-900 border-slate-800 hover:border-indigo-500 hover:bg-slate-800 active:translate-y-1"
      }`}
    >
      <span className="absolute top-2 left-2 text-[10px] text-slate-600 font-bold">
        {hotkey}
      </span>
      <div
        className={`${isLocked ? "text-slate-800" : "text-slate-400 group-hover:text-indigo-400"}`}
      >
        {icon || <Zap />}
      </div>
      <span className="text-[10px] font-black mt-1 uppercase tracking-tight">
        {label}
      </span>
      {!isLocked && (
        <span className="text-[10px] text-scrap font-bold italic">
          {cost} SC
        </span>
      )}
    </button>
  );
}
