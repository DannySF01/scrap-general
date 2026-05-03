import { useGameStore } from "../store/useGameStore";
import { Base } from "./Base";

export function Arena() {
  const { bases, robots } = useGameStore();

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden rounded-xl border-2 border-slate-800">
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size-[100%_40px]" />

      <div className="absolute top-0 w-full p-2 border-b border-red-900/30 bg-red-950/5 flex justify-center z-0">
        <span className="text-[10px] text-red-900 font-black tracking-[0.5em]">
          SECTOR 01 // AIRSPACE RESTRICTED
        </span>
      </div>

      {bases.map((base) => (
        <Base
          key={base.id}
          base={base}
          robot={robots.find((r) => r.id === base.occupantId)}
        />
      ))}
    </div>
  );
}
