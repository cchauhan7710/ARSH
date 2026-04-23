// /src/hooks/useTilt.js
import { useRef, useEffect } from "react";

export function useTilt(maxTilt = 10) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const state = {
      rect: null,
      x: 0,
      y: 0,
    };

    function handleMouseMove(e) {
      if (!state.rect) state.rect = el.getBoundingClientRect();
      const { left, top, width, height } = state.rect;

      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      state.x = x * maxTilt;
      state.y = y * -maxTilt;

      el.style.transform = `
        perspective(900px)
        rotateX(${state.y}deg)
        rotateY(${state.x}deg)
        scale3d(1.03, 1.03, 1.03)
      `;
    }

    function reset() {
      el.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
      state.rect = null;
    }

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", reset);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, [maxTilt]);

  return ref;
}
