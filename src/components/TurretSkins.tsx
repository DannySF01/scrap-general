import React from "react";

import sentryImg from "../assets/turrets/sentry.png";
import sniperImg from "../assets/turrets/sniper.png";
import rocketImg from "../assets/turrets/rocket.png";

interface TurretSkinProps {
  isIcon?: boolean;
}

export const SentrySkin: React.FC<TurretSkinProps> = ({ isIcon }) => {
  return (
    <div className="w-20 h-20 relative pointer-events-none transition-transform duration-75">
      <img
        src={sentryImg}
        alt="Sentry Turret"
        className="w-full h-full object-contain filter brightness-[1.05] contrast-[1.1]"
        style={{
          transform: isIcon
            ? "scale(1.0) translateY(0%)"
            : "scale(1.1) translateY(0%)",
        }}
      />
    </div>
  );
};

export const SniperSkin: React.FC<TurretSkinProps> = ({ isIcon }) => {
  return (
    <div className="w-20 h-20 relative pointer-events-none transition-transform duration-75">
      <img
        src={sniperImg}
        alt="Sniper Turret"
        className="w-full h-full object-contain filter brightness-[1.05] contrast-[1.1] "
        style={{
          transform: isIcon
            ? "scale(1.0) translateY(0%)"
            : "scale(1.1) translateY(-15%)",
        }}
      />
    </div>
  );
};

export const RocketSkin: React.FC<TurretSkinProps> = ({ isIcon }) => {
  return (
    <div className="w-20 h-20 relative pointer-events-none transition-transform duration-75">
      <img
        src={rocketImg}
        alt="Rocket Turret"
        className="w-full h-full object-contain filter brightness-[1.05] contrast-[1.1] "
        style={{
          transform: isIcon
            ? "scale(1.0) translateY(0%)"
            : "scale(1.1) translateY(0%)",
        }}
      />
    </div>
  );
};

export const TURRET_SKINS = {
  SENTRY: SentrySkin,
  SNIPER: SniperSkin,
  ROCKET: RocketSkin,
};
