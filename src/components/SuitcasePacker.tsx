import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Plus, Trash, Download, Printer } from "lucide-react";
import { PackingSuitcase, WashiTape } from "./DoodleIcons";
import { PackingCategory } from "../types";

const INITIAL_CHECKLIST: PackingCategory[] = [
  {
    category: "Essentials",
    items: ["Passport & Visa", "Travel Insurance Policy", "Plane/Train Tickets", "Wallet & Credit Cards", "Emergency cash"]
  },
  {
    category: "Clothing",
    items: ["Undergarments", "Socks", "Comfortable walking sneakers", "T-shirts & Tops", "Pants/Shorts", "Light jacket"]
  },
  {
    category: "Electronics",
    items: ["Smartphone & Charger", "Universal Travel Adapter", "Power bank", "Headphones/Earbuds"]
  },
  {
    category: "Toiletries",
    items: ["Toothbrush & Toothpaste", "Travel Shampoo & Soap", "Deodorant", "Small quick-dry towel"]
  }
];

export const SuitcasePacker: React.FC<{ customChecklist?: PackingCategory[] }> = ({ customChecklist }) => {
  const [checklist, setChecklist] = useState<PackingCategory[]>(INITIAL_CHECKLIST);
  const [packedItems, setPackedItems] = useState<{ [key: string]: boolean }>({});
  const [newItemText, setNewItemText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Essentials");

  // Sync with AI custom checklists if one is generated
  useEffect(() => {
    if (customChecklist && customChecklist.length > 0) {
      setChecklist(customChecklist);
      // Reset packed items state
      setPackedItems({});
    }
  }, [customChecklist]);

  // Calculate stats
  const totalItemsCount = checklist.reduce((sum, cat) => sum + cat.items.length, 0);
  const packedItemsCount = Object.values(packedItems).filter(Boolean).length;
  const completionRate = totalItemsCount > 0 ? packedItemsCount / totalItemsCount : 0;

  const handleToggle = (item: string) => {
    setPackedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    setChecklist((prev) =>
      prev.map((cat) => {
        if (cat.category === selectedCategory) {
          return {
            ...cat,
            items: [...cat.items, newItemText.trim()],
          };
        }
        return cat;
      })
    );
    setNewItemText("");
  };

  const handleRemoveItem = (categoryName: string, itemToRemove: string) => {
    setChecklist((prev) =>
      prev.map((cat) => {
        if (cat.category === categoryName) {
          return {
            ...cat,
            items: cat.items.filter((it) => it !== itemToRemove),
          };
        }
        return cat;
      })
    );
    // Remove from packed tracking too
    if (packedItems[itemToRemove]) {
      setPackedItems((prev) => {
        const copy = { ...prev };
        delete copy[itemToRemove];
        return copy;
      });
    }
  };

  const downloadChecklistTxt = () => {
    let text = `🎒 MY ADVENTURE PACKING MANIFEST 🎒\n`;
    text += `Completion rate: ${Math.round(completionRate * 100)}% packed (${packedItemsCount}/${totalItemsCount} items)\n`;
    text += `==================================\n\n`;

    checklist.forEach((cat) => {
      text += `📁 ${cat.category.toUpperCase()}\n`;
      cat.items.forEach((item) => {
        const isPacked = packedItems[item] ? "[X]" : "[ ]";
        text += `  ${isPacked} ${item}\n`;
      });
      text += `\n`;
    });

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "packing_manifest.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printChecklist = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-6 notebook-shadow relative overflow-hidden">
      <WashiTape className="-top-1 left-24" angle={-2} color="rgba(168, 230, 207, 0.7)" />

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-dashed border-neutral-700 dark:border-neutral-600 pb-4 mb-6">
        <div>
          <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-[#FAF6EE] tracking-tight">
            🧳 Smart Suitcase & Packer
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mt-1">
            *Check off your packed items and watch your suitcase load up with stamps!*
          </p>
        </div>

        <div className="flex gap-2 mt-3 md:mt-0">
          <button
            onClick={downloadChecklistTxt}
            className="font-mono text-xs text-neutral-800 dark:text-[#FAF6EE] bg-white dark:bg-[#1A1A1A] hover:bg-neutral-100 dark:hover:bg-neutral-800 border-2 border-neutral-800 dark:border-neutral-700 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            Download .txt
          </button>
          <button
            onClick={printChecklist}
            className="font-mono text-xs text-neutral-800 dark:text-[#FAF6EE] bg-white dark:bg-[#1A1A1A] hover:bg-neutral-100 dark:hover:bg-neutral-800 border-2 border-neutral-800 dark:border-neutral-700 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List representation */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1A1A1A] sketch-border-sm p-6 relative notebook-shadow">
          {/* Lined paper margin line on left */}
          <div className="absolute left-8 top-0 bottom-0 w-[1.5px] bg-[#FF6B6B] opacity-40 pointer-events-none" />

          <div className="pl-6 space-y-6">
            <div className="flex flex-wrap gap-1.5 border-b border-neutral-200 dark:border-neutral-700 pb-4">
              {checklist.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`font-handwritten text-lg px-3 py-1 rounded-lg border-2 transition-all ${
                    selectedCategory === cat.category
                      ? "bg-[#FF6B6B] text-white border-neutral-800 dark:border-neutral-700 transform -rotate-1"
                      : "bg-neutral-50 dark:bg-[#2D2D2A] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-[#FAF6EE] border-transparent"
                  }`}
                >
                  {cat.category} ({cat.items.length})
                </button>
              ))}
            </div>

            {/* Render selected category list items */}
            {checklist
              .filter((cat) => cat.category === selectedCategory)
              .map((cat) => (
                <div key={cat.category} className="space-y-3">
                  <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-[#FAF6EE] border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-1 flex items-center gap-1.5">
                    📁 {cat.category} Items:
                  </h4>

                  {cat.items.length === 0 ? (
                    <p className="text-neutral-400 font-handwritten text-lg italic pl-4">
                      Empty category! Add some adventure gear below...
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {cat.items.map((item, idx) => {
                        const isPacked = !!packedItems[item];
                        return (
                          <motion.div
                            key={idx}
                            layout
                            className={`flex items-center justify-between p-2 rounded-lg border-2 ${
                              isPacked ? "bg-[#A8E6CF]/30 dark:bg-[#A8E6CF]/20 border-[#A8E6CF] dark:border-[#A8E6CF]/40" : "bg-[#FAF6EE] dark:bg-[#2D2D2A] border-transparent"
                            } transition-colors group`}
                          >
                            <label className="flex items-center gap-3 cursor-pointer flex-1 py-1">
                              <input
                                type="checkbox"
                                checked={isPacked}
                                onChange={() => handleToggle(item)}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-md border-2 border-neutral-800 dark:border-neutral-700 flex items-center justify-center ${
                                  isPacked ? "bg-[#A8E6CF]" : "bg-white dark:bg-[#1A1A1A]"
                                }`}
                              >
                                {isPacked && <Check className="w-3.5 h-3.5 text-neutral-800 stroke-[3]" />}
                              </div>
                              <span
                                className={`font-handwritten text-xl leading-none ${
                                  isPacked ? "line-through text-neutral-400" : "text-neutral-800 dark:text-[#FAF6EE]"
                                }`}
                              >
                                {item}
                              </span>
                            </label>

                            <button
                              onClick={() => handleRemoveItem(cat.category, item)}
                              className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-[#FF6B6B] transition-opacity p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

            {/* Quick Add Form */}
            <form onSubmit={handleAddItem} className="flex gap-2 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-700">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder={`Add item to ${selectedCategory}...`}
                className="flex-1 bg-white dark:bg-[#2D2D2A] border-2 border-neutral-800 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-sm font-mono focus:outline-none focus:bg-neutral-50 dark:focus:bg-[#1A1A1A] text-neutral-800 dark:text-[#FAF6EE]"
              />
              <button
                type="submit"
                className="bg-[#FFD166] hover:bg-[#ffe082] text-neutral-800 font-mono text-xs font-bold px-4 py-1.5 rounded-xl border-2 border-neutral-800 flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Visual suitcase display */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#FFFDF9] dark:bg-[#1A1A1A] sketch-border-sm notebook-shadow min-h-[300px]">
          <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-[#FAF6EE] mb-2">My Virtual Suitcase</h4>
          <PackingSuitcase completionRate={completionRate} />

          {/* Progress message cards */}
          <div className="mt-4 text-center">
            {completionRate === 0 && (
              <p className="font-handwritten text-lg text-neutral-500 italic">"Time to load the baggage! Start packing..."</p>
            )}
            {completionRate > 0 && completionRate < 0.5 && (
              <p className="font-handwritten text-lg text-[#FF6B6B] font-bold">"Off to a good start! Passport packed?"</p>
            )}
            {completionRate >= 0.5 && completionRate < 1 && (
              <p className="font-handwritten text-lg text-[#4FACFE] font-bold">"Almost ready! Don't forget your adapters!"</p>
            )}
            {completionRate === 1 && (
              <p className="font-handwritten text-lg text-[#A8E6CF] font-bold">"🎒 FULLY PACKED! Let's fly!"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
