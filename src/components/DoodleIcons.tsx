import React from "react";
import { motion } from "motion/react";

// Sketch style hand-drawn borders
export const HandDrawnBorder: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`relative p-1 ${className}`}>
      {/* Rough sketch outline */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none text-neutral-800"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 2,2 Q 50,1 98,2 Q 99,50 98,98 Q 50,99 2,98 Q 1,50 2,2 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="200, 5"
          className="opacity-80"
        />
        <path
          d="M 4,4 Q 50,5 96,4 Q 95,50 96,96 Q 50,95 4,96 Q 5,50 4,4 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="opacity-40"
        />
      </svg>
      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
};

// Floating cute Cloud
export const DoodleCloud: React.FC<{ className?: string; delay?: number }> = ({
  className = "",
  delay = 0,
}) => {
  return (
    <motion.svg
      className={`text-[#4FACFE]/30 fill-white ${className}`}
      viewBox="0 0 100 60"
      width="120"
      height="70"
      animate={{
        y: [0, -10, 0],
        x: [0, 5, 0],
      }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <path
        d="M 10,40 Q 5,30 15,20 Q 25,10 40,20 Q 50,5 65,15 Q 80,10 85,25 Q 95,30 90,45 Q 85,55 70,52 Q 50,55 30,52 Q 15,55 10,40 Z"
        stroke="#2D3748"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
};

// Interactive rotating compass
export const DoodleCompass: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.div
      className={`relative w-24 h-24 flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-800">
        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#FFF"
          stroke="#2D3748"
          strokeWidth="3"
          strokeDasharray="4,2"
        />
        <circle cx="50" cy="50" r="41" fill="none" stroke="#2D3748" strokeWidth="1.5" />

        {/* Direction markers */}
        <text x="47" y="18" className="text-[10px] font-bold fill-neutral-800 font-mono">N</text>
        <text x="47" y="90" className="text-[10px] font-bold fill-neutral-800 font-mono">S</text>
        <text x="82" y="54" className="text-[10px] font-bold fill-neutral-800 font-mono">E</text>
        <text x="12" y="54" className="text-[10px] font-bold fill-neutral-800 font-mono">W</text>

        {/* Needle group */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50px 50px" }}
        >
          {/* North needle - Coral */}
          <path d="M 50,50 L 45,50 L 50,22 Z" fill="#FF6B6B" stroke="#2D3748" strokeWidth="1.5" />
          {/* South needle - Grey */}
          <path d="M 50,50 L 55,50 L 50,78 Z" fill="#CBD5E0" stroke="#2D3748" strokeWidth="1.5" />
          {/* Center pivot */}
          <circle cx="50" cy="50" r="4" fill="#FFD166" stroke="#2D3748" strokeWidth="2" />
        </motion.g>
      </svg>
    </motion.div>
  );
};

// Flying Paper Airplane
export const FlyingPaperAirplane: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        x: [-40, 100, 300, 600, 1000],
        y: [0, -50, 40, -60, 20],
        rotate: [15, -10, 25, -5, 10],
      }}
      transition={{
        duration: 16,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 100 50" width="80" height="40" className="text-[#FFD166]">
        <path
          d="M 10,35 L 85,15 L 45,40 L 40,48 L 47,40 L 10,35 Z"
          fill="#FFF9E6"
          stroke="#2D3748"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 45,40 L 85,15 L 10,35 L 45,40 Z"
          fill="#FFD166"
          stroke="#2D3748"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 45,40 L 40,48 L 47,40 Z"
          fill="#FF6B6B"
          stroke="#2D3748"
          strokeWidth="1"
          strokeLinecap="round"
        />
        {/* dashed wind trails */}
        <path
          d="M 2,42 Q -10,40 -20,45"
          fill="none"
          stroke="#A8E6CF"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <path
          d="M 6,48 Q -5,45 -15,52"
          fill="none"
          stroke="#4FACFE"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />
      </svg>
    </motion.div>
  );
};

// Hand-Drawn Arrow pointer
export const HandDrawnArrow: React.FC<{ className?: string; direction?: "left" | "right" | "down" }> = ({
  className = "",
  direction = "right",
}) => {
  const getPath = () => {
    switch (direction) {
      case "left":
        return "M 45,25 C 30,22 20,30 5,25 M 5,25 L 15,15 M 5,25 L 15,35";
      case "down":
        return "M 25,5 C 22,20 30,30 25,45 M 25,45 L 15,35 M 25,45 L 35,35";
      case "right":
      default:
        return "M 5,25 C 20,22 30,30 45,25 M 45,25 L 35,15 M 45,25 L 35,35";
    }
  };

  return (
    <svg viewBox="0 0 50 50" width="40" height="40" className={`text-neutral-800 ${className}`}>
      <path
        d={getPath()}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Notebook Washi Tape Strip effect
export const WashiTape: React.FC<{ className?: string; angle?: number; color?: string }> = ({
  className = "",
  angle = -3,
  color = "rgba(168, 230, 207, 0.6)", // mint soft transparent
}) => {
  return (
    <div
      className={`absolute z-20 pointer-events-none ${className}`}
      style={{
        transform: `rotate(${angle}deg)`,
        backgroundColor: color,
        width: "100px",
        height: "22px",
        borderLeft: "2px dashed rgba(0,0,0,0.15)",
        borderRight: "2px dashed rgba(0,0,0,0.15)",
        boxShadow: "1px 1px 3px rgba(0,0,0,0.05)",
      }}
    />
  );
};

// Hand-drawn Suitcase illustration that "fills up" as checklist is completed
export const PackingSuitcase: React.FC<{
  className?: string;
  completionRate: number; // 0 to 1
}> = ({ className = "", completionRate }) => {
  const isFilled = completionRate > 0.75;
  const isHalf = completionRate > 0.25 && completionRate <= 0.75;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Hand-drawn luggage outline */}
      <svg viewBox="0 0 120 100" className="w-48 h-40 text-neutral-800">
        {/* Handle */}
        <path
          d="M 45,20 C 45,8 75,8 75,20"
          fill="none"
          stroke="#2D3748"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Main Suitcase Box */}
        <rect
          x="20"
          y="25"
          width="80"
          height="65"
          rx="12"
          fill="#FF6B6B"
          stroke="#2D3748"
          strokeWidth="3.5"
        />

        {/* Corner protections */}
        <path d="M 20,37 A 12,12 0 0,1 32,25" fill="none" stroke="#2D3748" strokeWidth="2.5" />
        <path d="M 88,25 A 12,12 0 0,1 100,37" fill="none" stroke="#2D3748" strokeWidth="2.5" />
        <path d="M 20,78 A 12,12 0 0,0 32,90" fill="none" stroke="#2D3748" strokeWidth="2.5" />
        <path d="M 88,90 A 12,12 0 0,0 100,78" fill="none" stroke="#2D3748" strokeWidth="2.5" />

        {/* Straps/Details */}
        <line x1="40" y1="25" x2="40" y2="90" stroke="#2D3748" strokeWidth="2" strokeDasharray="4,2" />
        <line x1="80" y1="25" x2="80" y2="90" stroke="#2D3748" strokeWidth="2" strokeDasharray="4,2" />

        {/* Pocket / Label */}
        <rect
          x="48"
          y="42"
          width="24"
          height="16"
          rx="3"
          fill="#FFD166"
          stroke="#2D3748"
          strokeWidth="2"
        />
        <line x1="53" y1="50" x2="67" y2="50" stroke="#2D3748" strokeWidth="1.5" />

        {/* Animated stickers depending on packing level */}
        {completionRate > 0 && (
          <g>
            {/* Stamp Sticker 1 */}
            <polygon points="26,45 36,40 40,50 30,55" fill="#A8E6CF" stroke="#2D3748" strokeWidth="1.5" />
            <text x="28" y="49" className="text-[5px] font-bold font-mono fill-neutral-800">OK</text>
          </g>
        )}

        {isHalf && (
          <g>
            {/* Stamp Sticker 2 */}
            <circle cx="86" cy="70" r="8" fill="#4FACFE" stroke="#2D3748" strokeWidth="1.5" />
            <text x="81" y="73" className="text-[6px] font-bold font-mono fill-white">GO!</text>
          </g>
        )}

        {isFilled && (
          <g>
            {/* Big Heart stamp */}
            <path
              d="M 50,75 C 48,70 42,70 42,75 C 42,80 50,85 50,85 C 50,85 58,80 58,75 C 58,70 52,70 50,75"
              fill="#FFD166"
              stroke="#2D3748"
              strokeWidth="1.5"
            />
          </g>
        )}
      </svg>

      {/* Floating progress checklist text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[8px] flex flex-col items-center">
        <span className="text-xs font-handwritten font-bold text-neutral-800 bg-white/80 px-1 rounded-sm border border-neutral-700/30">
          {Math.round(completionRate * 100)}% Packed
        </span>
      </div>
    </div>
  );
};

// Hand-drawn Passport Stamp transition badge
export const PassportStamp: React.FC<{
  text: string;
  country?: string;
  className?: string;
}> = ({ text, country = "PLANNER PRO AI", className = "" }) => {
  return (
    <motion.div
      className={`relative w-28 h-28 flex items-center justify-center border-4 border-dashed border-[#FF6B6B] rounded-full text-center rotate-12 p-2 ${className}`}
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 12 }}
      transition={{ type: "spring", damping: 12 }}
    >
      <div className="border border-double border-[#FF6B6B] rounded-full w-full h-full flex flex-col items-center justify-center p-1 bg-white/95">
        <span className="text-[7px] font-bold tracking-widest text-[#FF6B6B] uppercase">{country}</span>
        <span className="text-xs font-extrabold text-[#FF6B6B] font-mono leading-none my-1">{text}</span>
        <span className="text-[6px] text-neutral-400 font-mono">APPROVED</span>
      </div>
    </motion.div>
  );
};

