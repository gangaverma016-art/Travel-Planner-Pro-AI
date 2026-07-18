import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plane, Hotel, Star, ThumbsUp, Sparkles, DollarSign, 
  Calendar, Users, ArrowRight, Clock, Check, AlertCircle,
  ExternalLink, Bookmark, ShieldCheck, Heart, Award
} from "lucide-react";
import { FullTripItinerary } from "../types";

interface RecommendationEngineProps {
  currentTrip: FullTripItinerary | null;
  homeAirport: string;
  onBookFlight: (flight: FlightOption) => void;
  onBookHotel: (hotel: HotelOption) => void;
  bookedFlight: FlightOption | null;
  bookedHotel: HotelOption | null;
}

export interface FlightOption {
  id: string;
  airline: string;
  logo: string;
  price: number;
  duration: string;
  stops: number;
  stopsText: string;
  departureTime: string;
  arrivalTime: string;
  rating: number;
  seatsRemaining: number;
  reviews: { author: string; rating: number; comment: string }[];
  aiReason: string;
}

export interface HotelOption {
  id: string;
  name: string;
  imageUrl: string;
  pricePerNight: number;
  rating: number;
  stars: number;
  roomsRemaining: number;
  amenities: string[];
  reviews: { author: string; rating: number; comment: string }[];
  aiReason: string;
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  currentTrip,
  homeAirport,
  onBookFlight,
  onBookHotel,
  bookedFlight,
  bookedHotel,
}) => {
  const destinationName = currentTrip ? currentTrip.destination : "Kyoto, Japan";
  const [activeTab, setActiveTab] = useState<"flights" | "hotels" | "ai-value">("flights");
  
  // Custom states for search parameters
  const [searchDeparture, setSearchDeparture] = useState(homeAirport || "LAX (Los Angeles)");
  const [searchDestination, setSearchDestination] = useState(destinationName);
  const [paxCount, setPaxCount] = useState(1);
  const [classType, setClassType] = useState<"Economy" | "Premium" | "Business">("Economy");

  // Keep departure/destination sync'd with trip shifts
  useEffect(() => {
    if (currentTrip) {
      setSearchDestination(currentTrip.destination);
    }
  }, [currentTrip]);

  useEffect(() => {
    if (homeAirport) {
      setSearchDeparture(homeAirport);
    }
  }, [homeAirport]);

  // Generate responsive mockup options based on current search destination
  const getFlightOptions = (): FlightOption[] => {
    const seed = searchDestination.charCodeAt(0) + searchDestination.charCodeAt(1) || 120;
    const basePrice = Math.max(280, (seed % 8) * 150 + 350);
    
    return [
      {
        id: "fl-1",
        airline: "Global Airways",
        logo: "🌐",
        price: Math.round(basePrice * 0.85),
        duration: "11h 20m",
        stops: 1,
        stopsText: "1 Stop (SFO)",
        departureTime: "08:15 AM",
        arrivalTime: "10:35 PM",
        rating: 4.2,
        seatsRemaining: 3,
        reviews: [
          { author: "Mark S.", rating: 4, comment: "Decent legroom and friendly crew. Food was average." },
          { author: "Elena R.", rating: 5, comment: "Smooth flight, SFO layover was very efficient." }
        ],
        aiReason: "Cheapest option with acceptable transit time. Best for budget backpackers."
      },
      {
        id: "fl-2",
        airline: "Star Alliance Explorer",
        logo: "⭐",
        price: Math.round(basePrice * 1.15),
        duration: "9h 45m",
        stops: 0,
        stopsText: "Non-stop",
        departureTime: "11:30 AM",
        arrivalTime: "08:15 PM",
        rating: 4.9,
        seatsRemaining: 7,
        reviews: [
          { author: "Kenji Y.", rating: 5, comment: "Amazing hot towels, outstanding catering! Worth the premium." },
          { author: "Claire B.", rating: 5, comment: "Direct flight is incredibly comfortable. Slept like a baby." }
        ],
        aiReason: "AI BEST VALUE: Non-stop direct routing, saving 3+ hours of travel fatigue for only 15% more."
      },
      {
        id: "fl-3",
        airline: "Pigeon Express Air",
        logo: "🕊️",
        price: Math.round(basePrice * 0.7),
        duration: "16h 50m",
        stops: 2,
        stopsText: "2 Stops (SEA, NRT)",
        departureTime: "05:00 AM",
        arrivalTime: "09:50 PM",
        rating: 3.5,
        seatsRemaining: 2,
        reviews: [
          { author: "Dave L.", rating: 3, comment: "Layovers were brutal. Only book if you need to squeeze pennies." }
        ],
        aiReason: "Extreme budget saver. Warning: Long layover coordinates apply."
      }
    ];
  };

  const getHotelOptions = (): HotelOption[] => {
    const seed = searchDestination.charCodeAt(2) + searchDestination.charCodeAt(3) || 150;
    const basePrice = Math.max(65, (seed % 6) * 45 + 75);

    return [
      {
        id: "ht-1",
        name: `${searchDestination.split(",")[0]} Cozy Ryokan & Spa`,
        imageUrl: "https://images.unsplash.com/photo-1503174971373-b1f69850bdf4?auto=format&fit=crop&w=600&q=80",
        pricePerNight: Math.round(basePrice * 1.2),
        rating: 4.8,
        stars: 4,
        roomsRemaining: 1,
        amenities: ["Free Hot Springs", "Authentic Dinner Included", "Free WiFi", "Traditional Tatami"],
        reviews: [
          { author: "Airi T.", rating: 5, comment: "Magical baths and pristine Zen garden. Highlight of my trip!" },
          { author: "John D.", rating: 4.5, comment: "Spectacular breakfasts, though futons took some getting used to." }
        ],
        aiReason: "AI BEST VALUE: Immersive authentic lodging with top-tier ratings. Includes full half-board meal value!"
      },
      {
        id: "ht-2",
        name: `Urban Escape Capsule & Lounge`,
        imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
        pricePerNight: Math.round(basePrice * 0.45),
        rating: 4.1,
        stars: 2,
        roomsRemaining: 5,
        amenities: ["Free Pod Locker", "Sauna Access", "Coworking Desks", "Central Location"],
        reviews: [
          { author: "Lukas P.", rating: 4, comment: "Extremely tidy pods. Quiet atmosphere. Great workspace." }
        ],
        aiReason: "Perfect micro-budget match. Superb public transit accessibility ratings."
      },
      {
        id: "ht-3",
        name: `Grand Continental Horizon`,
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
        pricePerNight: Math.round(basePrice * 2.1),
        rating: 4.9,
        stars: 5,
        roomsRemaining: 4,
        amenities: ["Infinity Pool", "Rooftop Sky Bar", "24/7 Butler", "Fitness Palace"],
        reviews: [
          { author: "Sophia F.", rating: 5, comment: "Breathtaking views from our 38th-floor room. Impeccable luxury." }
        ],
        aiReason: "Premium luxury tier. Stunning panoramic coordinates."
      }
    ];
  };

  const flights = getFlightOptions();
  const hotels = getHotelOptions();

  // AI Best Value calculation logic
  const bestFlight = flights.find(f => f.stops === 0) || flights[0];
  const bestHotel = hotels.find(h => h.rating >= 4.7) || hotels[0];

  // Booking receipt modal
  const [bookingType, setBookingType] = useState<"flight" | "hotel" | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelOption | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const triggerBookFlight = (flight: FlightOption) => {
    setSelectedFlight(flight);
    setBookingType("flight");
    setBookingSuccess(false);
  };

  const triggerBookHotel = (hotel: HotelOption) => {
    setSelectedHotel(hotel);
    setBookingType("hotel");
    setBookingSuccess(false);
  };

  const confirmFlightBooking = () => {
    if (selectedFlight) {
      onBookFlight(selectedFlight);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingType(null);
        setSelectedFlight(null);
      }, 1500);
    }
  };

  const confirmHotelBooking = () => {
    if (selectedHotel) {
      onBookHotel(selectedHotel);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingType(null);
        setSelectedHotel(null);
      }, 1500);
    }
  };

  return (
    <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-6 notebook-shadow relative overflow-hidden">
      {/* Decorative Washi Tape */}
      <div className="absolute top-0 right-1/4 transform translate-y-[-10px] rotate-[2deg] pointer-events-none">
        <div className="w-32 h-6 bg-[#FFD166]/40 dark:bg-yellow-600/20 border-x border-dashed border-neutral-400 text-center text-[10px] font-mono text-neutral-500 py-0.5 tracking-widest select-none">
          AIR / RYOKAN ENGINE
        </div>
      </div>

      {/* Main title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-4 mb-6">
        <div>
          <h3 className="font-handwritten text-4xl text-neutral-800 dark:text-white flex items-center gap-2">
            ✈️ Flight & Ryokan Recommendation Portal
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 font-mono text-xs mt-1">
            *Scan multiple channels, compare scores, inspect remaining seats, and book direct tickets mapped to your budget!*
          </p>
        </div>
        <div className="flex bg-neutral-100 dark:bg-[#1A1A1A] rounded-full p-1 border-2 border-neutral-800 dark:border-neutral-700 mt-3 md:mt-0">
          <button
            onClick={() => setActiveTab("flights")}
            className={`px-4 py-1 rounded-full font-handwritten text-lg font-bold transition-all ${
              activeTab === "flights" ? "bg-[#FF6B6B] text-white shadow-sm" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            }`}
          >
            🛫 Flights
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={`px-4 py-1 rounded-full font-handwritten text-lg font-bold transition-all ${
              activeTab === "hotels" ? "bg-[#4FACFE] text-white shadow-sm" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            }`}
          >
            🏨 Lodging
          </button>
          <button
            onClick={() => setActiveTab("ai-value")}
            className={`px-4 py-1 rounded-full font-handwritten text-lg font-bold transition-all flex items-center gap-1 ${
              activeTab === "ai-value" ? "bg-[#FFD166] text-neutral-900 shadow-sm" : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FF6B6B]" /> Best Value
          </button>
        </div>
      </div>

      {/* SEARCH COORDINATES INPUT BAR */}
      <div className="bg-white dark:bg-[#1A1A1A] border-2 border-neutral-800 dark:border-neutral-700 p-4 rounded-xl mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block mb-1">Departure Hub:</label>
            <div className="relative">
              <span className="absolute left-2 top-1.5 text-xs">🛫</span>
              <input
                type="text"
                value={searchDeparture}
                onChange={(e) => setSearchDeparture(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-[#2D2D2A] text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 pl-7 text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block mb-1">Destination Target:</label>
            <div className="relative">
              <span className="absolute left-2 top-1.5 text-xs">📍</span>
              <input
                type="text"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-[#2D2D2A] text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 pl-7 text-xs font-mono"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block mb-1">Travelers & Seats:</label>
            <select
              value={paxCount}
              onChange={(e) => setPaxCount(Number(e.target.value))}
              className="w-full bg-neutral-50 dark:bg-[#2D2D2A] text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-xs font-mono"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num} Explorer{num > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block mb-1">Traveler Class Cabin:</label>
            <select
              value={classType}
              onChange={(e) => setClassType(e.target.value as any)}
              className="w-full bg-neutral-50 dark:bg-[#2D2D2A] text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-xs font-mono"
            >
              <option value="Economy">Economy Cabins</option>
              <option value="Premium">Premium Economy</option>
              <option value="Business">First & Business Class</option>
            </select>
          </div>
        </div>
        <div className="mt-3 text-right flex justify-between items-center text-[10px] font-mono text-neutral-400">
          <span>*Realtime database simulation active*</span>
          <span className="text-[#4FACFE]">Origin: {searchDeparture.split(" (")[0]} ➔ Target: {searchDestination.split(",")[0]}</span>
        </div>
      </div>

      {/* MAIN TAB SWITCH CONTENT */}
      <div className="space-y-6">
        
        {/* TAB 1: FLIGHTS LIST */}
        {activeTab === "flights" && (
          <div className="space-y-4">
            {/* Header / Price Comparison stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FF6B6B]/5 border border-[#FF6B6B]/20 p-3.5 rounded-lg text-xs font-mono">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">Cheapest Ticket Flight</span>
                  <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">${flights[2].price} USD</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-x border-neutral-200 dark:border-neutral-700 md:px-4 py-2 md:py-0">
                <Clock className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">Fastest Route Connection</span>
                  <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{flights[1].duration} (Direct)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">AI Value Recommendation</span>
                  <span className="font-bold text-[#FF6B6B]">Star Alliance {flights[1].airline.split(" ")[2] || "Direct"}</span>
                </div>
              </div>
            </div>

            {/* Flight Cards Grid */}
            <div className="grid grid-cols-1 gap-4">
              {flights.map((flight) => {
                const isBooked = bookedFlight?.id === flight.id;
                const isBestVal = flight.id === "fl-2";
                
                return (
                  <div 
                    key={flight.id}
                    className={`bg-white dark:bg-[#1A1A1A] border-2 rounded-xl p-4 transition-all relative ${
                      isBooked 
                        ? "border-green-600 bg-green-500/5" 
                        : isBestVal 
                          ? "border-[#FFD166] dark:border-yellow-600 shadow-md ring-1 ring-yellow-400/20" 
                          : "border-neutral-800 dark:border-neutral-700"
                    }`}
                  >
                    {isBestVal && (
                      <span className="absolute -top-3 left-4 bg-[#FFD166] text-neutral-900 border-2 border-neutral-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-red-600" /> AI Best Value Recommended
                      </span>
                    )}

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      {/* Logo and times */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-2xl border border-neutral-300 dark:border-neutral-700">
                          {flight.logo}
                        </div>
                        <div>
                          <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-white font-bold">{flight.airline}</h4>
                          <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">{flight.stopsText} • Cabin: {classType}</span>
                        </div>
                      </div>

                      {/* Flight route diagram */}
                      <div className="flex items-center gap-3 font-mono text-xs w-full lg:w-auto justify-center lg:justify-start py-2 lg:py-0 border-y lg:border-none border-neutral-100 dark:border-neutral-800">
                        <div className="text-right">
                          <span className="font-bold text-neutral-800 dark:text-white block">{flight.departureTime}</span>
                          <span className="text-[10px] text-neutral-400 uppercase">{searchDeparture.split(" (")[0]}</span>
                        </div>
                        <div className="flex flex-col items-center px-4 relative flex-1 lg:flex-initial">
                          <span className="text-[9px] text-neutral-400">{flight.duration}</span>
                          <div className="w-24 sm:w-32 h-0.5 bg-neutral-400 dark:bg-neutral-600 relative my-1">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />
                          </div>
                          <span className="text-[8px] text-[#FF6B6B] uppercase tracking-wide">{flight.stops === 0 ? "Non-Stop" : `${flight.stops} layover`}</span>
                        </div>
                        <div>
                          <span className="font-bold text-neutral-800 dark:text-white block">{flight.arrivalTime}</span>
                          <span className="text-[10px] text-neutral-400 uppercase">{searchDestination.split(",")[0]}</span>
                        </div>
                      </div>

                      {/* Pricing and booking */}
                      <div className="text-right flex lg:flex-col justify-between items-center lg:items-end w-full lg:w-auto">
                        <div>
                          <span className="font-handwritten text-2xl text-neutral-800 dark:text-white font-black block leading-none">
                            ${flight.price * paxCount} <span className="text-xs font-sans text-neutral-400">total</span>
                          </span>
                          <span className="font-mono text-[9px] text-neutral-400 block mt-1">${flight.price} per seat</span>
                        </div>
                        <div className="mt-2 lg:mt-3">
                          {isBooked ? (
                            <button className="bg-green-600 text-white font-handwritten text-lg px-4 py-1.5 rounded-lg border-2 border-neutral-800 flex items-center gap-1 cursor-not-allowed">
                              <Check className="w-4 h-4" /> Booked & Ticketed
                            </button>
                          ) : (
                            <button
                              onClick={() => triggerBookFlight(flight)}
                              className="bg-[#FF6B6B] hover:bg-[#ff5555] text-white font-handwritten text-lg font-bold px-5 py-1.5 rounded-lg border-2 border-neutral-800 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                            >
                              Book Direct 🛫
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable info block with reviews & details */}
                    <div className="mt-4 pt-3.5 border-t border-dashed border-neutral-200 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="font-bold text-neutral-500 block uppercase text-[9px] tracking-wider mb-1">🤖 AI Routing Reasoning:</span>
                        <p className="text-neutral-600 dark:text-neutral-300 italic">"{flight.aiReason}"</p>
                        
                        {/* Occupancy Indicator */}
                        <div className="flex items-center gap-1.5 mt-3">
                          {flight.seatsRemaining <= 3 ? (
                            <span className="flex items-center gap-1 text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded text-[10px]">
                              <AlertCircle className="w-3.5 h-3.5" /> High Demand! Only {flight.seatsRemaining} seats remaining at this tier.
                            </span>
                          ) : (
                            <span className="text-green-500 font-bold text-[10px]">✓ Plenty of cabins available ({flight.seatsRemaining} seats left).</span>
                          )}
                        </div>
                      </div>
                      <div className="border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 md:pl-4">
                        <span className="font-bold text-neutral-500 block uppercase text-[9px] tracking-wider mb-2 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-500" /> Traveler Reviews ({flight.rating}/5.0 score):
                        </span>
                        <div className="space-y-2 max-h-[70px] overflow-y-auto pr-1">
                          {flight.reviews.map((rev, i) => (
                            <div key={i} className="text-[11px] bg-neutral-50 dark:bg-[#222] p-1.5 rounded border border-neutral-200 dark:border-neutral-800">
                              <span className="font-bold text-neutral-700 dark:text-neutral-300">{rev.author} ({rev.rating}★): </span>
                              <span className="text-neutral-600 dark:text-neutral-400 italic">"{rev.comment}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: HOTELS LIST */}
        {activeTab === "hotels" && (
          <div className="space-y-4">
            {/* Header / Price stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#4FACFE]/5 border border-[#4FACFE]/20 p-3.5 rounded-lg text-xs font-mono">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">Lowest Bed Cost</span>
                  <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">${hotels[1].pricePerNight}/night</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-x border-neutral-200 dark:border-neutral-700 md:px-4 py-2 md:py-0">
                <Award className="w-4 h-4 text-[#FFD166]" />
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">Top Rated Choice</span>
                  <span className="font-bold text-neutral-800 dark:text-[#FAF6EE]">{hotels[2].name.split(" ")[0]} 5★ ({hotels[2].rating}★)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <div>
                  <span className="text-neutral-500 block text-[9px] uppercase">AI Spa Ryokan Deal</span>
                  <span className="font-bold text-[#4FACFE]">{hotels[0].name.split(" ")[1] || "Traditional"}</span>
                </div>
              </div>
            </div>

            {/* Hotel Cards Grid */}
            <div className="grid grid-cols-1 gap-6">
              {hotels.map((hotel) => {
                const isBooked = bookedHotel?.id === hotel.id;
                const isBestVal = hotel.id === "ht-1";

                return (
                  <div 
                    key={hotel.id}
                    className={`bg-white dark:bg-[#1A1A1A] border-2 rounded-xl p-4 transition-all relative grid grid-cols-1 lg:grid-cols-12 gap-5 ${
                      isBooked 
                        ? "border-green-600 bg-green-500/5" 
                        : isBestVal 
                          ? "border-[#4FACFE] dark:border-blue-600 shadow-md ring-1 ring-blue-400/20" 
                          : "border-neutral-800 dark:border-neutral-700"
                    }`}
                  >
                    {isBestVal && (
                      <span className="absolute -top-3 left-4 bg-[#4FACFE] text-white border-2 border-neutral-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 z-10">
                        <Sparkles className="w-3 h-3 text-yellow-400" /> AI Best Value Recommended
                      </span>
                    )}

                    {/* Image Block */}
                    <div className="lg:col-span-4 relative rounded-xl overflow-hidden h-48 lg:h-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100">
                      <img
                        referrerPolicy="no-referrer"
                        src={hotel.imageUrl}
                        alt={hotel.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400" /> {hotel.rating}
                      </div>
                    </div>

                    {/* Details content */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 stroke-yellow-500" />
                          ))}
                        </div>
                        <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-white font-extrabold leading-tight mb-1">{hotel.name}</h4>
                        <span className="text-[10px] font-mono text-neutral-400 block mb-3">📍 Curated coordinates in {searchDestination}</span>
                        
                        {/* Amenities pills */}
                        <div className="flex flex-wrap gap-1">
                          {hotel.amenities.map((am) => (
                            <span key={am} className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[9px] font-mono px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
                              ✓ {am}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-dashed border-neutral-100 dark:border-neutral-800">
                        <span className="font-bold text-[#FF6B6B] block uppercase text-[8px] tracking-wider mb-0.5">🤖 AI Accommodation Reason:</span>
                        <p className="text-[11px] font-mono text-neutral-600 dark:text-neutral-300 italic">"{hotel.aiReason}"</p>
                      </div>
                    </div>

                    {/* Book & Reviews block */}
                    <div className="lg:col-span-3 flex flex-col justify-between items-stretch lg:border-l lg:border-dashed border-neutral-200 dark:border-neutral-800 lg:pl-5">
                      {/* Guest review list */}
                      <div className="space-y-2 mb-4 lg:mb-0">
                        <span className="font-bold text-neutral-500 block uppercase text-[8px] tracking-widest">Traveler Reviews:</span>
                        <div className="space-y-1.5 max-h-[80px] overflow-y-auto pr-1">
                          {hotel.reviews.map((rev, i) => (
                            <div key={i} className="text-[10px] font-mono bg-neutral-50 dark:bg-[#1A1A1A] p-1.5 rounded border border-neutral-100 dark:border-neutral-800 leading-tight">
                              <span className="font-bold text-neutral-700 dark:text-neutral-300">{rev.author}: </span>
                              <span className="text-neutral-500 dark:text-neutral-400 italic">"{rev.comment}"</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing and booking triggers */}
                      <div className="border-t border-dashed border-neutral-100 dark:border-neutral-800 pt-3 flex lg:flex-col justify-between items-center lg:items-end w-full">
                        <div className="text-left lg:text-right">
                          <span className="font-handwritten text-3xl text-neutral-800 dark:text-white font-black block leading-none">
                            ${hotel.pricePerNight} <span className="text-[10px] font-sans text-neutral-400">/ night</span>
                          </span>
                          <span className="font-mono text-[9px] text-red-500 font-bold block mt-1">
                            {hotel.roomsRemaining === 1 ? "⚠️ ONLY 1 ROOM LEFT!" : `✓ Only ${hotel.roomsRemaining} rooms remaining`}
                          </span>
                        </div>

                        <div className="mt-2.5 w-full">
                          {isBooked ? (
                            <button className="w-full bg-green-600 text-white font-handwritten text-lg py-1.5 rounded-lg border-2 border-neutral-800 flex items-center justify-center gap-1 cursor-not-allowed">
                              <Check className="w-4 h-4" /> Reserved Room
                            </button>
                          ) : (
                            <button
                              onClick={() => triggerBookHotel(hotel)}
                              className="w-full bg-[#4FACFE] hover:bg-[#3b93df] text-white font-handwritten text-lg font-bold py-1.5 rounded-lg border-2 border-neutral-800 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                            >
                              Reserve Room 🏨
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: AI BEST VALUE RECOMMENDATION */}
        {activeTab === "ai-value" && (
          <div className="space-y-6">
            <div className="bg-[#FAF6EE] dark:bg-[#1C2C35] border-2 border-neutral-800 p-5 rounded-2xl relative shadow-md overflow-hidden">
              <div className="absolute top-2 right-2 text-3xl opacity-10 pointer-events-none">🤖</div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-[#FFD166] fill-[#FFD166]" />
                <h4 className="font-handwritten text-3xl text-[#FF6B6B] dark:text-[#ff8888]">AI Travel Optimizer Report</h4>
              </div>

              <p className="font-mono text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                We have cross-checked multiple flight pathways from <span className="font-bold text-neutral-800 dark:text-white bg-[#FFD166]/20 px-1 rounded">{searchDeparture}</span> to <span className="font-bold text-neutral-800 dark:text-white bg-[#FF6B6B]/10 px-1 rounded">{searchDestination}</span> with local boutique lodging availability parameters.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Flight Best Value */}
                <div className="bg-white dark:bg-[#1A1A1A] border-2 border-neutral-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="bg-[#FF6B6B] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">Recommended Transit</span>
                    <h5 className="font-handwritten text-2xl font-bold text-neutral-800 dark:text-white mb-1">{bestFlight.airline}</h5>
                    <p className="font-mono text-[11px] text-neutral-500 mb-2">Connection: {bestFlight.stopsText} • Duration: {bestFlight.duration}</p>
                    <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 italic">"By opting for this route, you avoid multiple layovers at Seattle or Narita, translating to 7 more hours spent actively exploring on-site instead of suffering terminal delays."</p>
                  </div>
                  <div className="pt-3 border-t border-dashed border-neutral-100 dark:border-neutral-800 mt-4 flex justify-between items-center">
                    <span className="font-handwritten text-2xl font-bold text-neutral-800 dark:text-white">${bestFlight.price} USD</span>
                    <button 
                      onClick={() => triggerBookFlight(bestFlight)}
                      className="bg-[#FF6B6B] text-white text-xs font-mono font-bold px-3 py-1 rounded border border-neutral-800 cursor-pointer hover:bg-[#ff5555]"
                    >
                      Book Flight
                    </button>
                  </div>
                </div>

                {/* Hotel Best Value */}
                <div className="bg-white dark:bg-[#1A1A1A] border-2 border-neutral-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="bg-[#4FACFE] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2 inline-block">Recommended Lodging</span>
                    <h5 className="font-handwritten text-2xl font-bold text-neutral-800 dark:text-white mb-1">{bestHotel.name}</h5>
                    <p className="font-mono text-[11px] text-neutral-500 mb-2">Rating: {bestHotel.rating}★ ({bestHotel.stars} Stars) • Breakfast & Dinner Included</p>
                    <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 italic">"Includes hot spring spa passes worth $30. Saving budget coordinates while giving you an unforgettable local traditional experience."</p>
                  </div>
                  <div className="pt-3 border-t border-dashed border-neutral-100 dark:border-neutral-800 mt-4 flex justify-between items-center">
                    <span className="font-handwritten text-2xl font-bold text-neutral-800 dark:text-white">${bestHotel.pricePerNight}/night</span>
                    <button 
                      onClick={() => triggerBookHotel(bestHotel)}
                      className="bg-[#4FACFE] text-white text-xs font-mono font-bold px-3 py-1 rounded border border-neutral-800 cursor-pointer hover:bg-[#3b93df]"
                    >
                      Reserve Ryokan
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Combination estimate */}
              <div className="bg-white dark:bg-[#1A1A1A] border border-neutral-300 dark:border-neutral-700 p-4 rounded-xl text-center">
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-1">Estimated Combined Explorer Cost (5 Days Trip)</span>
                <span className="font-handwritten text-4xl text-[#FF6B6B] dark:text-[#ff8888] font-black block">
                  ${Math.round(bestFlight.price * paxCount + bestHotel.pricePerNight * 5)} USD
                </span>
                <span className="font-mono text-[10px] text-green-500 font-bold block mt-1">
                  ★ Bundled Package Savings: Save $140 by booking both via direct AI channel APIs!
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* DETAILED MOCK BOOKING DIALOG (bookingType) */}
      <AnimatePresence>
        {bookingType && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FAF6EE] dark:bg-[#2D2D2A] text-neutral-800 dark:text-[#FAF6EE] border-3 border-neutral-800 p-6 rounded-2xl max-w-md w-full relative notebook-shadow"
            >
              {/* Notebook binding rings mock */}
              <div className="absolute top-0 left-8 right-8 h-3 flex justify-between transform -translate-y-2 pointer-events-none">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-3 h-5 bg-neutral-800 rounded-full border border-neutral-400" />
                ))}
              </div>

              <div className="border-b-2 border-dashed border-neutral-300 dark:border-neutral-700 pb-3 mb-4 text-center">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF6B6B]">DIRECT GATEWAY INTEGRATION</span>
                <h4 className="font-handwritten text-3xl text-neutral-800 dark:text-white font-black mt-1">
                  {bookingType === "flight" ? "🛫 Airfare Boarding Invoice" : "🏨 Ryokan Reservation Desk"}
                </h4>
              </div>

              {!bookingSuccess ? (
                <div className="space-y-4">
                  {bookingType === "flight" && selectedFlight && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="bg-white dark:bg-[#1A1A1A] border-2 border-neutral-800 p-3 rounded-lg space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Carrier Line:</span>
                          <span className="font-bold">{selectedFlight.airline} {selectedFlight.logo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Routing Hub:</span>
                          <span className="font-bold">{searchDeparture.split(" (")[0]} ➔ {searchDestination.split(",")[0]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Departure:</span>
                          <span className="font-bold text-[#FF6B6B]">{selectedFlight.departureTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Flight Status:</span>
                          <span className="font-bold text-green-500">AVAILABLE</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 border-t border-dashed border-neutral-300 dark:border-neutral-700 pt-3">
                        <div className="flex justify-between">
                          <span>Base Seat Price:</span>
                          <span>${selectedFlight.price} USD</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seat Count:</span>
                          <span>{paxCount} Explorer{paxCount > 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-neutral-800 dark:text-white border-t border-neutral-300 dark:border-neutral-700 pt-2">
                          <span>Total Invoice Cost:</span>
                          <span className="text-green-600">${selectedFlight.price * paxCount} USD</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-neutral-500 italic mt-3 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                        *Note: Booking directly integrates this expense item into your Travel Journal custom budget estimator below.*
                      </p>

                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => setBookingType(null)}
                          className="flex-1 bg-white dark:bg-neutral-800 border-2 border-neutral-800 py-2 font-handwritten text-xl font-bold rounded-lg cursor-pointer hover:bg-neutral-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmFlightBooking}
                          className="flex-1 bg-[#FF6B6B] text-white border-2 border-neutral-800 py-2 font-handwritten text-xl font-bold rounded-lg cursor-pointer hover:bg-[#ff5555]"
                        >
                          Confirm Airfare 🛫
                        </button>
                      </div>
                    </div>
                  )}

                  {bookingType === "hotel" && selectedHotel && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="bg-white dark:bg-[#1A1A1A] border-2 border-neutral-800 p-3 rounded-lg space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Accomodation:</span>
                          <span className="font-bold">{selectedHotel.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Stay Duration:</span>
                          <span className="font-bold">5 Nights Stay</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Star Grade:</span>
                          <span className="font-bold text-yellow-500">{"★".repeat(selectedHotel.stars)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Room Status:</span>
                          <span className="font-bold text-green-500">RESERVED AT DESK</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 border-t border-dashed border-neutral-300 dark:border-neutral-700 pt-3">
                        <div className="flex justify-between">
                          <span>Cost Per Night:</span>
                          <span>${selectedHotel.pricePerNight} USD</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nights Count:</span>
                          <span>5 Nights</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-neutral-800 dark:text-white border-t border-neutral-300 dark:border-neutral-700 pt-2">
                          <span>Total Invoice Cost:</span>
                          <span className="text-green-600">${selectedHotel.pricePerNight * 5} USD</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-neutral-500 italic mt-3 bg-[#4FACFE]/10 p-2 rounded border border-[#4FACFE]/20">
                        *Note: Securing this traditional lodging coordinates automatically updates your overall suitcase packing checklist with lodging-specific essentials!*
                      </p>

                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => setBookingType(null)}
                          className="flex-1 bg-white dark:bg-neutral-800 border-2 border-neutral-800 py-2 font-handwritten text-xl font-bold rounded-lg cursor-pointer hover:bg-neutral-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmHotelBooking}
                          className="flex-1 bg-[#4FACFE] text-white border-2 border-neutral-800 py-2 font-handwritten text-xl font-bold rounded-lg cursor-pointer hover:bg-[#3b93df]"
                        >
                          Reserve Ryokan 🏨
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-16 h-16 bg-green-500 border-2 border-neutral-800 rounded-full flex items-center justify-center text-white text-3xl mx-auto shadow"
                  >
                    ✓
                  </motion.div>
                  <h5 className="font-handwritten text-3xl text-green-600 font-bold">Successfully Documented!</h5>
                  <p className="font-mono text-xs text-neutral-500">
                    Your official travel passport stamps and itinerary custom expense nodes have been locked in. Happy trails!
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
