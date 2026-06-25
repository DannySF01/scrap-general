import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export const useTurretHotkeys = () => {
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
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
};
