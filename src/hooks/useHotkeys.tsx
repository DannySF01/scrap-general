import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export const useHotkeys = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState();

      if (state.status !== "PLAYING") return;

      switch (e.key) {
        case "1":
          state.updateTurretType("SENTRY");
          break;
        case "2":
          state.updateTurretType("SNIPER");
          break;
        case "3":
          state.updateTurretType("ROCKET");
          break;
        case "4":
          break;
        case "5":
          state.triggerAbility("EMP");
          break;
        case "6":
          state.triggerAbility("REPAIR");
          break;
        case "7":
          state.triggerAbility("OVERCLOCK");
          break;
        case "8":
          state.triggerAbility("NAPALM");

          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};
