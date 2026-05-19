import { AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { Base } from "./Base";
import { EnemyUnit } from "./EnemyUnit";
import { LaserBeam } from "./LaserBeam";
import { FortressWall } from "./FortressWall";
import CommandCenter from "./CommandCenter";
import { WaveAlert } from "./WaveAlert";
import UpperTerminal from "./UpperTerminal";

export function Arena() {
  const { bases, robots, enemies, abilityActive } = useGameStore();

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden rounded-xl border-2 border-slate-800">
      <UpperTerminal />

      <WaveAlert />

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
      {abilityActive.find((a) => a === "NAPALM") && (
        <div className="napalm-overlay">
          <div className="fire-glow" />
        </div>
      )}
      <FortressWall />
      <CommandCenter />
    </div>
  );
}
