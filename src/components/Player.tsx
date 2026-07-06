import { useGameStore } from "../store/useGameStore";
import { TURRET_SKINS } from "./TurretSkins";
import tankImg from "../assets/player/tank.png";

export default function Player() {
  const selectedTurret = useGameStore((state) => state.selectedTurretType);
  const ActiveTurretSkin = TURRET_SKINS[selectedTurret];

  return (
    <div className="w-30 h-30 relative flex items-center justify-center will-change-transform select-none pointer-events-none">
      <div className="absolute inset-6 bg-black/30 rounded-full filter blur-sm translate-y-4 translate-x-2 mix-blend-multiply z-0" />

      <div
        className="absolute inset-0 z-10 mix-blend-multiply"
        style={{
          backgroundImage: `url(${tankImg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.8) contrast(1.4) saturate(0.9)",
        }}
      />

      <div className="absolute top-[34%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-16 h-16 z-20 flex items-center justify-center">
        {ActiveTurretSkin ? (
          <div className=" transition-transform duration-200 filter brightness-[1.1] contrast-[1.2]">
            <ActiveTurretSkin />
          </div>
        ) : null}
      </div>
    </div>
  );
}
