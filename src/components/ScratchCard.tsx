import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw, Eye } from "lucide-react";

interface SecretDestination {
  id: number;
  name: string;
  country: string;
  facts: string;
  bestSeason: string;
  currency: string;
  localFood: string;
  budget: string;
  image: string;
  icon: string;
}

const SECRET_DESTINATIONS: SecretDestination[] = [
  {
    id: 1,
    name: "Cappadocia",
    country: "Turkey",
    facts: "Famous for surreal fairy chimney rock formations and hundreds of hot air balloons floating at sunrise.",
    bestSeason: "April to June (Spring)",
    currency: "Turkish Lira (₺)",
    localFood: "Testi Kebab (Claypot Stew)",
    budget: "$$",
    image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=500&q=80",
    icon: "🎈"
  },
  {
    id: 2,
    name: "Salar de Uyuni",
    country: "Bolivia",
    facts: "The world's largest salt flat, turning into a giant, crystal-clear mirror reflecting the sky during rainy seasons.",
    bestSeason: "December to April",
    currency: "Bolivian Boliviano (Bs)",
    localFood: "Salteñas (Bolivian Empanadas)",
    budget: "$",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=500&q=80",
    icon: "🪞"
  },
  {
    id: 3,
    name: "Petra Ancient City",
    country: "Jordan",
    facts: "A prehistoric archaeological city carved directly into red-pink desert sandstone cliffs.",
    bestSeason: "September to November",
    currency: "Jordanian Dinar (JD)",
    localFood: "Mansaf (Spiced Lamb and Rice)",
    budget: "$$$",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=500&q=80",
    icon: "🏛️"
  }
];

export const ScratchCard: React.FC = () => {
  // Array tracking whether each card has been scratched/revealed
  const [scratched, setScratched] = useState<{ [key: number]: boolean }>({});
  const [currentPool, setCurrentPool] = useState<SecretDestination[]>(SECRET_DESTINATIONS);

  const handleReveal = (id: number) => {
    setScratched((prev) => ({ ...prev, [id]: true }));
  };

  const handleReset = () => {
    setScratched({});
  };

  return (
    <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-6 notebook-shadow relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-dashed border-neutral-700 dark:border-neutral-600 pb-4 mb-6">
        <div>
          <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-[#FAF6EE] tracking-tight flex items-center gap-2">
            ✨ Scratch-Off Secret Discoveries
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mt-1">
            *Rub off or click the silver travel badges to reveal secret hand-picked wonders!*
          </p>
        </div>
        <button
          onClick={handleReset}
          className="mt-2 sm:mt-0 font-handwritten text-lg text-neutral-800 bg-[#A8E6CF] hover:bg-[#83d3b7] px-4 py-1.5 rounded-lg border-2 border-neutral-800 shadow-sm flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-4 h-4 stroke-[2.5]" />
          Re-seal Foil Sticker
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentPool.map((dest) => {
          const isRevealed = scratched[dest.id];

          return (
            <div
              key={dest.id}
              className="relative min-h-[360px] bg-white dark:bg-[#1A1A1A] sketch-border-sm p-4 notebook-shadow overflow-hidden flex flex-col justify-between"
              style={{
                backgroundImage: "linear-gradient(rgba(247, 250, 252, 0.5) 1px, transparent 1px)",
                backgroundSize: "100% 20px",
              }}
            >
              <AnimatePresence mode="wait">
                {!isRevealed ? (
                  /* SCRATCH PANEL (FOIL STATE) */
                  <motion.div
                    key="foil"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleReveal(dest.id)}
                    className="absolute inset-0 z-30 bg-neutral-300 dark:bg-neutral-800 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none border-1 border-neutral-400 dark:border-neutral-700 group"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #CBD5E0, #CBD5E0 10px, #E2E8F0 10px, #E2E8F0 20px)`,
                    }}
                  >
                    {/* Metallic Badge circle */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-neutral-400 to-neutral-200 dark:from-neutral-700 dark:to-neutral-500 border-4 border-dashed border-neutral-600 dark:border-neutral-400 flex flex-col items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                      <span className="text-3xl filter drop-shadow">🌟</span>
                      <span className="text-[9px] font-mono font-bold text-neutral-700 dark:text-neutral-300 tracking-wider mt-1">
                        SCRATCH OFF
                      </span>
                    </div>

                    <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-[#FAF6EE] mt-4 leading-none">
                      Mystery Wanderlust #{dest.id}
                    </h4>
                    <p className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 mt-1.5 uppercase tracking-widest">
                      *Click Badge to reveal*
                    </p>

                    {/* Cute hand-drawn arrow */}
                    <div className="absolute bottom-4 right-4 animate-bounce">
                      <span className="text-xl">👉</span>
                    </div>
                  </motion.div>
                ) : (
                  /* REVEALED STATE (POLAROID TAPE LOOK) */
                  <motion.div
                    key="reveal"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col justify-between h-full z-10"
                  >
                    <div className="relative">
                      {/* Polaroid Image Box */}
                      <div className="relative border-2 border-neutral-800 dark:border-neutral-700 rounded-lg overflow-hidden h-36 bg-neutral-100 dark:bg-neutral-800 shadow-inner">
                        <img
                          referrerPolicy="no-referrer"
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/80 border border-neutral-800 dark:border-neutral-700 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-neutral-800 dark:text-white">
                          {dest.icon} {dest.budget}
                        </div>
                      </div>

                      {/* Header */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-[#FAF6EE] leading-none">
                            {dest.name}
                          </h4>
                          <span className="text-xs font-mono bg-[#A8E6CF] text-neutral-800 border border-neutral-800 px-2 py-0.5 rounded-full">
                            {dest.country}
                          </span>
                        </div>
                        <p className="font-handwritten text-[15px] text-neutral-600 dark:text-neutral-300 leading-tight mt-1.5">
                          "{dest.facts}"
                        </p>
                      </div>
                    </div>

                    {/* Quick attributes */}
                    <div className="mt-4 border-t border-dashed border-neutral-300 dark:border-neutral-700 pt-2.5 space-y-1.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                      <div className="flex justify-between">
                        <span>🌤 Season:</span>
                        <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{dest.bestSeason}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🪙 Currency:</span>
                        <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{dest.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🥘 Local Bite:</span>
                        <span className="font-bold text-[#FF6B6B]">{dest.localFood}</span>
                      </div>
                    </div>

                    {/* Fun stamp indicator inside revealed card */}
                    <div className="absolute bottom-0 right-0 rotate-12 opacity-30 select-none text-2xl dark:text-white">
                      ⭐ REVEALED
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
