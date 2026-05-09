import { AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { Base } from "./Base";
import { EnemyUnit } from "./EnemyUnit";
import { LaserBeam } from "./LaserBeam";
import { FortressWall } from "./FortressWall";

export function Arena() {
  const { bases, robots, enemies } = useGameStore();

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden rounded-xl border-2 border-slate-800">
      <div className="absolute top-0 w-full p-2 border-b border-red-900/30 bg-red-950/5 flex justify-center z-0">
        <span className="text-[10px] text-red-900 font-black tracking-[0.5em]">
          SECTOR 01 // AIRSPACE RESTRICTED
        </span>
      </div>
      {robots.map(
        (robot) =>
          robot.lastTargetPos &&
          robot.position && (
            <LaserBeam
              key={`laser-${robot.id}-${robot.lastShot}`}
              from={robot.position}
              to={robot.lastTargetPos}
            />
          ),
      )}
      {bases.map((base) => (
        <Base
          key={base.id}
          base={base}
          robot={robots.find((r) => r.id === base.occupantId)}
        />
      ))}
      <AnimatePresence>
        {enemies.map((enemy) => (
          <EnemyUnit key={enemy.id} enemy={enemy} />
        ))}
      </AnimatePresence>
      <FortressWall />
    </div>
  );
}
