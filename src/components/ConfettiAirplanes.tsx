import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface AirplaneConfetti {
  id: number;
  x: number; // horizontal start %
  delay: number;
  scale: number;
  color: string;
  duration: number;
}

export const ConfettiAirplanes: React.FC<{ active: boolean }> = ({ active }) => {
  const [planes, setPlanes] = useState<AirplaneConfetti[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ["#4FACFE", "#A8E6CF", "#FFD166", "#FF6B6B", "#FF9F43", "#54A0FF"];
      const spawnedPlanes = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // random start horizontal %
        delay: Math.random() * 2, // staggered start
        scale: 0.5 + Math.random() * 0.7, // variety of sizes
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 3 + Math.random() * 4, // speed variety
      }));
      setPlanes(spawnedPlanes);

      // Clean up after 8 seconds
      const timer = setTimeout(() => {
        setPlanes([]);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (planes.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {planes.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            x: `${p.x}vw`,
            y: "-10vh",
            rotate: Math.random() * 30 - 15,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: "110vh",
            x: [
              `${p.x}vw`,
              `${p.x + (Math.random() * 20 - 10)}vw`,
              `${p.x + (Math.random() * 40 - 20)}vw`,
            ],
            rotate: [15, -25, 45, 10],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeInOut",
          }}
          className="absolute"
          style={{ width: `${40 * p.scale}px` }}
        >
          {/* Paper airplane vector */}
          <svg viewBox="0 0 100 50" className="w-full h-auto drop-shadow-md">
            <path
              d="M 10,35 L 85,15 L 45,40 L 40,48 L 47,40 L 10,35 Z"
              fill={p.color}
              stroke="#2D3748"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 45,40 L 85,15 L 10,35 L 45,40 Z"
              fill="rgba(255,255,255,0.3)"
              stroke="#2D3748"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
