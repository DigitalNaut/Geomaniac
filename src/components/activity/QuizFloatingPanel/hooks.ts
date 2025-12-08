import { useAnimate, useMotionValue } from "motion/react";

export function useShakeAnimation({
  onShakeStart,
  onShakeEnd,
  shakeAmount = 7,
}: {
  onShakeStart: () => void;
  onShakeEnd: () => void;
  shakeAmount?: number;
}) {
  const [scope, animate] = useAnimate();
  const x = useMotionValue(0);

  const startShake = () => {
    x.set(0);
    animate(
      scope.current,
      {
        x: [-shakeAmount, shakeAmount, 0],
      },
      {
        type: "keyframes",
        duration: 0.1,
        ease: "easeInOut",
        repeat: 2,
        onPlay: onShakeStart,
        onComplete: onShakeEnd,
        onStop: onShakeEnd,
      },
    );
  };

  return {
    scope,
    startShake,
  };
}
