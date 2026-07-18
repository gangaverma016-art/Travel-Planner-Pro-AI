import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MAP_COUNTRIES, MapCountry } from "../data";
import { WashiTape } from "./DoodleIcons";

export const InteractiveMap: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<MapCountry | null>(MAP_COUNTRIES[0]);

  return (
    <div className="relative w-full bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-6 notebook-shadow overflow-hidden min-h-[550px]">
      {/* Tape effect on corner of map container */}
      <WashiTape className="-top-1 left-12" angle={-5} color="rgba(255, 107, 107, 0.7)" />
      <WashiTape className="-top-1 right-24" angle={12} color="rgba(255, 209, 102, 0.7)" />

      {/* Grid notebook paper header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b-2 border-dashed border-neutral-700 dark:border-neutral-600 pb-4 mb-6">
        <div>
          <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-[#FAF6EE] tracking-tight">
            🧭 Interactive Explorer Map
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mt-1">
            *Click on the glowing hand-drawn pins to reveal regional secrets & fun facts!*
          </p>
        </div>
        {selectedCountry && (
          <div className="mt-2 md:mt-0 bg-[#FFD166]/80 text-neutral-800 font-handwritten px-3 py-1.5 rounded-lg border-2 border-neutral-800 transform rotate-1 text-lg shadow-sm">
            Current Focus: {selectedCountry.label}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: The Map Vector */}
        <div className="lg:col-span-7 relative bg-[#EBF8FF] dark:bg-[#1A1A1A]/70 sketch-border-sm p-2 min-h-[350px] flex items-center justify-center overflow-hidden">
          {/* Stylized background grid line SVGs and sea doodle */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2D3748" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Compass rose */}
            <circle cx="85%" cy="85%" r="30" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="3,3" />
            <line x1="85%" y1="65%" x2="85%" y2="105%" stroke="#000" strokeWidth="1" />
            <line x1="65%" y1="85%" x2="105%" y2="85%" stroke="#000" strokeWidth="1" />
          </svg>

          {/* Dotted Route Vector illustration */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 300">
            {/* Italy to Japan dotted route */}
            <path
              d="M 245,100 Q 320,80 410,115"
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="2.5"
              strokeDasharray="6,6"
              className="opacity-70"
            />
            {/* Brazil to South Africa dotted route */}
            <path
              d="M 160,200 Q 210,210 270,220"
              fill="none"
              stroke="#4FACFE"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="opacity-70"
            />
            {/* South Africa to Australia dotted route */}
            <path
              d="M 270,220 Q 340,240 425,230"
              fill="none"
              stroke="#A8E6CF"
              strokeWidth="2.5"
              strokeDasharray="6,6"
              className="opacity-70"
            />
          </svg>

          {/* Simple Mock Hand-Drawn Continents represented elegantly as paths or styled cards */}
          <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center select-none font-mono text-[10px] text-neutral-700 dark:text-neutral-400">
            <span className="absolute top-[20%] left-[15%]">NORTH AMERICA</span>
            <span className="absolute top-[50%] left-[22%]">SOUTH AMERICA</span>
            <span className="absolute top-[20%] left-[45%]">EUROPE</span>
            <span className="absolute top-[55%] left-[50%]">AFRICA</span>
            <span className="absolute top-[30%] left-[70%]">ASIA</span>
            <span className="absolute top-[70%] left-[75%]">AUSTRALIA</span>
            <span className="absolute top-[40%] left-[10%]">PACIFIC OCEAN</span>
            <span className="absolute top-[65%] left-[42%]">ATLANTIC OCEAN</span>
            <span className="absolute top-[60%] left-[62%]">INDIAN OCEAN</span>
          </div>

          {/* Clickable Map Location Pins */}
          <div className="absolute inset-0">
            {MAP_COUNTRIES.map((country) => {
              const isSelected = selectedCountry?.id === country.id;

              return (
                <button
                  key={country.id}
                  onClick={() => setSelectedCountry(country)}
                  className="absolute z-10 p-2 focus:outline-none group transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: country.pinX, top: country.pinY }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Glowing pulse aura */}
                    {isSelected && (
                      <span className="absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-75 animate-ping" />
                    )}

                    {/* Styled hand-drawn pin marker */}
                    <motion.div
                      animate={isSelected ? { y: [0, -6, 0] } : {}}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-neutral-800 ${
                        isSelected ? "bg-[#FF6B6B] text-white" : "bg-[#FFD166] text-neutral-800"
                      } shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <span className="text-sm font-bold">📍</span>
                    </motion.div>

                    {/* Popover label on hover */}
                    <span className="mt-1 bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded font-mono shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      {country.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visual Legend / Doodle details */}
          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-[#1A1A1A]/90 border-2 border-neutral-800 dark:border-neutral-700 px-3 py-1.5 rounded-lg text-xs font-mono text-neutral-700 dark:text-neutral-300 flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 bg-[#FF6B6B] border border-neutral-800 dark:border-neutral-700 rounded-full"></span>
              <span>Selected Destination</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 bg-[#FFD166] border border-neutral-800 dark:border-neutral-700 rounded-full"></span>
              <span>Regional Discovery Spot</span>
            </div>
          </div>
        </div>

        {/* Right Column: Country Ticket Display Panel */}
        <div className="lg:col-span-5 flex flex-col">
          <AnimatePresence mode="wait">
            {selectedCountry ? (
              <motion.div
                key={selectedCountry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 bg-[#FFFDF6] dark:bg-[#1A1A1A] sketch-border-sm p-5 notebook-shadow relative overflow-hidden flex flex-col justify-between"
                style={{
                  backgroundImage: "radial-gradient(#E2E8F0 1.2px, transparent 1.2px)",
                  backgroundSize: "24px 24px",
                }}
              >
                {/* Boarding Ticket Jagged Border strip on left */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-800 dark:bg-neutral-600 opacity-20 flex flex-col justify-around">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-800 dark:bg-neutral-600 -translate-x-1" />
                  ))}
                </div>

                <div className="pl-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono bg-neutral-800 dark:bg-neutral-700 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                      BOARDING PASS INFO
                    </span>
                    <span className="text-2xl font-bold text-neutral-800 dark:text-[#FAF6EE]">{selectedCountry.label.split(" ")[0]}</span>
                  </div>

                  <h4 className="font-handwritten text-4xl text-neutral-800 dark:text-[#FAF6EE] mt-2 mb-1">
                    {selectedCountry.name}
                  </h4>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs font-mono italic mb-4">
                    Adventure Passport Ref: #{selectedCountry.id.toUpperCase()}-2026
                  </p>

                  <div className="space-y-3 font-mono text-sm text-neutral-700 dark:text-neutral-300">
                    <div className="grid grid-cols-2 gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                      <span className="text-neutral-400 dark:text-neutral-500">💵 Avg Daily Cost:</span>
                      <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{selectedCountry.avgCost}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                      <span className="text-neutral-400 dark:text-neutral-500">🌤 Typical Weather:</span>
                      <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{selectedCountry.weather}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                      <span className="text-neutral-400 dark:text-neutral-500">🍂 Best Season:</span>
                      <span className="font-bold text-[#FF6B6B]">{selectedCountry.bestSeason}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                      <span className="text-neutral-400 dark:text-neutral-500">🛂 Visa Status:</span>
                      <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{selectedCountry.visaInfo}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                      <span className="text-neutral-400 dark:text-neutral-500">🗣 Primary Lang:</span>
                      <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{selectedCountry.language}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1.5">
                      <span className="text-neutral-400 dark:text-neutral-500">🪙 Local Currency:</span>
                      <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{selectedCountry.currency}</span>
                    </div>

                    <div className="mt-4">
                      <span className="text-neutral-400 dark:text-neutral-500 block mb-1">🍤 Culinary Specialties:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCountry.localFood.map((food, i) => (
                          <span
                            key={i}
                            className="bg-[#A8E6CF]/70 dark:bg-[#A8E6CF]/20 text-neutral-800 dark:text-[#FAF6EE] text-[11px] px-2.5 py-1 rounded-full border border-neutral-800 dark:border-neutral-700"
                          >
                            🍽 {food}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passport stamp illustration on ticket card */}
                <div className="mt-6 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 pt-4 relative">
                  <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-2">
                    Explorer Fun Facts:
                  </span>
                  <ul className="list-none space-y-2 pl-4">
                    {selectedCountry.funFacts.map((fact, i) => (
                      <li key={i} className="font-handwritten text-lg text-neutral-700 dark:text-neutral-300 relative">
                        <span className="absolute -left-4 text-xs">✨</span>
                        "{fact}"
                      </li>
                    ))}
                  </ul>

                  {/* Stamp Badge */}
                  <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none transform rotate-12">
                    <div className="border-4 border-double border-blue-600 rounded-full w-20 h-20 flex flex-col items-center justify-center p-1 text-blue-600 dark:text-blue-400 font-mono text-[8px] font-extrabold">
                      <span>EXPLORER</span>
                      <span className="text-xs leading-none my-0.5">PASSED</span>
                      <span>{selectedCountry.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-neutral-100 dark:bg-[#2D2D2A] border-3 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-6 text-center text-neutral-400 font-mono">
                Click a country pin to start scanning information...
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
