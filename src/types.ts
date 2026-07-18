export interface ItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  cost: number;
  notes: string;
}

export interface DestinationItem {
  name: string;
  country: string;
  temp: string;
  budgetLevel: string;
  rating: number;
  bestTime: string;
  visaRequired: string;
  attractions: string[];
  foodToTry: string[];
  description: string;
}

export interface TripBudget {
  flights: number;
  hotels: number;
  food: number;
  transport: number;
  activities: number;
  shopping: number;
  emergency: number;
  total: number;
}

export interface PackingCategory {
  category: string;
  items: string[];
}

export interface EmergencyContact {
  name: string;
  contact: string;
}

export interface PostcardData {
  title: string;
  message: string;
  stampText: string;
  doodleDescription: string;
}

export interface FullTripItinerary {
  destination: string;
  country: string;
  tagline: string;
  summary: string;
  budgetLevel: string;
  bestSeason: string;
  visaInfo: string;
  rating: number;
  averageTemp: string;
  currency: string;
  language: string;
  funFacts: string[];
  budget: TripBudget;
  destinations: DestinationItem[];
  itinerary: ItineraryDay[];
  packingChecklist: PackingCategory[];
  safetyTips: string[];
  emergencyContacts: EmergencyContact[];
  travelTips: string[];
  postcard: PostcardData;
}

export interface InspirationCard {
  title: string;
  country: string;
  category: "Mountains" | "Beaches" | "Cities" | "Forests" | "Snow" | "Road Trips" | "Luxury Resorts" | "Camping";
  facts: string;
  budget: string;
  imageUrl: string;
}
