/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Plane,
  MapPin,
  Calendar,
  Layers,
  Heart,
  Share2,
  Printer,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sun,
  Moon,
  Info,
  Smartphone,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Settings,
  MessageSquare,
  Luggage,
  Menu,
  X as CloseIcon
} from "lucide-react";

// Modular Component Imports
import {
  HandDrawnBorder,
  DoodleCloud,
  DoodleCompass,
  FlyingPaperAirplane,
  HandDrawnArrow,
  WashiTape,
  DoodleCamera,
  DoodlePalmTree,
  PassportStamp
} from "./components/DoodleIcons";
import { InteractiveMap } from "./components/InteractiveMap";
import { SmartAssistant } from "./components/SmartAssistant";
import { ConfettiAirplanes } from "./components/ConfettiAirplanes";
import { ScratchCard } from "./components/ScratchCard";
import { SuitcasePacker } from "./components/SuitcasePacker";
import { PassportAuth, ExplorerProfile } from "./components/PassportAuth";
import { BoardingPass } from "./components/BoardingPass";
import { BudgetEstimator } from "./components/BudgetEstimator";
import { RecommendationEngine, FlightOption, HotelOption } from "./components/RecommendationEngine";

// Data Imports
import { INSPIRATION_CARDS, TESTIMONIALS } from "./data";
import { FullTripItinerary } from "./types";

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
    title: "Wanderlust Awaits! 🌅",
    tag: "COZY LAKE RETREAT",
    rotation: 2
  },
  {
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    title: "Chasing Sunsets ⛩️",
    tag: "KYOTO, JAPAN",
    rotation: -3
  },
  {
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
    title: "Coastal Escape 🌊",
    tag: "AMALFI COAST, ITALY",
    rotation: 4
  },
  {
    url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=600&q=80",
    title: "Into the Clouds 🏔️",
    tag: "SWISS ALPS",
    rotation: -1
  },
  {
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    title: "Tropical Oasis 🌴",
    tag: "BALI, INDONESIA",
    rotation: 3
  }
];

