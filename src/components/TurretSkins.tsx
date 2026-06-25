import React from "react";
import type { Turret } from "../types/game";

export const TURRET_SKINS: Record<Turret["type"], React.FC> = {
  SENTRY: () => (
    <div className="absolute -top-3 inset-x-0 flex justify-between px-1 pointer-events-none animate-in fade-in zoom-in-95 duration-155">
      <div className="w-1 h-4 bg-linear-to-t from-slate-600 to-slate-400 border-x border-t border-slate-500 rounded-t-3xs" />
      <div className="w-1 h-4 bg-linear-to-t from-slate-600 to-slate-400 border-x border-t border-slate-500 rounded-t-3xs" />
    </div>
  ),
  SNIPER: () => (
    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-1 h-6 bg-linear-to-t from-slate-800 via-slate-600 to-slate-400 border-t border-slate-400 rounded-t-full flex items-start justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-155">
      <div className="w-2 h-0.5 bg-rose-500 shadow-[0_0_5px_#f43f5e] -translate-y-0.5 rounded-full" />
    </div>
  ),
  ROCKET: () => (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2.5 h-5 bg-linear-to-t from-slate-700 to-slate-500 border border-slate-400 rounded-t-xs shadow-md flex items-start justify-center p-0.5 pointer-events-none animate-in fade-in zoom-in-95 duration-155">
      <div className="w-full h-1 bg-orange-500 shadow-[0_0_6px_#10b981] rounded-3xs animate-pulse" />
    </div>
  ),
};
