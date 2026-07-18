import React, { useState } from "react";
import { motion } from "motion/react";
import { Plane, Hotel, Utensils, Compass, ShoppingBag, ShieldAlert, DollarSign } from "lucide-react";
import { TripBudget } from "../types";

interface BudgetEstimatorProps {
  budget: TripBudget;
}

export const BudgetEstimator: React.FC<BudgetEstimatorProps> = ({ budget }) => {
  const [activeCategory, setActiveCategory] = useState<keyof TripBudget | "total">("total");

  // Map categories to visual labels and icons
  const categoriesList = [
    { key: "flights", label: "Flight Tickets", value: budget.flights, color: "#4FACFE", icon: Plane },
    { key: "hotels", label: "Accommodations", value: budget.hotels, color: "#FF6B6B", icon: Hotel },
    { key: "food", label: "Local Eateries", value: budget.food, color: "#FFD166", icon: Utensils },
    { key: "transport", label: "Local Transit", value: budget.transport, color: "#A8E6CF", icon: Compass },
    { key: "activities", label: "Excursions/Tours", value: budget.activities, color: "#FF9F43", icon: DollarSign },
    { key: "shopping", label: "Souvenirs/Gifts", value: budget.shopping, color: "#54A0FF", icon: ShoppingBag },
    { key: "emergency", label: "Emergency Reserve", value: budget.emergency, color: "#2ED573", icon: ShieldAlert },
  ];

  // Circle progress computations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const activeBudget = activeCategory === "total" ? budget.total : (budget[activeCategory as keyof TripBudget] || 0);
  const activePercentage = activeCategory === "total" ? 100 : Math.round((activeBudget / budget.total) * 100);

  // Computed dash offsets
  const strokeDashoffset = circumference - (activePercentage / 100) * circumference;

  return (
    <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-6 notebook-shadow relative overflow-hidden">
      <div className="border-b-2 border-dashed border-neutral-700 dark:border-neutral-600 pb-4 mb-6">
        <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-[#FAF6EE] tracking-tight">
          💰 Smart AI Budget Predictor
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mt-1">
          *Hover over or tap any item to isolate its slice in the custom notebook gauge!*
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Visual Progress Circle Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white dark:bg-[#1A1A1A] sketch-border-sm notebook-shadow min-h-[300px]">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG custom hand-drawn styled circle progress */}
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle outline */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                className="text-neutral-100 dark:text-neutral-800"
                strokeWidth="12"
                stroke="currentColor"
                fill="none"
              />
              {/* Highlight Progress path */}
              <motion.circle
                cx="96"
                cy="96"
                r={radius}
                className="text-[#FF6B6B]"
                strokeWidth="12"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
              />
            </svg>

            {/* Inner text metric */}
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest leading-none">
                {activeCategory === "total" ? "EST TOTAL" : `${activeCategory.toUpperCase()}`}
              </span>
              <span className="font-handwritten text-3xl font-extrabold text-neutral-800 dark:text-[#FAF6EE] mt-1">
                ${activeBudget}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5 font-bold">
                {activePercentage}% of total
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setActiveCategory("total")}
              className={`font-mono text-[11px] font-bold px-3 py-1 rounded-full border border-neutral-800 dark:border-neutral-700 transition-colors ${
                activeCategory === "total"
                  ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"
                  : "bg-white dark:bg-[#1A1A1A] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-[#FAF6EE]"
              }`}
            >
              Reset to Overall Total
            </button>
          </div>
        </div>

        {/* Right Column: Expense Category Item Cards Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.key;
              const percentage = Math.round((cat.value / budget.total) * 100);

              return (
                <div
                  key={cat.key}
                  onMouseEnter={() => setActiveCategory(cat.key as any)}
                  className={`border-2 border-neutral-800 dark:border-neutral-700 p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isActive ? "bg-white dark:bg-[#1A1A1A] transform -translate-y-0.5 shadow-md" : "bg-[#FFFDF9]/60 dark:bg-[#1A1A1A]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg border-2 border-neutral-800 dark:border-neutral-700 flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${cat.color}30` }}
                    >
                      <Icon className="w-5 h-5 text-neutral-800 dark:text-[#FAF6EE]" />
                    </div>
                    <div>
                      <h4 className="font-handwritten text-lg font-bold text-neutral-800 dark:text-[#FAF6EE] leading-none">
                        {cat.label}
                      </h4>
                      <span className="font-mono text-[10px] text-neutral-400 uppercase mt-1 block">
                        {percentage}% of budget
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-bold text-neutral-800 dark:text-[#FAF6EE]">
                    ${cat.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Combined Total Display bar */}
          <div className="bg-[#A8E6CF]/30 dark:bg-[#A8E6CF]/10 border-2 border-neutral-800 dark:border-neutral-700 rounded-xl p-3 flex items-center justify-between font-mono text-sm mt-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">Total Predicted Budget:</span>
            </div>
            <span className="text-lg font-extrabold text-neutral-800 dark:text-[#FAF6EE] font-mono">
              ${budget.total}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
