import { useGameStore } from "../store/useGameStore";
import { TURRET_SKINS } from "./TurretSkins";

export default function Player() {
  const selectedTurret = useGameStore((state) => state.selectedTurretType);
  const ActiveTurretSkin = TURRET_SKINS[selectedTurret];

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      {/* Heavy metal tracks */}
      <div className="absolute -left-0.5 top-0 bottom-0 w-3 bg-slate-900 border-2 border-slate-700 rounded-sm" />
      <div className="absolute -right-0.5 top-0 bottom-0 w-3 bg-slate-900 border-2 border-slate-700 rounded-sm" />

      {/* Vehicle hull */}
      <div className="w-10 h-10 bg-linear-to-b from-slate-750 via-slate-800 to-slate-850 border-2 border-slate-600 rounded-md flex items-center justify-center relative z-10">
        {/* Turret mount ring */}
        <div className="w-6 h-6 bg-slate-900 border border-slate-500 rounded-full flex items-center justify-center relative shadow-inner z-20">
          {/* Lens emitter capsule ring */}
          <div className="w-2.5 h-2.5 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center">
            <div
              className={`w-1 h-1 rounded-full ${
                selectedTurret === "ROCKET"
                  ? "bg-orange-500"
                  : selectedTurret === "SNIPER"
                    ? "bg-red-400"
                    : "bg-indigo-400"
              }`}
            />
          </div>

          {/* Render active turret */}
          {ActiveTurretSkin && <ActiveTurretSkin />}
        </div>
      </div>
    </div>
  );
}
