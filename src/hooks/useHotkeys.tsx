import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export const useHotkeys = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState();

      // Return if game is not playing
      if (state.status !== "PLAYING") return;

      if (e.altKey) {
        e.preventDefault(); // Prevent browser behavior for alt key
        switch (e.key) {
          case "1":
            state.triggerAbility("EMP");
            break;
          case "2":
            state.triggerAbility("REPAIR");
            break;
          case "3":
            state.triggerAbility("OVERCLOCK");
            break;
          case "4":
            state.triggerAbility("NAPALM");
            break;
        }
        return;
      }

      // Weapon selection: [1-4]
      switch (e.key) {
        case "1":
          state.updateTurretType("SENTRY");
          break;
        case "2":
          state.updateTurretType("SNIPER");
          break;
        case "3":
          state.updateTurretType("SHOTGUN");
          break;
        case "4":
          state.updateTurretType("ROCKET");
          break;
        default:
          break;
      }
      // =========================================================================
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};
