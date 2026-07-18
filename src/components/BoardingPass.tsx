import React from "react";
import { motion } from "motion/react";
import { Plane, Calendar, User, Compass, Briefcase } from "lucide-react";
import { FullTripItinerary } from "../types";
import { ExplorerProfile } from "./PassportAuth";

interface BoardingPassProps {
  trip: FullTripItinerary;
  profile: ExplorerProfile;
}

export const BoardingPass: React.FC<BoardingPassProps> = ({ trip, profile }) => {
  // Generate cute randomized ticket codes
  const flightNo = `AI-${Math.floor(100 + Math.random() * 900)}`;
  const seatNo = `${Math.floor(1 + Math.random() * 28)}${["A", "C", "D", "F"][Math.floor(Math.random() * 4)]}`;
  const gateNo = `${["A", "B", "C", "D"][Math.floor(Math.random() * 4)]}${Math.floor(1 + Math.random() * 12)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0.5 }}
      whileHover={{ rotate: 0, scale: 1.01 }}
      className="w-full bg-[#FFF9E6] dark:bg-[#2D2D2A] sketch-border overflow-hidden shadow-xl flex flex-col md:flex-row relative"
    >
      {/* Tape effect */}
      <div className="absolute top-[-8px] right-24 w-12 h-6 bg-[#FF6B6B]/40 border-l border-r border-dashed border-black/10 transform rotate-12 z-20 pointer-events-none" />

      {/* Main Ticket Left Portion */}
      <div className="flex-1 p-6 relative">
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b-2 border-neutral-800 dark:border-neutral-700 pb-3 mb-4">
          <div className="flex items-center gap-1.5 text-neutral-800 dark:text-[#FAF6EE] font-bold uppercase tracking-wider font-mono text-xs">
            <Plane className="w-4.5 h-4.5 text-[#FF6B6B]" />
            <span>AI Explorer Boarding Ticket</span>
          </div>
          <span className="text-xs bg-[#FF6B6B] text-white px-2.5 py-0.5 rounded-full border border-neutral-800 font-mono font-bold">
            FIRST CLASS
          </span>
        </div>

        {/* Airport Core Codes */}
        <div className="flex items-center justify-between text-neutral-800 dark:text-[#FAF6EE] mb-6">
          <div className="flex-1">
            <span className="text-xs font-mono text-neutral-400 block">DEPARTING FROM</span>
            <span className="text-4xl font-extrabold font-mono text-neutral-800 dark:text-[#FAF6EE]">{profile.homeAirport.split(" ")[0]}</span>
            <span className="text-xs font-handwritten text-neutral-500 dark:text-neutral-400 block mt-0.5">{profile.homeAirport}</span>
          </div>

          <div className="px-4 flex flex-col items-center justify-center">
            <span className="text-[10px] font-mono text-neutral-400 block mb-1">DASH ROUTE</span>
            <div className="relative w-24 flex items-center justify-center">
              <div className="w-full border-t-2 border-dashed border-neutral-800 dark:border-neutral-700" />
              <Plane className="w-4 h-4 absolute text-[#FF6B6B] transform rotate-90" />
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-widest">Non-Stop AI</span>
          </div>

          <div className="flex-1 text-right">
            <span className="text-xs font-mono text-neutral-400 block">ARRIVING AT</span>
            <span className="text-4xl font-extrabold font-mono text-neutral-800 dark:text-[#FAF6EE]">
              {trip.destination.substring(0, 3).toUpperCase()}
            </span>
            <span className="text-xs font-handwritten text-neutral-500 dark:text-neutral-400 block mt-0.5">
              {trip.destination}, {trip.country}
            </span>
          </div>
        </div>

        {/* Detail Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs text-neutral-700 dark:text-neutral-300 bg-white/50 dark:bg-[#1A1A1A]/50 border-2 border-neutral-800 dark:border-neutral-700 rounded-2xl p-4">
          <div>
            <span className="text-neutral-400 block text-[10px]">PASSENGER NAME</span>
            <span className="font-bold text-neutral-800 dark:text-[#FAF6EE] text-sm truncate">{profile.name}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px]">FLIGHT NUMBER</span>
            <span className="font-bold text-neutral-800 dark:text-[#FAF6EE] text-sm">{flightNo}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px]">BOARDING TIME</span>
            <span className="font-bold text-[#FF6B6B] text-sm">08:45 AM</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[10px]">DATE</span>
            <span className="font-bold text-neutral-800 dark:text-[#FAF6EE] text-sm">JUL 17, 2026</span>
          </div>
        </div>

        {/* Boarding Stamp Overlay on pass */}
        <div className="absolute right-12 bottom-12 rotate-[-12deg] opacity-15 select-none pointer-events-none">
          <div className="border-4 border-[#FFD166] text-[#FFD166] rounded-xl px-4 py-2 text-3xl font-mono font-extrabold tracking-widest uppercase">
            BOARDED
          </div>
        </div>
      </div>

      {/* Jagged Tearing Dotted Line representing physical ticket tear off */}
      <div className="hidden md:flex flex-col justify-between items-center w-0.5 border-r-4 border-dashed border-neutral-800/40 dark:border-neutral-700/40 relative z-10 h-full py-1">
        <div className="w-5 h-5 rounded-full bg-[#E5E5E1] dark:bg-[#1A1A1A] border-2 border-neutral-800 dark:border-neutral-700 -translate-x-0.5 -translate-y-2.5 shadow-inner" />
        <div className="w-5 h-5 rounded-full bg-[#E5E5E1] dark:bg-[#1A1A1A] border-2 border-neutral-800 dark:border-neutral-700 -translate-x-0.5 translate-y-2.5 shadow-inner" />
      </div>

      {/* Stub Right Portion */}
      <div className="w-full md:w-64 bg-[#FFF1C5] dark:bg-[#1C1C19] p-6 flex flex-col justify-between relative border-t-4 md:border-t-0 md:border-l-0 border-neutral-800 dark:border-neutral-700">
        <div>
          <div className="flex items-center justify-between text-neutral-800 dark:text-[#FAF6EE] font-mono text-[10px] mb-4">
            <span>FLIGHT RECEIPT</span>
            <span>STUB</span>
          </div>

          <div className="space-y-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
            <div className="flex justify-between pb-1 border-b border-black/10 dark:border-white/10">
              <span className="text-neutral-400">PASSENGER:</span>
              <span className="font-bold text-neutral-800 dark:text-[#FAF6EE] truncate max-w-[120px]">{profile.name}</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-black/10 dark:border-white/10">
              <span className="text-neutral-400">DEST:</span>
              <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{trip.destination}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1.5 text-center">
              <div className="bg-white/50 dark:bg-white/10 border border-neutral-700 dark:border-neutral-600 p-1.5 rounded-lg">
                <span className="text-[8px] text-neutral-400 block leading-none">GATE</span>
                <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{gateNo}</span>
              </div>
              <div className="bg-white/50 dark:bg-white/10 border border-neutral-700 dark:border-neutral-600 p-1.5 rounded-lg">
                <span className="text-[8px] text-neutral-400 block leading-none">SEAT</span>
                <span className="font-bold text-[#FF6B6B]">{seatNo}</span>
              </div>
              <div className="bg-white/50 dark:bg-white/10 border border-neutral-700 dark:border-neutral-600 p-1.5 rounded-lg">
                <span className="text-[8px] text-neutral-400 block leading-none">ZONE</span>
                <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Barcode */}
        <div className="mt-6 flex flex-col items-center">
          {/* Barcode representation */}
          <div className="w-full h-10 bg-neutral-900 rounded flex gap-[1px] p-1 shadow-inner select-none pointer-events-none">
            {Array.from({ length: 45 }).map((_, i) => {
              const widths = ["w-[1px]", "w-[2px]", "w-[3px]", "w-[4px]"];
              const randomWidth = widths[Math.floor(Math.random() * widths.length)];
              const isSpace = Math.random() > 0.6;
              return (
                <div
                  key={i}
                  className={`h-full ${isSpace ? "bg-transparent" : "bg-white"} ${randomWidth}`}
                />
              );
            })}
          </div>
          <span className="text-[8px] font-mono text-neutral-500 tracking-[3px] mt-1">
            *EXPLORERPRO-2026*
          </span>
        </div>
      </div>
    </motion.div>
  );
};
