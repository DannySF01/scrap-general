import { create } from "zustand";
import type { Enemy, Robot, Base } from "../types/game";

interface GameState {
  scrap: number;
  luck: number;
  wave: number;
  bases: Base[];
  robots: Robot[];
  enemies: Enemy[];
  addScrap: (amount: number) => void;
  deployToBase: (baseId: number, robot: Robot["type"]) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  scrap: 0,
  luck: 0,
  wave: 0,
  bases: [
    {
      id: 1,
      name: "VANGUARD-01",
      x: 20,
      y: 85,
      isUnlocked: true,
      occupantId: null,
    },
    {
      id: 2,
      name: "ALPHA-02",
      x: 35,
      y: 80,
      isUnlocked: false,
      occupantId: null,
    },
    {
      id: 3,
      name: "CENTER-03",
      x: 50,
      y: 75,
      isUnlocked: false,
      occupantId: null,
    },
    {
      id: 4,
      name: "BRAVO-04",
      x: 65,
      y: 80,
      isUnlocked: false,
      occupantId: null,
    },
    {
      id: 5,
      name: "REAR-05",
      x: 80,
      y: 85,
      isUnlocked: false,
      occupantId: null,
    },
  ],
  robots: [],
  enemies: [],

  addScrap: (amount) => set((state) => ({ scrap: state.scrap + amount })),

  deployToBase: (baseId, type: Robot["type"]) => {
    const { bases, robots } = get();
    const targetBase = bases.find((b: Base) => b.id === baseId);

    if (!targetBase || !targetBase.isUnlocked || targetBase.occupantId) return;

    const newRobot: Robot = {
      id: crypto.randomUUID(),
      type,
      x: targetBase.x,
      y: targetBase.y,
      level: 1,
      damage: 10,
      fireRate: 1000,
      lastShot: 0,
    };

    set({
      robots: [...robots, newRobot],
      bases: bases.map((b) =>
        b.id === baseId ? { ...b, occupantId: newRobot.id } : b,
      ),
    });
  },
}));