export default function App() {
  // Theme state: Warm Parchment (light) or Midnight Lantern (dark)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Selected journal background/cover color palette
  const [journalColor, setJournalColor] = useState<"cream" | "sage" | "sky" | "sand" | "slate">("cream");

  // Navigation active tab: home, explore, my-trips, travel-journey, ai-assistant, settings
  const [activeTab, setActiveTab] = useState<"home" | "explore" | "my-trips" | "travel-journey" | "ai-assistant" | "settings">("home");

  // Flight & Hotel Booking state
  const [bookedFlight, setBookedFlight] = useState<FlightOption | null>(null);
  const [bookedHotel, setBookedHotel] = useState<HotelOption | null>(null);

  // Custom budget currency preference
  const [currencySymbol, setCurrencySymbol] = useState<string>("$");

  const handleBookFlight = (flight: FlightOption) => {
    setBookedFlight(flight);
    if (generatedTrip) {
      const updatedBudget = {
        ...generatedTrip.budget,
        flights: flight.price,
        total: (generatedTrip.budget.total - generatedTrip.budget.flights) + flight.price
      };
      setGeneratedTrip({
        ...generatedTrip,
        budget: updatedBudget
      });
    }
  };

  const handleBookHotel = (hotel: HotelOption) => {
    setBookedHotel(hotel);
    if (generatedTrip) {
      const durationDays = generatedTrip.itinerary?.length || 5;
      const totalHotelCost = hotel.pricePerNight * durationDays;
      const updatedBudget = {
        ...generatedTrip.budget,
        hotels: totalHotelCost,
        total: (generatedTrip.budget.total - generatedTrip.budget.hotels) + totalHotelCost
      };
      setGeneratedTrip({
        ...generatedTrip,
        budget: updatedBudget
      });
    }
  };

  // Hero carousel image index
  const [heroImgIdx, setHeroImgIdx] = useState(0);

  // User Profile (Syncs with Authentication state)
  const [currentUser, setCurrentUser] = useState<(ExplorerProfile & { email: string }) | null>(null);

  // Profile data displayed in app
  const [profile, setProfile] = useState<ExplorerProfile>({
    name: "Alex Wanderer",
    homeAirport: "LAX (Los Angeles)",
    title: "Amateur Backpacker",
    avatarEmoji: "🎒"
  });

  // Load cached profile or explorer session on startup
  useEffect(() => {
    const cachedExplorer = localStorage.getItem("current_explorer");
    if (cachedExplorer) {
      try {
        const parsed = JSON.parse(cachedExplorer);
        setCurrentUser(parsed);
        setProfile({
          name: parsed.name,
          homeAirport: parsed.homeAirport,
          title: parsed.title,
          avatarEmoji: parsed.avatarEmoji
        });
      } catch (e) {}
    } else {
      const cachedProfile = localStorage.getItem("explorer_profile");
      if (cachedProfile) {
        try {
          setProfile(JSON.parse(cachedProfile));
        } catch (e) {}
      }
    }
  }, []);

  const handleUserChange = (user: (ExplorerProfile & { email: string }) | null) => {
    setCurrentUser(user);
    if (user) {
      setProfile({
        name: user.name,
        homeAirport: user.homeAirport,
        title: user.title,
        avatarEmoji: user.avatarEmoji
      });
    } else {
      setProfile({
        name: "Alex Wanderer",
        homeAirport: "LAX (Los Angeles)",
        title: "Amateur Backpacker",
        avatarEmoji: "🎒"
      });
    }
  };

  // Form State
  const [destination, setDestination] = useState("Kyoto, Japan");
  const [budget, setBudget] = useState("$$");
  const [duration, setDuration] = useState(5);
  const [travelers, setTravelers] = useState("1 Traveler");
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Culture", "Photography", "History"]);
  const [preferredTransport, setPreferredTransport] = useState("Train");

  // Output State
  const [generatedTrip, setGeneratedTrip] = useState<FullTripItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);

  // Inspiration section filter state
  const [inspirationFilter, setInspirationFilter] = useState<string>("All");

  // Pigeon Mail status
  const [pigeonStatus, setPigeonStatus] = useState<string>("");

  // Navigation / Scroll
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const loadingSteps = [
    "🗺️ Drafting customized cartographies...",
    "🎒 Folding virtual t-shirts into the suitcase...",
    "🍱 Fetching local delicacy menus...",
    "🛂 Stamping passport of approval...",
    "✨ Crafting the final Polaroid postcard..."
  ];

  // Rotate loading messages during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1800);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedTrip(null);

    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          budget,
          duration,
          travelers,
          travelStyle,
          interests: selectedInterests,
          transport: preferredTransport
        })
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedTrip(data);
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 5000);
        setTimeout(() => scrollToSection("trip-results"), 200);
      } else {
        alert(`Failed to plan trip: ${data.error || "Please verify API setup."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Uh oh! The flight ran into turbulence. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-load a trip from saved album
  const handleLoadSavedTrip = (saved: FullTripItinerary) => {
    setGeneratedTrip(saved);
    setDestination(saved.destination);
    setDuration(saved.itinerary.length);
    setBudget(saved.budgetLevel);
    setActiveTab("travel-journey");
    setTimeout(() => scrollToSection("trip-results"), 200);
  };

  const travelStylesList = ["Adventure", "Luxury", "Family", "Romantic", "Solo", "Nature", "Backpacking", "Food"];
  const interestsList = ["Beach", "Mountains", "Wildlife", "History", "Shopping", "Photography", "Nightlife", "Culture"];
  const transportList = ["Flight", "Train", "Road Trip", "Cruise"];
  const budgetOptions = [
    { value: "$", label: "Economy ($)" },
    { value: "$$", label: "Mid-Range ($$)" },
    { value: "$$$", label: "Premium ($$$)" },
    { value: "$$$$", label: "High-End ($$$$)" }
  ];

  // Filtered inspiration list
  const filteredInspirations =
    inspirationFilter === "All"
      ? INSPIRATION_CARDS
      : INSPIRATION_CARDS.filter((c) => c.category === inspirationFilter);

  // Dynamic background class helpers for dynamic customizable cover colors
  const getBgClass = () => {
    if (isDarkMode) {
      switch (journalColor) {
        case "sage":
          return "bg-[#1C221D] text-[#FAF6EE]";
        case "sky":
          return "bg-[#192128] text-[#FAF6EE]";
        case "sand":
          return "bg-[#211C1A] text-[#FAF6EE]";
        case "slate":
          return "bg-[#1E1E1C] text-[#FAF6EE]";
        case "cream":
        default:
          return "bg-[#1C1C1A] text-[#FAF6EE]";
      }
    } else {
      switch (journalColor) {
        case "sage":
          return "bg-[#E5ECE5] text-neutral-800";
        case "sky":
          return "bg-[#E6EEF4] text-neutral-800";
        case "sand":
          return "bg-[#F4EDE6] text-neutral-800";
        case "slate":
          return "bg-[#E5E5E1] text-neutral-800";
        case "cream":
        default:
          return "bg-[#FAF6EE] text-neutral-800"; // Warm parchment as beautiful cozy default!
      }
    }
  };

  const getHeaderBgClass = () => {
    if (isDarkMode) {
      switch (journalColor) {
        case "sage":
          return "bg-[#1C221D]/85 text-[#FAF6EE]";
        case "sky":
          return "bg-[#192128]/85 text-[#FAF6EE]";
        case "sand":
          return "bg-[#211C1A]/85 text-[#FAF6EE]";
        case "slate":
          return "bg-[#1E1E1C]/85 text-[#FAF6EE]";
        case "cream":
        default:
          return "bg-[#1C1C1A]/85 text-[#FAF6EE]";
      }
    } else {
      switch (journalColor) {
        case "sage":
          return "bg-[#E5ECE5]/85 text-neutral-800";
        case "sky":
          return "bg-[#E6EEF4]/85 text-neutral-800";
        case "sand":
          return "bg-[#F4EDE6]/85 text-neutral-800";
        case "slate":
          return "bg-[#E5E5E1]/85 text-neutral-800";
        case "cream":
        default:
          return "bg-[#FAF6EE]/85 text-neutral-800";
      }
    }
  };

  const getFooterDividerBgClass = () => {
    if (isDarkMode) {
      switch (journalColor) {
        case "sage":
          return "bg-[#1C221D]";
        case "sky":
          return "bg-[#192128]";
        case "sand":
          return "bg-[#211C1A]";
        case "slate":
          return "bg-[#1E1E1C]";
        case "cream":
        default:
          return "bg-[#1C1C1A]";
      }
    } else {
      switch (journalColor) {
        case "sage":
          return "bg-[#E5ECE5]";
        case "sky":
          return "bg-[#E6EEF4]";
        case "sand":
          return "bg-[#F4EDE6]";
        case "slate":
          return "bg-[#E5E5E1]";
        case "cream":
        default:
          return "bg-[#FAF6EE]";
      }
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 font-sans dot-grid ${
        isDarkMode ? "dark" : ""
      } ${getBgClass()}`}
    >
      {/* Confetti Aircraft System */}
      <ConfettiAirplanes active={confettiActive} />

      {/* Floating Smart chatbot guide */}
      <SmartAssistant />

      {/* Top Banner Navigation Bar */}
      <header className="sticky top-0 z-40 bg-opacity-95 backdrop-blur-md border-b-2 border-neutral-800 dark:border-neutral-700 transition-colors duration-300">
        <div
          className={`max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 ${getHeaderBgClass()}`}
        >
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab("home"); scrollToSection("home-hero"); }}>
              <div className="w-10 h-10 rounded-full bg-[#FF6B6B] border-2 border-neutral-800 flex items-center justify-center text-xl shadow transform -rotate-6">
                ✈️
              </div>
              <div>
                <span className="font-handwritten text-3xl font-extrabold tracking-tight block text-neutral-900 dark:text-white">
                  Travel Planner Pro AI
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#4FACFE] dark:text-[#83c3ff]">
                  *Doodle Journal Edition*
                </span>
              </div>
            </div>

            {/* Quick theme selector and mobile menu indicators */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="theme-toggle-btn-mobile"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-full border-2 border-neutral-800 dark:border-neutral-700 bg-white dark:bg-[#2D2D2A] hover:bg-neutral-50 shadow-sm text-neutral-800 dark:text-white transition-transform cursor-pointer"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-yellow-500" /> : <Moon className="w-3.5 h-3.5 text-neutral-800" />}
              </button>
            </div>
          </div>

          {/* Navigation Bar links - matches exactly: -home -explore -my trips -travel journey -ai assistant -settings -user profile avatar */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto py-1 md:py-0 scrollbar-none justify-start md:justify-center font-handwritten text-lg font-bold">
            {[
              { id: "home", label: "🏠 Home" },
              { id: "explore", label: "🗺️ Explore" },
              { id: "my-trips", label: "🧳 My Trips" },
              { id: "travel-journey", label: "📋 Travel Journey" },
              { id: "ai-assistant", label: "🤠 AI Assistant" },
              { id: "settings", label: "⚙️ Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border-2 transition-all cursor-pointer text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#FF6B6B] text-white border-neutral-800 shadow-sm transform -rotate-1"
                    : "border-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-800/10"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* User Profile Avatar Link */}
            <button
              onClick={() => setActiveTab("my-trips")}
              className={`flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1 rounded-full border-2 text-xs font-mono transition-all cursor-pointer ${
                activeTab === "my-trips"
                  ? "bg-[#A8E6CF] text-neutral-800 border-neutral-800"
                  : "bg-white dark:bg-[#2D2D2A] border-neutral-800/50 dark:border-neutral-700/50 text-neutral-600 dark:text-neutral-400"
              }`}
              title="My Explorer Passport Profile"
            >
              <span className="text-sm">{profile.avatarEmoji}</span>
              <span className="max-w-[80px] truncate font-bold">{profile.name.split(" ")[0]}</span>
            </button>
          </nav>

          {/* Controls & Cover Color Selectors */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Journal Cover Color Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#2D2D2A] px-2 py-1 rounded-full border-2 border-neutral-800 dark:border-neutral-700 shadow-sm">
              {[
                { name: "cream", color: "#FAF6EE", title: "Warm Parchment" },
                { name: "sage", color: "#E5ECE5", title: "Sage Garden" },
                { name: "sky", color: "#E6EEF4", title: "Sky Mail" },
                { name: "sand", color: "#F4EDE6", title: "Terracotta Sand" },
                { name: "slate", color: "#E5E5E1", title: "Slate Classic" },
              ].map((item) => (
                <button
                  key={item.name}
                  id={`bg-btn-${item.name}`}
                  onClick={() => setJournalColor(item.name as any)}
                  className={`w-4 h-4 rounded-full border border-neutral-700 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
                    journalColor === item.name ? "ring-2 ring-[#FF6B6B] scale-105" : ""
                  }`}
                  style={{ backgroundColor: item.color }}
                  title={item.title}
                />
              ))}
            </div>

            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-full border-2 border-neutral-800 dark:border-neutral-700 bg-white dark:bg-[#2D2D2A] hover:bg-neutral-50 dark:hover:bg-[#3D3D3A] shadow-sm text-neutral-800 dark:text-white transition-transform cursor-pointer"
              title="Toggle Day/Starry Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-neutral-800" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Layout Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-20 relative">
        {/* Absolute Background Floating Clouds */}
        <div className="absolute top-10 left-10 pointer-events-none opacity-40">
          <DoodleCloud delay={0.5} />
        </div>
        <div className="absolute top-48 right-16 pointer-events-none opacity-30">
          <DoodleCloud delay={1.8} />
        </div>
        <div className="absolute top-[800px] left-8 pointer-events-none opacity-20">
          <DoodleCloud delay={2.5} />
        </div>

        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <>
            {/* SECTION 1: HOME HERO */}
            <section id="home-hero" className="relative pt-6 pb-12">
          {/* Flying airplane continuous */}
          <FlyingPaperAirplane className="top-12 left-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block bg-[#FFD166]/80 text-neutral-800 font-handwritten text-xl font-bold px-4 py-1.5 rounded-lg border-2 border-neutral-800 transform rotate-[-2deg] shadow-sm">
                🎒 AI Travel Journal Pro
              </div>

              <h1 className="font-handwritten text-6xl sm:text-7xl font-black leading-[1.05] tracking-tight text-neutral-900 dark:text-white">
                Plan Your Dream Trip <br />
                <span className="text-[#4FACFE]">with AI ✈️</span>
              </h1>

              <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 font-sans max-w-xl leading-relaxed">
                "Your intelligent travel companion that creates personalized itineraries, estimates budgets, suggests destinations, and even packs your suitcase."
              </p>

              {/* Action Boarding Style Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => scrollToSection("ai-generator")}
                  className="bg-[#FF6B6B] hover:bg-[#ff5555] text-white font-handwritten text-2xl font-bold px-8 py-3 rounded-full border-3 border-neutral-800 shadow-md transform hover:-translate-y-1 active:translate-y-0 transition-transform flex items-center gap-2"
                >
                  Start Planning
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scrollToSection("inspiration")}
                  className="bg-[#A8E6CF] hover:bg-[#83d0b3] text-neutral-800 font-handwritten text-2xl font-bold px-8 py-3 rounded-full border-3 border-neutral-800 shadow-md transform hover:-translate-y-1 active:translate-y-0 transition-transform"
                >
                  Explore Destinations
                </button>
              </div>

              {/* Tiny hand-drawn reminder sticker */}
              <div className="pt-4 flex items-center gap-2.5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <span className="bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30 dark:border-yellow-500/50">
                  STARRY LANTERN THEME
                </span>
                <span>*Toggle night-sky mood in top right!*</span>
              </div>
            </div>

            {/* Right Hero Decorative Doodle Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[320px] sm:w-[380px] bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-6 notebook-shadow rotate-2">
                {/* Washi tape strip */}
                <WashiTape className="-top-3 left-1/4" angle={-5} color="rgba(168, 230, 207, 0.7)" />

                {/* Polaroid photo inside layout with transition */}
                <div 
                  onClick={() => setHeroImgIdx((prev) => (prev + 1) % HERO_IMAGES.length)}
                  className="bg-white dark:bg-[#1A1A1A] border-2 border-neutral-800 dark:border-neutral-700 p-3 rounded-xl shadow cursor-pointer group select-none relative min-h-[300px] flex flex-col justify-between"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={heroImgIdx}
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <img
                        referrerPolicy="no-referrer"
                        src={HERO_IMAGES[heroImgIdx].url}
                        alt={HERO_IMAGES[heroImgIdx].title}
                        className="w-full h-44 object-cover rounded-lg border border-neutral-200 dark:border-neutral-800 group-hover:brightness-95 transition-all"
                      />
                      <div className="mt-3 text-center">
                        <p className="font-handwritten text-2xl text-neutral-700 dark:text-neutral-300">
                          {HERO_IMAGES[heroImgIdx].title}
                        </p>
                        <span className="font-mono text-[9px] text-[#4FACFE] uppercase tracking-wider font-bold block mt-0.5">
                          📍 {HERO_IMAGES[heroImgIdx].tag}
                        </span>
                        <span className="font-mono text-[8px] text-neutral-400 dark:text-neutral-500 block mt-1">
                          TAP PHOTO TO CYCLE • {heroImgIdx + 1} / {HERO_IMAGES.length}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Arrow Controls */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setHeroImgIdx((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
                    className="bg-white dark:bg-[#1A1A1A] border-2 border-neutral-800 text-neutral-800 dark:text-white rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm transition-transform active:scale-95 cursor-pointer"
                    title="Previous Snap"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1">
                    {HERO_IMAGES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeroImgIdx(i)}
                        className={`w-2 h-2 rounded-full border border-neutral-800 transition-all ${
                          heroImgIdx === i ? "bg-[#FF6B6B] scale-125" : "bg-neutral-300 dark:bg-neutral-700"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setHeroImgIdx((prev) => (prev + 1) % HERO_IMAGES.length)}
                    className="bg-white dark:bg-[#1A1A1A] border-2 border-neutral-800 text-neutral-800 dark:text-white rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm transition-transform active:scale-95 cursor-pointer"
                    title="Next Snap"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Icons scattered */}
                <div className="absolute -top-6 -right-6 animate-spin-slow">
                  <DoodleCompass />
                </div>
                <div className="absolute -bottom-6 -left-6 transform rotate-12 pointer-events-none">
                  <DoodleCamera />
                </div>
                <div className="absolute -bottom-8 -right-6 transform -rotate-12 pointer-events-none">
                  <DoodlePalmTree />
                </div>
              </div>
            </div>
          </div>

          {/* Polaroid Snapshots Gallery Row on the First Page */}
          <div className="mt-12 bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-6 notebook-shadow relative overflow-hidden">
            <WashiTape className="-top-3 left-1/3" angle={-2} color="rgba(168, 230, 207, 0.6)" />
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-3 mb-5">
              <div>
                <h3 className="font-handwritten text-3xl text-neutral-800 dark:text-white flex items-center gap-2">
                  📸 Quick Polaroid Album Preview
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 font-mono text-xs mt-1">
                  *A sneak peek at curated world coordinates. Click any snapshot to set the destination in the designer below!*
                </p>
              </div>
              <div className="text-neutral-400 font-mono text-[9px] mt-2 md:mt-0 uppercase tracking-widest">
                Interactive Album Preview
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {HERO_IMAGES.map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04, y: -4 }}
                  onClick={() => {
                    setDestination(img.tag);
                    scrollToSection("ai-generator");
                  }}
                  className="bg-white dark:bg-[#1A1A1A] p-2 rounded-lg border-2 border-neutral-800 dark:border-neutral-700 shadow-sm cursor-pointer transition-transform"
                  style={{ transform: `rotate(${img.rotation * 0.5}deg)` }}
                >
                  <div className="relative aspect-square rounded overflow-hidden border border-neutral-100 dark:border-neutral-800 bg-neutral-100">
                    <img
                      referrerPolicy="no-referrer"
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="font-handwritten text-base text-neutral-800 dark:text-neutral-200 font-bold truncate leading-tight">
                      {img.title}
                    </p>
                    <span className="font-mono text-[8px] text-[#4FACFE] uppercase tracking-wider block mt-0.5">
                      📍 {img.tag}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </>
    )}

        {/* TAB 3: MY TRIPS */}
        {activeTab === "my-trips" && (
          <>
            {/* SECTION 2: EXPLORER PASSPORT PROFILE */}
            <section id="passport-profile">
              <PassportAuth
                currentTrip={generatedTrip}
                onLoadTrip={handleLoadSavedTrip}
                currentUser={currentUser}
                onUserChange={handleUserChange}
              />
            </section>

            {/* Direct Booking Coupon Binder Folder */}
            <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] border-3 border-neutral-800 rounded-3xl p-6 shadow-md relative overflow-hidden"
              style={{
                backgroundImage: "radial-gradient(#E2E8F0 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px"
              }}
            >
              <WashiTape className="-top-2 left-1/3" angle={-1} color="rgba(255, 107, 107, 0.6)" />
              
              <div className="border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-handwritten text-3xl text-neutral-800 dark:text-white flex items-center gap-2">
                    🎟️ Transit & Lodging Coupon Folder
                  </h3>
                  <p className="font-mono text-xs text-neutral-400">
                    *Live virtual confirmation slips for your booked flights and custom Ryokan stays.*
                  </p>
                </div>
                <Luggage className="w-8 h-8 text-[#FF6B6B]" />
              </div>

              {(!bookedFlight && !bookedHotel) ? (
                <div className="text-center py-12 bg-white/75 dark:bg-[#1A1A1A]/75 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                  <span className="text-4xl block mb-2">📭</span>
                  <p className="font-handwritten text-xl text-neutral-500 italic">
                    No active transit coupon slips or hotel vouchers in folder yet!
                  </p>
                  <button 
                    onClick={() => setActiveTab("explore")}
                    className="mt-4 font-mono text-xs bg-[#FFD166] text-neutral-800 border-2 border-neutral-800 rounded-xl px-4 py-2 hover:bg-yellow-400 font-bold cursor-pointer"
                  >
                    ✈️ Browse Flight & Hotel Offers
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Booked Flight Ticket */}
                  {bookedFlight && (
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl border-3 border-neutral-800 p-5 shadow-sm relative overflow-hidden">
                      {/* Circle punches */}
                      <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#FAF6EE] dark:bg-[#2D2D2A] border-r-2 border-neutral-800 transform -translate-y-1/2" />
                      <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#FAF6EE] dark:bg-[#2D2D2A] border-l-2 border-neutral-800 transform -translate-y-1/2" />
                      
                      <div className="flex justify-between items-center pb-3 border-b border-white/20">
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-widest text-blue-100">TRANSIT PASSENGER TICKET</p>
                          <h4 className="font-handwritten text-2xl font-bold leading-none">{bookedFlight.airline}</h4>
                        </div>
                        <span className="bg-white/25 px-2 py-0.5 rounded font-mono text-[10px] font-bold">CONFIRMED</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-4 text-center items-center">
                        <div>
                          <p className="font-mono text-[10px] text-blue-100 uppercase">FROM</p>
                          <h5 className="font-sans text-xl font-bold">{profile.homeAirport.split(" ")[0]}</h5>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-lg">✈️</span>
                          <div className="w-full border-t border-dashed border-white/40 my-1" />
                          <span className="font-mono text-[8px] text-blue-100">{bookedFlight.duration}</span>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-blue-100 uppercase">DEST</p>
                          <h5 className="font-sans text-xl font-bold">{destination || "Tokyo"}</h5>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20 text-xs font-mono">
                        <div>
                          <p className="text-blue-100 text-[9px]">EXPLORER GUEST</p>
                          <p className="font-bold truncate">{profile.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-100 text-[9px]">BOARDING CLASS</p>
                          <p className="font-bold text-[#FFD166]">{bookedFlight.type}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center bg-black/20 p-2.5 rounded-xl text-xs font-mono">
                        <span>TOTAL COST: {currencySymbol}{bookedFlight.price}</span>
                        <span className="font-bold text-[#A8E6CF]">SEAT 12A</span>
                      </div>
                    </div>
                  )}

                  {/* Booked Hotel Voucher */}
                  {bookedHotel && (
                    <div className="bg-gradient-to-r from-[#FF9F1C] to-[#E71D36] text-white rounded-2xl border-3 border-neutral-800 p-5 shadow-sm relative overflow-hidden">
                      <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#FAF6EE] dark:bg-[#2D2D2A] border-r-2 border-neutral-800 transform -translate-y-1/2" />
                      <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#FAF6EE] dark:bg-[#2D2D2A] border-l-2 border-neutral-800 transform -translate-y-1/2" />

                      <div className="flex justify-between items-center pb-3 border-b border-white/20">
                        <div>
                          <p className="font-mono text-[8px] uppercase tracking-widest text-[#FFE0B2]">LODGING ACCOMMODATION SLIP</p>
                          <h4 className="font-handwritten text-2xl font-bold leading-none">{bookedHotel.name}</h4>
                        </div>
                        <span className="bg-white/25 px-2 py-0.5 rounded font-mono text-[10px] font-bold">RESERVED</span>
                      </div>

                      <div className="py-4 space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#FFE0B2]">RATING:</span>
                          <span className="font-bold">⭐ {bookedHotel.rating} / 5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#FFE0B2]">RATE PER NIGHT:</span>
                          <span className="font-bold">{currencySymbol}{bookedHotel.pricePerNight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#FFE0B2]">AMENITIES:</span>
                          <span className="font-bold truncate max-w-[200px]">{bookedHotel.amenities.join(", ")}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20 text-xs font-mono">
                        <div>
                          <p className="text-[#FFE0B2] text-[9px]">VISITOR REGISTERED</p>
                          <p className="font-bold truncate">{profile.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#FFE0B2] text-[9px]">CONFIRMATION CODE</p>
                          <p className="font-bold text-[#FFE29A]">RY-948L2X</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center bg-black/20 p-2.5 rounded-xl text-xs font-mono">
                        <span>TOTAL nights: {generatedTrip?.itinerary?.length || 5} Nights</span>
                        <span className="font-bold text-[#A8E6CF]">Voucher Active</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 4: TRAVEL JOURNEY */}
        {activeTab === "travel-journey" && (
          <>
            {/* SECTION 3: AI GENERATOR */}
            <section id="ai-generator" className="relative">
          <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-8 notebook-shadow relative overflow-hidden">
            {/* Tape decorations */}
            <WashiTape className="-top-1.5 left-20" angle={-3} color="rgba(255, 107, 107, 0.6)" />
            <WashiTape className="-top-1.5 right-20" angle={5} color="rgba(255, 209, 102, 0.6)" />

            <div className="border-b-2 border-dashed border-neutral-700 dark:border-neutral-600 pb-5 mb-6 text-center max-w-xl mx-auto">
              <h2 className="font-handwritten text-5xl text-neutral-800 dark:text-white leading-tight">
                🎒 AI Custom Trip Designer
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mt-1.5 leading-relaxed">
                *Describe your dream holiday and watch our intelligence system draw maps, pack suitcase coordinates, and print tickets!*
              </p>
            </div>

            <form onSubmit={handleGenerateItinerary} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Where to? */}
                <div className="md:col-span-2">
                  <label className="font-handwritten text-2xl text-neutral-700 dark:text-neutral-300 block mb-1">
                    🗺️ Where do you want to explore?
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Kyoto, Japan / Swiss Alps / Goa, India"
                    className="w-full bg-white dark:bg-[#1A1A1A] text-neutral-800 dark:text-[#FAF6EE] border-3 border-neutral-800 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]"
                  />
                  {/* Quick suggestion pills */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {["Tokyo, Japan", "Rome, Italy", "Banff, Canada", "Costa Rica", "Goa, India"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setDestination(s)}
                        className="bg-white/80 dark:bg-[#1A1A1A]/80 hover:bg-[#A8E6CF] text-neutral-700 dark:text-[#FAF6EE] text-xs font-mono px-2 py-1 rounded-md border border-neutral-400 dark:border-neutral-600 transition-colors"
                      >
                        📍 {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Selection */}
                <div>
                  <label className="font-handwritten text-2xl text-neutral-700 dark:text-neutral-300 block mb-1">
                    💰 Trip Budget Grade
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A1A1A] text-neutral-800 dark:text-[#FAF6EE] border-3 border-neutral-800 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none"
                  >
                    {budgetOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Duration */}
                <div>
                  <label className="font-handwritten text-2xl text-neutral-700 dark:text-neutral-300 block mb-1">
                    📅 Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    required
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 3)}
                    className="w-full bg-white dark:bg-[#1A1A1A] text-neutral-800 dark:text-[#FAF6EE] border-3 border-neutral-800 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">*Max 14 days supported*</span>
                </div>

                {/* Travelers */}
                <div>
                  <label className="font-handwritten text-2xl text-neutral-700 dark:text-neutral-300 block mb-1">
                    👥 Number of Explorers
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A1A1A] text-neutral-800 dark:text-[#FAF6EE] border-3 border-neutral-800 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none"
                  >
                    {["1 Traveler", "2 Travelers", "Family (3-5)", "Group Trip (5+)"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Transit */}
                <div>
                  <label className="font-handwritten text-2xl text-neutral-700 dark:text-neutral-300 block mb-1">
                    🚂 Preferred Transport
                  </label>
                  <select
                    value={preferredTransport}
                    onChange={(e) => setPreferredTransport(e.target.value)}
                    className="w-full bg-white dark:bg-[#1A1A1A] text-neutral-800 dark:text-[#FAF6EE] border-3 border-neutral-800 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none"
                  >
                    {transportList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travel Styles checkboxes */}
              <div>
                <label className="font-handwritten text-2xl text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  🎒 Select Travel Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {travelStylesList.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setTravelStyle(style)}
                      className={`font-handwritten text-lg px-4 py-1.5 rounded-full border-2 border-neutral-800 dark:border-neutral-700 transition-all shadow-sm ${
                        travelStyle === style
                          ? "bg-[#FF6B6B] text-white rotate-1"
                          : "bg-white dark:bg-[#1A1A1A] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Interests */}
              <div>
                <label className="font-handwritten text-2xl text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  📸 Explorer Interests (Select multiple)
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`font-mono text-xs px-3.5 py-2 rounded-xl border-2 border-neutral-800 dark:border-neutral-700 transition-all ${
                          isSelected
                            ? "bg-[#FFD166] text-neutral-900 border-neutral-800 dark:border-neutral-600"
                            : "bg-white/90 dark:bg-[#1A1A1A]/90 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {isSelected ? "⭐️ " : ""}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button / Loader */}
              <div className="pt-4 flex flex-col items-center">
                <AnimatePresence mode="wait">
                  {!isLoading ? (
                    <motion.button
                      key="button"
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-[#A8E6CF] hover:bg-[#83d4b6] text-neutral-800 font-handwritten text-3xl font-extrabold px-12 py-4 rounded-full border-3 border-neutral-800 dark:border-neutral-700 shadow-lg cursor-pointer transform rotate-[-0.5deg]"
                    >
                      🗺️ Generate Itinerary & Pass!
                    </motion.button>
                  ) : (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center p-6 bg-white dark:bg-[#1A1A1A] border-3 border-neutral-800 dark:border-neutral-700 rounded-2xl max-w-sm text-center shadow-md"
                    >
                      <Compass className="w-12 h-12 text-[#FF6B6B] animate-spin mb-3" />
                      <h4 className="font-handwritten text-2xl font-bold text-neutral-800 dark:text-white">
                        *Doodle Guide is Planning!*
                      </h4>
                      <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400 mt-2 animate-pulse leading-relaxed">
                        {loadingSteps[loadingStep]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </section>

        {/* SECTION 4: TRIP RESULTS DETAILS */}
        <AnimatePresence>
          {generatedTrip && (
            <motion.section
              id="trip-results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="space-y-12"
            >
              {/* Divider Passport Stamp transition */}
              <div className="flex justify-center my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-4 border-dashed border-neutral-300" />
                </div>
                <div className="relative bg-[#FDFBF7] dark:bg-[#1A202C] px-6 transition-colors">
                  <PassportStamp text="CONFIRMED" country={generatedTrip.destination} />
                </div>
              </div>

              {/* 1. Boarding Pass Display */}
              <div className="space-y-4">
                <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-white border-b-2 border-dashed border-neutral-300 pb-1 flex items-center gap-2">
                  🎟️ My Official Boarding Ticket
                </h3>
                <BoardingPass trip={generatedTrip} profile={profile} />
              </div>

              {/* 2. Interactive Polaroid Postcard layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                {/* Left: Polaroid Postcard */}
                <div className="md:col-span-5 flex justify-center">
                  <motion.div
                    whileHover={{ rotate: 1, scale: 1.02 }}
                    className="relative w-[340px] bg-white dark:bg-[#1A1A1A] sketch-border p-4 notebook-shadow rotate-[-2deg]"
                  >
                    <WashiTape className="-top-3 left-1/3" angle={-5} color="rgba(255, 209, 102, 0.7)" />

                    {/* Image Block */}
                    <div className="relative border-2 border-neutral-800 dark:border-neutral-700 rounded-lg h-56 bg-neutral-100 dark:bg-neutral-800 overflow-hidden shadow-inner">
                      <img
                        referrerPolicy="no-referrer"
                        src={
                          INSPIRATION_CARDS.find((c) => c.title.toLowerCase() === generatedTrip.destination.toLowerCase())?.imageUrl ||
                          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={generatedTrip.destination}
                        className="w-full h-full object-cover"
                      />
                      {/* Visual Stamp */}
                      <div className="absolute bottom-2 right-2 bg-[#FF6B6B] text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-neutral-800 dark:border-neutral-700 rotate-[-12deg]">
                        ★ {generatedTrip.averageTemp}
                      </div>
                    </div>

                    <div className="mt-4 pb-2 text-center relative">
                      <span className="font-mono text-[8px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">
                        COSMIC POSTCARD FROM
                      </span>
                      <h4 className="font-handwritten text-3xl font-bold text-neutral-800 dark:text-white leading-none mt-1">
                        {generatedTrip.destination}!
                      </h4>
                      <p className="font-handwritten text-lg text-neutral-500 dark:text-neutral-300 italic mt-2 px-2">
                        "{generatedTrip.tagline}"
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Right: Greetings and summary journal leaf */}
                <div className="md:col-span-7 bg-[#FFFDF9] dark:bg-[#2D2D2A] sketch-border p-6 notebook-shadow relative overflow-hidden journal-lined-paper">
                  <WashiTape className="-top-1 right-12" angle={5} color="rgba(168, 230, 207, 0.6)" />
                  <div className="absolute left-8 top-0 bottom-0 w-[1.5px] bg-[#FF6B6B] opacity-35" />

                  <div className="pl-8 space-y-4">
                    <h4 className="font-handwritten text-3xl text-neutral-800 dark:text-white">✍️ Explorer's Dispatch:</h4>
                    <p className="font-handwritten text-xl text-neutral-700 dark:text-neutral-200 leading-relaxed">
                      "{generatedTrip.summary}"
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-neutral-300 dark:border-neutral-700 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                      <div>
                        <span className="text-neutral-400 dark:text-neutral-500 block uppercase">Best Season:</span>
                        <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{generatedTrip.bestSeason}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 dark:text-neutral-500 block uppercase">Language:</span>
                        <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{generatedTrip.language}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 dark:text-neutral-500 block uppercase">Local Currency:</span>
                        <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{generatedTrip.currency}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 dark:text-neutral-500 block uppercase">Visa Info:</span>
                        <span className="font-bold text-[#FF6B6B]">{generatedTrip.visaInfo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Budget Predictor segment */}
              <div>
                <BudgetEstimator budget={generatedTrip.budget} />
              </div>

              {/* 4. Day-Wise Timeline Itinerary */}
              <div className="space-y-6">
                <div className="border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-3">
                  <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-white flex items-center gap-2">
                    📅 Day-by-Day Expedition Trail
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mt-1">
                    *The custom chronological path connecting each day's morning, afternoon, and evening coordinates.*
                  </p>
                </div>

                {/* Itinerary Timeline */}
                <div className="relative pl-8 border-l-4 border-dashed border-neutral-800/40 dark:border-neutral-700/40 space-y-10 py-4">
                  {generatedTrip.itinerary.map((day, idx) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="relative"
                    >
                      {/* Chrono timeline badge index */}
                      <div className="absolute -left-[50px] top-1.5 w-10 h-10 rounded-full border-2 border-neutral-800 dark:border-neutral-700 bg-[#FFD166] flex items-center justify-center font-handwritten text-xl font-bold shadow-sm text-neutral-900">
                        {day.day}
                      </div>

                      {/* Day card */}
                      <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-5 notebook-shadow relative overflow-hidden">
                        <WashiTape className="-top-1.5 left-12" angle={-3} color="rgba(255, 107, 107, 0.5)" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-3">
                          <h4 className="font-handwritten text-3xl text-neutral-800 dark:text-white">{day.title}</h4>
                          <span className="font-mono text-xs bg-white dark:bg-[#1A1A1A] border border-neutral-800 dark:border-neutral-700 px-2.5 py-0.5 rounded-full text-neutral-700 dark:text-neutral-300 font-bold shadow-sm self-start mt-1 sm:mt-0">
                            💸 Est Cost: ${day.cost}
                          </span>
                        </div>

                        {/* Activities schedule block */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-handwritten text-xl text-neutral-700 dark:text-neutral-200">
                          {/* Morning */}
                          <div className="bg-white/80 dark:bg-[#1C1C1A]/85 p-3 rounded-xl border-2 border-neutral-800/20 dark:border-neutral-700/40 text-neutral-800 dark:text-neutral-200">
                            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                              ☀️ Morning
                            </span>
                            {day.morning}
                          </div>

                          {/* Afternoon */}
                          <div className="bg-white/80 dark:bg-[#1C1C1A]/85 p-3 rounded-xl border-2 border-neutral-800/20 dark:border-neutral-700/40 text-neutral-800 dark:text-neutral-200">
                            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                              ⛅ Afternoon
                            </span>
                            {day.afternoon}
                          </div>

                          {/* Evening */}
                          <div className="bg-white/80 dark:bg-[#1C1C1A]/85 p-3 rounded-xl border-2 border-neutral-800/20 dark:border-neutral-700/40 text-neutral-800 dark:text-neutral-200">
                            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                              🌙 Evening
                            </span>
                            {day.evening}
                          </div>
                        </div>

                        {/* Note block */}
                        {day.notes && (
                          <div className="mt-4 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-700 font-mono text-xs text-neutral-500 dark:text-neutral-400 italic flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-[#4FACFE]" />
                            <span>*Tip: {day.notes}*</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 5. Custom Checklist & Packer */}
              <div id="suitcases" className="space-y-4">
                <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-white border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-1 flex items-center gap-2">
                  🧳 Personalized Suitcase Packer Checklist
                </h3>
                <SuitcasePacker customChecklist={generatedTrip.packingChecklist} />
              </div>

              {/* 6. Safety Tips and Emergency details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Safety Tips card */}
                <div className="bg-[#FFFDF6] border-3 border-neutral-800 rounded-2xl p-5 shadow-sm relative overflow-hidden"
                  style={{
                    backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }}
                >
                  <WashiTape className="-top-1.5 left-10" angle={-4} color="rgba(255, 209, 102, 0.7)" />
                  <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-3">
                    🛡️ Local Safety Advisory
                  </h4>
                  <ul className="space-y-2 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                    {generatedTrip.safetyTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-500 font-bold mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Emergency Contacts card */}
                <div className="bg-[#FFFDF6] dark:bg-[#2D2D2A] sketch-border p-5 notebook-shadow relative overflow-hidden"
                  style={{
                    backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }}
                >
                  <WashiTape className="-top-1.5 right-10" angle={3} color="rgba(168, 230, 207, 0.7)" />
                  <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-3">
                    🚨 Emergency Contact Numbers
                  </h4>
                  <div className="space-y-3 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                    {generatedTrip.emergencyContacts.map((contact, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-700 pb-1.5">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{contact.name}:</span>
                        <span className="bg-red-400/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-bold border border-red-500/25 dark:border-red-500/50">
                          {contact.contact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </>
    )}

        {/* TAB 2: EXPLORE */}
        {activeTab === "explore" && (
          <>
            <RecommendationEngine
              currentTrip={generatedTrip}
              homeAirport={profile.homeAirport}
              onBookFlight={handleBookFlight}
              onBookHotel={handleBookHotel}
              bookedFlight={bookedFlight}
              bookedHotel={bookedHotel}
            />

            {/* SECTION 5: INTERACTIVE WORLD MAP */}
            <section id="world-map">
          <InteractiveMap />
        </section>

        {/* SECTION 6: SCRATCH-OFF CARD */}
        <section id="scratch-cards">
          <ScratchCard />
        </section>

        {/* SECTION 7: TRAVEL INSPIRATION GRID */}
        <section id="inspiration" className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-white tracking-tight">
              ✨ Discover Curated Dream Destinations
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mt-1">
              *Taped Polaroid cards from around the globe. Select a category below!*
            </p>
          </div>

          {/* Filtering Category Pills */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {["All", "Mountains", "Beaches", "Cities", "Forests", "Snow", "Road Trips", "Luxury Resorts", "Camping"].map((cat) => (
              <button
                key={cat}
                onClick={() => setInspirationFilter(cat)}
                className={`font-handwritten text-lg px-3.5 py-1.5 rounded-lg border-2 border-neutral-800 dark:border-neutral-700 transition-all ${
                  inspirationFilter === cat
                    ? "bg-[#FFD166] text-neutral-900 border-neutral-800 transform rotate-1"
                    : "bg-white dark:bg-[#1A1A1A] hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Polaroid Masonry cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredInspirations.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#1A1A1A] sketch-border p-4 notebook-shadow relative group hover:-translate-y-1.5 transition-transform"
                style={{
                  transform: `rotate(${idx % 2 === 0 ? -1.5 : 1.5}deg)`
                }}
              >
                {/* Polaroid Washi Tape */}
                <WashiTape className="-top-3.5 left-1/4" angle={idx % 2 === 0 ? -4 : 6} color="rgba(255, 209, 102, 0.7)" />

                {/* Photo container */}
                <div className="relative border-2 border-neutral-800 dark:border-neutral-700 rounded-xl overflow-hidden h-44 bg-neutral-100 dark:bg-neutral-800 shadow-inner">
                  <img
                    referrerPolicy="no-referrer"
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 bg-neutral-900 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {card.category}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-white font-bold leading-none">{card.title}</h4>
                    <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 font-bold">{card.budget}</span>
                  </div>
                  <span className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 block mt-0.5">{card.country}</span>
                  <p className="font-handwritten text-lg text-neutral-600 dark:text-neutral-300 leading-tight mt-2 italic">
                    "{card.facts}"
                  </p>
                </div>

                {/* Plan Here quick trigger action */}
                <div className="mt-4 pt-2.5 border-t border-dashed border-neutral-200 dark:border-neutral-700 text-center">
                  <button
                    onClick={() => {
                      setDestination(`${card.title}, ${card.country}`);
                      scrollToSection("ai-generator");
                    }}
                    className="font-handwritten text-lg font-bold text-neutral-800 dark:text-neutral-100 bg-[#A8E6CF]/80 dark:bg-[#2c634f]/85 hover:bg-[#A8E6CF] dark:hover:bg-[#34755d] px-3.5 py-1 rounded-full border-2 border-neutral-800 dark:border-neutral-700 shadow-sm inline-flex items-center gap-1 leading-none"
                  >
                    🚀 Plan trip here
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </>
    )}

        {/* TAB 1: HOME PART 2 */}
        {activeTab === "home" && (
          <>
            {/* SECTION 8: ILLUSTRATED FEATURES */}
            <section id="features" className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-white">
              🛠️ Pocketbook Utilities Inside
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mt-1">
              *Full full-stack features mapped natively to maximize your journey experience!*
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "AI Plan Generator", icon: "🤖", desc: "Custom formatted daily itineraries matching styles." },
              { title: "Circular Calculator", icon: "💰", desc: "Interactive circular expense percentage gauges." },
              { title: "Virtual Suitcase", icon: "🧳", desc: "Interactive checklists that stamp your baggage." },
              { title: "Passport Album", icon: "📅", desc: "Save and reload trips from your local record book." },
              { title: "Scratch Foil Cards", icon: "🌍", desc: "Mystery location badges you rub off to reveal." },
              { title: "Dotted Map Tracks", icon: "📍", desc: "Regional detail profile cards on world nodes." },
              { title: "Safety Hotline List", icon: "🛡", desc: "Instant emergency hotlines for each nation." },
              { title: "Midnight Lantern", icon: "☁", desc: "High-contrast starry explorer modes." }
            ].map((f, i) => (
              <div
                key={f.title}
                className="bg-white dark:bg-[#1A1A1A] sketch-border p-4 notebook-shadow text-center flex flex-col items-center justify-between min-h-[160px]"
                style={{
                  transform: `rotate(${i % 2 === 0 ? 1 : -1}deg)`
                }}
              >
                <div className="w-12 h-12 rounded-full bg-[#EBF8FF] dark:bg-[#1C2C35] border-2 border-neutral-800 dark:border-neutral-700 flex items-center justify-center text-2xl shadow-sm mb-2">
                  {f.icon}
                </div>
                <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-white font-bold leading-none">{f.title}</h4>
                <p className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 mt-1.5 leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: TESTIMONIALS */}
        <section id="testimonials" className="bg-[#D2B48C]/40 dark:bg-[#3D2F22]/40 sketch-border p-6 notebook-shadow relative overflow-hidden min-h-[300px]">
          {/* Corkboard texture simulation and tape */}
          <div className="border-b-2 border-dashed border-neutral-700 dark:border-neutral-600 pb-3 mb-6 text-center">
            <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-white">📌 Traveler Board Pinboard</h3>
            <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm mt-1">
              *Sticky notes pinned by our active globetrotters and backpack adventurers!*
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.author}
                className="border-2 border-neutral-800 dark:border-neutral-700 p-5 rounded-lg shadow-md relative overflow-hidden flex flex-col justify-between"
                style={{
                  backgroundColor: t.color,
                  transform: `rotate(${i % 2 === 0 ? -2 : 3}deg)`
                }}
              >
                {/* Red pushpin dot */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-red-600 border border-neutral-800 shadow-sm" />

                <div className="pt-2 font-handwritten text-xl text-neutral-800 leading-snug">
                  "{t.text}"
                </div>

                <div className="mt-4 flex items-center gap-3 border-t border-neutral-800/10 pt-3">
                  <img
                    referrerPolicy="no-referrer"
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full border border-neutral-800 object-cover"
                  />
                  <div>
                    <h5 className="font-handwritten text-lg font-bold leading-none text-neutral-800">{t.author}</h5>
                    <span className="font-mono text-[9px] text-neutral-500 block mt-0.5">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    )}

      {/* TAB 5: AI ASSISTANT PANEL */}
      {activeTab === "ai-assistant" && (
        <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] border-3 border-neutral-800 rounded-3xl p-6 shadow-md relative overflow-hidden min-h-[550px] flex flex-col md:flex-row gap-6"
          style={{
            backgroundImage: "radial-gradient(#E2E8F0 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px"
          }}
        >
          <WashiTape className="-top-2 left-10" angle={-3} color="rgba(255, 209, 102, 0.6)" />
          
          {/* Companion bio column */}
          <div className="md:w-1/3 space-y-4 border-r-0 md:border-r-2 border-dashed border-neutral-300 dark:border-neutral-700 pr-0 md:pr-6">
            <div className="text-center py-4 bg-white/60 dark:bg-neutral-800/60 rounded-2xl border border-neutral-800/10">
              <span className="text-5xl block animate-bounce">🤠</span>
              <h4 className="font-handwritten text-3xl font-extrabold text-neutral-800 dark:text-white mt-2">Doodle Ranger</h4>
              <span className="font-mono text-[9px] text-[#FF6B6B] uppercase tracking-wider font-bold">*Official Expedition Guide*</span>
            </div>

            <p className="font-handwritten text-lg text-neutral-600 dark:text-neutral-300 leading-snug">
              "Howdy traveler! I'm your digital logbook companion. I can help answer specific questions about checking flight availability, packing rules for airlines, local Ryokan customs, or emergency tips!"
            </p>

            <div className="space-y-2">
              <span className="font-mono text-[9px] uppercase text-neutral-400 block tracking-widest">Recommended Topics:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "🎒 Packing checklist for Tokyo",
                  "🍣 Cheap food in Kyoto",
                  "⚡ Best train passes in Europe",
                  "🏯 Ryokan slippers rules"
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      const chatInput = document.getElementById("ai-pad-input") as HTMLInputElement;
                      if (chatInput) {
                        chatInput.value = topic;
                        chatInput.focus();
                      }
                    }}
                    className="font-mono text-[10px] bg-white/80 dark:bg-neutral-800 hover:bg-[#FFD166]/40 dark:hover:bg-[#FFD166]/20 text-neutral-700 dark:text-neutral-300 border border-neutral-800/20 rounded-xl px-2.5 py-1 text-left transition-all leading-tight w-full cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Immersive chat pane */}
          <div className="flex-1 flex flex-col justify-between min-h-[400px] bg-white dark:bg-[#1A1A1A] rounded-2xl border-2 border-neutral-800 dark:border-neutral-700 overflow-hidden shadow-inner">
            {/* Chat logs */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[360px] space-y-4 font-handwritten text-xl journal-lined-paper">
              <div className="flex gap-2 items-start">
                <span className="text-2xl">🤠</span>
                <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 max-w-[85%] text-neutral-800 dark:text-neutral-200">
                  Hello traveler! I am fully synchronized with your current profile (<span className="font-bold">{profile.name}</span>). Ask me anything about your next destinations or let's refine your itinerary coordinates together!
                </div>
              </div>
            </div>

            {/* Direct input and helper bar */}
            <div className="p-3 border-t-2 border-neutral-800 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex gap-2">
              <input
                id="ai-pad-input"
                type="text"
                placeholder="Type a secret travel question here..."
                className="flex-1 bg-white dark:bg-neutral-800 border border-neutral-800/35 dark:border-neutral-700/50 rounded-xl px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] text-neutral-800 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const input = e.currentTarget;
                    if (input.value.trim()) {
                      alert(`Expedition Guide is processing: "${input.value}". Open the floating circular chatbot at the bottom right to begin continuous Gemini streaming sessions!`);
                      input.value = "";
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const chatInput = document.getElementById("ai-pad-input") as HTMLInputElement;
                  if (chatInput && chatInput.value.trim()) {
                    alert(`Expedition Guide is processing: "${chatInput.value}". Open the floating circular chatbot at the bottom right to begin continuous Gemini streaming sessions!`);
                    chatInput.value = "";
                  }
                }}
                className="bg-[#FF6B6B] hover:bg-[#ff5555] text-white font-mono text-xs font-bold px-4 py-2 rounded-xl border border-neutral-800 shadow cursor-pointer"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS PAD */}
      {activeTab === "settings" && (
        <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] border-3 border-neutral-800 rounded-3xl p-6 shadow-md relative overflow-hidden">
          <WashiTape className="-top-2 left-10" angle={2} color="rgba(168, 230, 207, 0.6)" />
          
          <div className="border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-3 mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-handwritten text-3xl text-neutral-800 dark:text-white flex items-center gap-2">
                ⚙️ Notebook Customization & Configuration Pad
              </h3>
              <p className="font-mono text-xs text-neutral-400">
                *Fine-tune your physical logbook colors, base currency conversion factors, and clear session coordinates.*
              </p>
            </div>
            <Settings className="w-8 h-8 text-[#FFD166]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Styling Customization options */}
            <div className="space-y-4">
              <h4 className="font-handwritten text-2xl text-[#FF6B6B] border-b border-dashed border-neutral-300 pb-1">
                🎨 Parchment Paper Swatch Selection
              </h4>

              <div className="grid grid-cols-5 gap-2">
                {[
                  { name: "cream", color: "#FAF6EE", label: "Parchment" },
                  { name: "sage", color: "#E5ECE5", label: "Sage" },
                  { name: "sky", color: "#E6EEF4", label: "Sky" },
                  { name: "sand", color: "#F4EDE6", label: "Sand" },
                  { name: "slate", color: "#E5E5E1", label: "Slate" },
                ].map((swatch) => (
                  <button
                    key={swatch.name}
                    onClick={() => setJournalColor(swatch.name as any)}
                    className={`p-2 rounded-xl border-2 border-neutral-800 hover:scale-105 active:scale-95 transition-all text-center cursor-pointer ${
                      journalColor === swatch.name ? "ring-2 ring-[#FF6B6B] rotate-[-2deg]" : "bg-white dark:bg-[#1A1A1A]"
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto border border-neutral-300" style={{ backgroundColor: swatch.color }} />
                    <span className="font-mono text-[9px] block mt-1 uppercase text-neutral-500">{swatch.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-mono text-xs text-neutral-500 block">Starry Explorer Lighting Mode:</span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full bg-white dark:bg-neutral-800 border-2 border-neutral-800 text-neutral-800 dark:text-white font-handwritten text-xl p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isDarkMode ? "☀️ Switch to Day mode" : "🌌 Switch to Starry Midnight"}
                </button>
              </div>
            </div>

            {/* Currency settings & cache cleaning options */}
            <div className="space-y-4">
              <h4 className="font-handwritten text-2xl text-[#4FACFE] border-b border-dashed border-neutral-300 pb-1">
                ⚙️ Base Exchange Rates & Purge Helpers
              </h4>

              <div className="space-y-3">
                <label className="font-mono text-xs text-neutral-500 block">Expedition Currency Multiplier:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { symbol: "$", code: "USD ($)" },
                    { symbol: "€", code: "EUR (€)" },
                    { symbol: "¥", code: "JPY (¥)" },
                    { symbol: "£", code: "GBP (£)" },
                    { symbol: "₹", code: "INR (₹)" },
                  ].map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => setCurrencySymbol(curr.symbol)}
                      className={`font-mono text-xs px-4 py-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                        currencySymbol === curr.symbol
                          ? "bg-[#FFD166] text-neutral-900 border-neutral-800 font-bold transform -rotate-1"
                          : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-800/10 hover:border-neutral-800/40"
                      }`}
                    >
                      {curr.code}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <span className="font-mono text-xs text-red-500 block">*Danger Zone Purge helper:*</span>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your local saved explorer sessions, profile custom avatars, and booked ticket folders?")) {
                      localStorage.removeItem("current_explorer");
                      setBookedFlight(null);
                      setBookedHotel(null);
                      alert("Expedition logbook reset successfully! Restarting credentials.");
                      window.location.reload();
                    }
                  }}
                  className="w-full bg-[#FF6B6B]/15 hover:bg-[#FF6B6B]/25 text-[#FF6B6B] border-2 border-dashed border-[#FF6B6B] font-mono text-xs font-bold p-3 rounded-xl cursor-pointer"
                >
                  💥 Erase saved journals and bookings cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>

      {/* FOOTER */}
      <footer className="bg-neutral-800 text-[#FAF6EE] mt-16 border-t-4 border-neutral-900 relative">
        {/* Torn notebook paper header strip */}
        <div className={`absolute top-0 left-0 right-0 h-4 border-b-4 border-neutral-800 dark:border-neutral-700 flex justify-between pointer-events-none ${getFooterDividerBgClass()}`}>
          {Array.from({ length: 45 }).map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-neutral-800 -translate-y-3" />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-12 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF6B6B] border border-white flex items-center justify-center text-sm shadow">
                ✈️
              </div>
              <h4 className="font-handwritten text-2xl font-bold tracking-tight text-white">
                Travel Planner Pro AI
              </h4>
            </div>
            <p className="font-handwritten text-lg text-neutral-400">
              "Your trusty full-stack paper diary designed by artificial intelligence."
            </p>
          </div>

          {/* Quick links list */}
          <div className="space-y-3 font-handwritten text-xl">
            <h5 className="font-handwritten text-2xl font-extrabold text-[#4FACFE]">📁 Explorer Files</h5>
            <ul className="space-y-1 text-neutral-400">
              <li>
                <button onClick={() => scrollToSection("ai-generator")} className="hover:text-white cursor-pointer">
                  📋 Itinerary Planner
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("world-map")} className="hover:text-white cursor-pointer">
                  🗺️ Grid Node Map
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("suitcases")} className="hover:text-white cursor-pointer">
                  🧳 Suitcase Packer
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("inspiration")} className="hover:text-white cursor-pointer">
                  ✨ Polaroid Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter section */}
          <div className="space-y-3">
            <h5 className="font-handwritten text-2xl font-extrabold text-[#A8E6CF]">📨 Courier Post Dispatch</h5>
            <p className="font-handwritten text-lg text-neutral-400">
              Subscribe to receive secret flight codes & packing hacks directly to your pigeon coop.
            </p>
            {pigeonStatus ? (
              <div className="font-handwritten text-lg text-[#FFD166] p-2 bg-neutral-700/50 rounded-lg border border-neutral-600">
                📬 {pigeonStatus}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const emailInput = form.elements.namedItem("pigeonEmail") as HTMLInputElement;
                  if (emailInput && emailInput.value) {
                    setPigeonStatus("Pigeon dispatcher registered successfully!");
                    form.reset();
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  required
                  name="pigeonEmail"
                  placeholder="My travel mail address..."
                  className="bg-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs font-mono border border-neutral-600 focus:outline-none flex-1"
                />
                <button
                  type="submit"
                  className="bg-[#FFD166] hover:bg-yellow-400 text-neutral-900 font-mono text-xs font-bold px-3 py-1 rounded-lg border border-neutral-800 shadow cursor-pointer"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright and tiny flying plane */}
        <div className="max-w-7xl mx-auto px-4 mt-8 border-t border-neutral-700/50 pt-4 text-center font-mono text-[10px] text-neutral-500 relative flex flex-col sm:flex-row items-center justify-between">
          <span>© 2026 Travel Planner Pro AI. Craft Journal Edition. All rights registered.</span>
          <span className="mt-1 sm:mt-0 flex items-center gap-1.5 text-[#A8E6CF]">
            🗺️ Powered by Google Gemini 3.5 Flash
          </span>

          {/* Tiny airplane flying across footer */}
          <motion.div
            animate={{
              x: [-100, 1000],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-2 left-0 text-lg select-none pointer-events-none"
          >
            ✈️
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

