import { InspirationCard } from "./types";

export const INSPIRATION_CARDS: InspirationCard[] = [
  {
    title: "Kyoto",
    country: "Japan",
    category: "Cities",
    facts: "Ancient temples, bamboo forests, traditional tea houses, and cherry blossoms.",
    budget: "$$$",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Amalfi Coast",
    country: "Italy",
    category: "Beaches",
    facts: "Clifftop colorful villages, azure seas, lemon groves, and scenic coastline drives.",
    budget: "$$$$",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Swiss Alps",
    country: "Mountains",
    category: "Mountains",
    facts: "Snow-capped peaks, alpine lakes, wooden chalets, and world-class ski resorts.",
    budget: "$$$$",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Banff National Park",
    country: "Canada",
    category: "Forests",
    facts: "Turquoise glacier-fed lakes, pine-wood wilderness, towering mountains, and wildlife.",
    budget: "$$$",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Reykjavik",
    country: "Iceland",
    category: "Snow",
    facts: "Magical northern lights, volcanic geysers, thermal lagoons, and majestic glaciers.",
    budget: "$$$$",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Route 66",
    country: "USA",
    category: "Road Trips",
    facts: "Classic Americana neon signs, desert vistas, retro diners, and open-road freedom.",
    budget: "$$",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Maldives Resorts",
    country: "Maldives",
    category: "Luxury Resorts",
    facts: "Overwater private villas, bioluminescent corals, infinite turquoise lagoons.",
    budget: "$$$$$",
    imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80"
  },
  {
    title: "Yosemite Valley",
    country: "USA",
    category: "Camping",
    facts: "Giant ancient sequoias, sheer granite monoliths like El Capitan, sleeping under stars.",
    budget: "$",
    imageUrl: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=600&q=80"
  }
];

export interface MapCountry {
  id: string;
  name: string;
  label: string;
  pinX: string; // Tailwind percent classes
  pinY: string;
  popularCities: string[];
  avgCost: string;
  weather: string;
  localFood: string[];
  bestSeason: string;
  visaInfo: string;
  language: string;
  currency: string;
  funFacts: string[];
}

export const MAP_COUNTRIES: MapCountry[] = [
  {
    id: "jp",
    name: "Japan",
    label: "🇯🇵 Japan",
    pinX: "82%",
    pinY: "38%",
    popularCities: ["Tokyo", "Kyoto", "Osaka", "Hokkaido"],
    avgCost: "$150 - $250 / day",
    weather: "Temperate, cold winters, warm humid summers",
    localFood: ["Sushi", "Ramen", "Tempura", "Matcha Parfait"],
    bestSeason: "Spring (Cherry Blossoms) & Autumn (Foliage)",
    visaInfo: "Visa-free for 60+ countries (up to 90 days)",
    language: "Japanese",
    currency: "Japanese Yen (¥)",
    funFacts: [
      "There are more registered pet cats and dogs than children under 15!",
      "Vending machines are everywhere, selling hot coffee, canned soup, and even umbrellas."
    ]
  },
  {
    id: "it",
    name: "Italy",
    label: "🇮🇹 Italy",
    pinX: "49%",
    pinY: "32%",
    popularCities: ["Rome", "Florence", "Venice", "Amalfi"],
    avgCost: "$120 - $220 / day",
    weather: "Mediterranean climate, sunny and warm",
    localFood: ["Neapolitan Pizza", "Fresh Pasta", "Gelato", "Tiramisu"],
    bestSeason: "April to June (Spring) & September to October",
    visaInfo: "Schengen Visa (free entry for EU / US visitors)",
    language: "Italian",
    currency: "Euro (€)",
    funFacts: [
      "Rome has a sovereign country (Vatican City) completely inside its city boundaries!",
      "It is considered a crime to order a cappuccino after 11:00 AM."
    ]
  },
  {
    id: "br",
    name: "Brazil",
    label: "🇧🇷 Brazil",
    pinX: "32%",
    pinY: "68%",
    popularCities: ["Rio de Janeiro", "São Paulo", "Salvador", "Amazonas"],
    avgCost: "$70 - $130 / day",
    weather: "Tropical & subtropical climate, warm year-round",
    localFood: ["Feijoada", "Pão de Queijo", "Coxinha", "Caipirinha"],
    bestSeason: "December to March (Carnival and Summer warmth)",
    visaInfo: "E-visa required for some passport holders, free for many others",
    language: "Portuguese",
    currency: "Brazilian Real (R$)",
    funFacts: [
      "Brazil shares a border with almost every South American country except Ecuador and Chile!",
      "The Amazon rainforest is home to roughly 20% of all bird species in the world."
    ]
  },
  {
    id: "au",
    name: "Australia",
    label: "🇦🇺 Australia",
    pinX: "85%",
    pinY: "78%",
    popularCities: ["Sydney", "Melbourne", "Cairns (Barrier Reef)", "Gold Coast"],
    avgCost: "$160 - $270 / day",
    weather: "Warm, reverse seasons (southern hemisphere)",
    localFood: ["Meat Pies", "Vegemite Toast", "Barramundi Fish", "Tim Tams"],
    bestSeason: "September to November & March to May",
    visaInfo: "Electronic Travel Authority (ETA) needed for most travelers",
    language: "English",
    currency: "Australian Dollar ($)",
    funFacts: [
      "Australia is home to 10 times more sheep than people, and 2 times more kangaroos!",
      "The Great Barrier Reef is so massive it can be seen clearly from outer space."
    ]
  },
  {
    id: "za",
    name: "South Africa",
    label: "🇿🇦 South Africa",
    pinX: "54%",
    pinY: "73%",
    popularCities: ["Cape Town", "Johannesburg", "Kruger Park", "Durban"],
    avgCost: "$80 - $150 / day",
    weather: "Subtropical with warm sunny days",
    localFood: ["Biltong", "Bobotie", "Bunny Chow", "Koeksisters"],
    bestSeason: "May to September (Dry safari season) & Nov to March",
    visaInfo: "Visa-free for up to 90 days for most Western nations",
    language: "12 official languages (incl. English, Zulu, Xhosa)",
    currency: "South African Rand (R)",
    funFacts: [
      "It is the only country in the world that has three different capital cities!",
      "Table Mountain in Cape Town is one of the oldest mountains, dating back 260 million years."
    ]
  }
];

export const TESTIMONIALS = [
  {
    text: "This AI travel planner is magical! Generating an itinerary literally gave me custom stamps, passport confetti, and packing notes matching my real adventure. Feels like a real journal!",
    author: "Elena Rostova",
    role: "Alpine Explorer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    color: "#FFF9C4" // Yellow note
  },
  {
    text: "I loved scratch-off cards! Unlocking my personalized Kyoto tea house recommendation was so delightful. The budget calculator estimated trains versus flights perfectly.",
    author: "Kenji Sato",
    role: "Urban Nomad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    color: "#E8F5E9" // Green note
  },
  {
    text: "The suitcase visual fills up as you pack items, which is incredibly satisfying. I've recommended Travel Planner Pro AI to all my friends planning group trips!",
    author: "Clara Vance",
    role: "Family Backpacker",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    color: "#FFE0B2" // Orange note
  }
];