// Polaroid Camera Doodle
export const DoodleCamera: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg viewBox="0 0 100 80" className={`text-neutral-800 ${className}`} width="70" height="56">
      {/* Camera Body */}
      <rect x="5" y="15" width="90" height="60" rx="8" fill="#E2E8F0" stroke="currentColor" strokeWidth="3" />
      {/* Top Flash */}
      <rect x="15" y="5" width="20" height="10" rx="2" fill="#FFD166" stroke="currentColor" strokeWidth="2.5" />
      {/* Shutter Button */}
      <circle cx="75" cy="10" r="5" fill="#FF6B6B" stroke="currentColor" strokeWidth="2" />
      {/* Big Lens */}
      <circle cx="50" cy="45" r="22" fill="#FFF" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="45" r="15" fill="#4FACFE" stroke="currentColor" strokeWidth="2" />
      <circle cx="45" cy="40" r="4" fill="#FFF" />
      {/* Red/Yellow stripe detail */}
      <path d="M 5,25 L 95,25" stroke="#FF6B6B" strokeWidth="2" />
      <path d="M 5,28 L 95,28" stroke="#FFD166" strokeWidth="2" />
    </svg>
  );
};

// Palm Tree Doodle
export const DoodlePalmTree: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg viewBox="0 0 80 100" className={`text-neutral-800 ${className}`} width="60" height="75">
      {/* Trunk */}
      <path
        d="M 40,95 Q 35,60 50,25"
        fill="none"
        stroke="#2D3748"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Trunk ridges */}
      <path d="M 37,80 L 43,82" stroke="#2D3748" strokeWidth="2" />
      <path d="M 39,60 L 45,62" stroke="#2D3748" strokeWidth="2" />
      <path d="M 43,40 L 49,42" stroke="#2D3748" strokeWidth="2" />

      {/* Leaves */}
      <g stroke="#2D3748" strokeWidth="3" fill="#A8E6CF" strokeLinecap="round" strokeLinejoin="round">
        {/* Left leaf */}
        <path d="M 50,25 Q 20,20 10,40 C 15,35 30,30 50,25" />
        {/* Top-left leaf */}
        <path d="M 50,25 Q 30,5 25,5 C 32,12 40,20 50,25" />
        {/* Top-right leaf */}
        <path d="M 50,25 Q 70,5 75,10 C 68,18 58,22 50,25" />
        {/* Right leaf */}
        <path d="M 50,25 Q 75,30 70,50 C 65,42 58,35 50,25" />
      </g>
      {/* Coconuts */}
      <circle cx="45" cy="28" r="3" fill="#FFF1C5" stroke="#2D3748" strokeWidth="1.5" />
      <circle cx="51" cy="30" r="3.5" fill="#FFF1C5" stroke="#2D3748" strokeWidth="1.5" />
    </svg>
  );
};
