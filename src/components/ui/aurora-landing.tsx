"use client";

import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Aurora from "./aurora";

interface AuroraLandingProps {
  colorStops?: string[];
  blend?: number;
  amplitude?: number;
  speed?: number;
}

const AuroraLanding = memo(function AuroraLanding({
  colorStops = ["#FF6B00", "#FFA500", "#FF4500"],
  blend = 0.7,
  amplitude = 0.4,
  speed = 0.4,
}: AuroraLandingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="absolute top-0 left-0 right-0 h-4/5 -z-10">
      <Aurora
        colorStops={colorStops}
        blend={blend}
        amplitude={amplitude}
        speed={speed}
      />
    </div>,
    document.body
  );
});

export default AuroraLanding;
