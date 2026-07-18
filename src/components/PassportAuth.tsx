import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Globe, Save, Award, Trash2, Lock, Mail, UserPlus, LogIn, LogOut, CheckCircle2, ShieldAlert } from "lucide-react";
import { FullTripItinerary } from "../types";
import { PassportStamp } from "./DoodleIcons";

export interface ExplorerProfile {
  name: string;
  homeAirport: string;
  title: string;
  avatarEmoji: string;
}

export interface ExplorerAccount extends ExplorerProfile {
  email: string;
  passwordHash: string; // Stored in plain text for this local-only high-fidelity mockup
  savedTrips: FullTripItinerary[];
}

interface PassportAuthProps {
  currentTrip: FullTripItinerary | null;
  onLoadTrip: (trip: FullTripItinerary) => void;
  currentUser: ExplorerProfile & { email: string } | null;
  onUserChange: (user: (ExplorerProfile & { email: string }) | null) => void;
}

export const PassportAuth: React.FC<PassportAuthProps> = ({
  currentTrip,
  onLoadTrip,
  currentUser,
  onUserChange,
}) => {
  // Authentication screen states: "signin" | "signup"
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  
  // Input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [homeAirport, setHomeAirport] = useState("");
  const [title, setTitle] = useState("Backpack Wanderer");
  const [avatarEmoji, setAvatarEmoji] = useState("🎒");
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [justStamped, setJustStamped] = useState(false);
  const [stampText, setStampText] = useState("VERIFIED");

  // Profile editing mode (for logged-in users)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<ExplorerProfile>({
    name: "",
    homeAirport: "",
    title: "",
    avatarEmoji: "",
  });

  // Current user's saved trips list (loaded specifically for this user account)
  const [savedTrips, setSavedTrips] = useState<FullTripItinerary[]>([]);

  // 1. Initial Local Database Seed
  useEffect(() => {
    // Seed a default backpacker account if accounts list is empty
    const existingAccounts = localStorage.getItem("explorer_accounts");
    if (!existingAccounts) {
      const defaultAccount: ExplorerAccount = {
        email: "alex@wanderer.com",
        passwordHash: "password",
        name: "Alex Wanderer",
        homeAirport: "LAX (Los Angeles)",
        title: "Amateur Backpacker",
        avatarEmoji: "🎒",
        savedTrips: [],
      };
      localStorage.setItem("explorer_accounts", JSON.stringify([defaultAccount]));
    }
  }, []);

  // 2. Load custom user saved trips when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const accountsStr = localStorage.getItem("explorer_accounts");
      if (accountsStr) {
        try {
          const accounts: ExplorerAccount[] = JSON.parse(accountsStr);
          const activeAcc = accounts.find((a) => a.email.toLowerCase() === currentUser.email.toLowerCase());
          if (activeAcc) {
            setSavedTrips(activeAcc.savedTrips || []);
          } else {
            setSavedTrips([]);
          }
        } catch (e) {
          setSavedTrips([]);
        }
      }
    } else {
      // If guest/logged out, fallback to guest trips or empty list
      const cachedGuestTrips = localStorage.getItem("saved_trips_guest");
      if (cachedGuestTrips) {
        try {
          setSavedTrips(JSON.parse(cachedGuestTrips));
        } catch (e) {
          setSavedTrips([]);
        }
      } else {
        setSavedTrips([]);
      }
    }
  }, [currentUser]);

  // Handle Login submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in both email and password keys!");
      return;
    }

    const accountsStr = localStorage.getItem("explorer_accounts");
    if (accountsStr) {
      try {
        const accounts: ExplorerAccount[] = JSON.parse(accountsStr);
        const userFound = accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase().trim()
        );

        if (!userFound) {
          setErrorMsg("Customs Alert: Explorer account not found!");
          return;
        }

        if (userFound.passwordHash !== password) {
          setErrorMsg("Access Denied: Incorrect passport password key!");
          return;
        }

        // Successfully authenticated!
        setStampText("APPROVED");
        setJustStamped(true);
        setTimeout(() => {
          setJustStamped(false);
          const sessionUser = {
            email: userFound.email,
            name: userFound.name,
            homeAirport: userFound.homeAirport,
            title: userFound.title,
            avatarEmoji: userFound.avatarEmoji,
          };
          localStorage.setItem("current_explorer", JSON.stringify(sessionUser));
          onUserChange(sessionUser);
          setSuccessMsg(`Welcome back, ${userFound.name}!`);
          // Reset form fields
          setEmail("");
          setPassword("");
        }, 1500);

      } catch (err) {
        setErrorMsg("Failed to decode local records database.");
      }
    }
  };

  // Handle Account Creation submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password || !name || !homeAirport) {
      setErrorMsg("All registration fields must be completed!");
      return;
    }

    if (password.length < 4) {
      setErrorMsg("Security constraint: password must be at least 4 letters!");
      return;
    }

    const accountsStr = localStorage.getItem("explorer_accounts") || "[]";
    try {
      const accounts: ExplorerAccount[] = JSON.parse(accountsStr);
      const emailExists = accounts.some(
        (a) => a.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (emailExists) {
        setErrorMsg("Credentials exist: That email holds another passport!");
        return;
      }

      // Create new account object
      const newAccount: ExplorerAccount = {
        email: email.toLowerCase().trim(),
        passwordHash: password,
        name: name.trim(),
        homeAirport: homeAirport.trim(),
        title: title,
        avatarEmoji: avatarEmoji,
        savedTrips: [],
      };

      // Push to DB
      accounts.push(newAccount);
      localStorage.setItem("explorer_accounts", JSON.stringify(accounts));

      setStampText("REGISTERED");
      setJustStamped(true);

      setTimeout(() => {
        setJustStamped(false);
        const sessionUser = {
          email: newAccount.email,
          name: newAccount.name,
          homeAirport: newAccount.homeAirport,
          title: newAccount.title,
          avatarEmoji: newAccount.avatarEmoji,
        };
        localStorage.setItem("current_explorer", JSON.stringify(sessionUser));
        onUserChange(sessionUser);
        setSuccessMsg(`Welcome to the team, ${newAccount.name}!`);
        // Reset form
        setEmail("");
        setPassword("");
        setName("");
        setHomeAirport("");
      }, 1500);

    } catch (err) {
      setErrorMsg("Account registration failed.");
    }
  };

  // Handle Log Out
  const handleSignOut = () => {
    setStampText("DEPARTED");
    setJustStamped(true);
    setTimeout(() => {
      setJustStamped(false);
      localStorage.removeItem("current_explorer");
      onUserChange(null);
      setIsEditingProfile(false);
      setSuccessMsg("");
      setErrorMsg("");
    }, 1200);
  };

  // Save changes to current user profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const accountsStr = localStorage.getItem("explorer_accounts");
    if (accountsStr) {
      try {
        const accounts: ExplorerAccount[] = JSON.parse(accountsStr);
        const index = accounts.findIndex((a) => a.email.toLowerCase() === currentUser.email.toLowerCase());
        
        if (index !== -1) {
          // Update details in DB
          accounts[index].name = tempProfile.name;
          accounts[index].homeAirport = tempProfile.homeAirport;
          accounts[index].title = tempProfile.title;
          accounts[index].avatarEmoji = tempProfile.avatarEmoji;

          localStorage.setItem("explorer_accounts", JSON.stringify(accounts));

          // Update active session
          const updatedSession = {
            email: currentUser.email,
            ...tempProfile,
          };
          localStorage.setItem("current_explorer", JSON.stringify(updatedSession));
          onUserChange(updatedSession);

          setIsEditingProfile(false);
          setStampText("UPDATED");
          setJustStamped(true);
          setTimeout(() => setJustStamped(false), 2000);
        }
      } catch (err) {
        setErrorMsg("Failed to edit user profile.");
      }
    }
  };

  // Save itinerary to current user list or guest list
  const handleSaveCurrentTrip = () => {
    if (!currentTrip) return;

    // Check if already exists in saved list
    const exists = savedTrips.some((t) => t.destination.toLowerCase() === currentTrip.destination.toLowerCase());
    if (exists) return;

    const updated = [currentTrip, ...savedTrips];
    setSavedTrips(updated);

    if (currentUser) {
      // Save specifically to user account
      const accountsStr = localStorage.getItem("explorer_accounts");
      if (accountsStr) {
        try {
          const accounts: ExplorerAccount[] = JSON.parse(accountsStr);
          const idx = accounts.findIndex((a) => a.email.toLowerCase() === currentUser.email.toLowerCase());
          if (idx !== -1) {
            accounts[idx].savedTrips = updated;
            localStorage.setItem("explorer_accounts", JSON.stringify(accounts));
          }
        } catch (e) {}
      }
    } else {
      // Save to guest list
      localStorage.setItem("saved_trips_guest", JSON.stringify(updated));
    }

    setStampText("SAVED");
    setJustStamped(true);
    setTimeout(() => setJustStamped(false), 2000);
  };

  // Delete saved trip from current user list or guest list
  const handleDeleteTrip = (destName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedTrips.filter((t) => t.destination !== destName);
    setSavedTrips(updated);

    if (currentUser) {
      // Save to user account
      const accountsStr = localStorage.getItem("explorer_accounts");
      if (accountsStr) {
        try {
          const accounts: ExplorerAccount[] = JSON.parse(accountsStr);
          const idx = accounts.findIndex((a) => a.email.toLowerCase() === currentUser.email.toLowerCase());
          if (idx !== -1) {
            accounts[idx].savedTrips = updated;
            localStorage.setItem("explorer_accounts", JSON.stringify(accounts));
          }
        } catch (e) {}
      }
    } else {
      // Save to guest list
      localStorage.setItem("saved_trips_guest", JSON.stringify(updated));
    }
  };

  const avatarPresets = ["🎒", "🧭", "🌴", "🏔️", "✈️", "🌊", "🗺️", "📸", "🏕️", "🦁", "🥞", "🍣"];
  const titlePresets = ["Backpack Wanderer", "Luxury Globetrotter", "Nature Seeker", "Historical Nomad", "Culinary Trailblazer", "Cozy Adventurer"];

  return (
    <div className="bg-[#FAF6EE] dark:bg-[#2D2D2A] sketch-border p-6 notebook-shadow relative overflow-hidden">
      {/* Decorative notebook binders on left side */}
      <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around bg-neutral-800 opacity-10 py-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-5 h-2.5 bg-neutral-800 rounded-r-full -translate-x-1" />
        ))}
      </div>

      <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* LEFT SIDE: AUTH FORM OR PROFILE DOCUMENT CARD */}
        <div className="bg-[#8A3324] border-3 border-neutral-800 rounded-2xl p-5 text-white flex flex-col justify-between relative shadow-lg overflow-hidden min-h-[360px]">
          {/* Subtle gold passport crest engraving */}
          <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
            <Globe className="w-48 h-48 stroke-[1]" />
          </div>

          <div className="border-b border-yellow-500 pb-3 mb-4 text-center">
            <span className="font-mono text-[9px] tracking-[4px] text-yellow-500 uppercase block">OFFICIAL CREDENTIALS</span>
            <span className="font-handwritten text-2xl text-yellow-100">Travel Passport Portal</span>
          </div>

          <AnimatePresence mode="wait">
            {!currentUser ? (
              // NOT SIGNED IN: SHOW LOGIN OR SIGNUP CARD
              <motion.div
                key={authMode}
                initial={{ opacity: 0, x: authMode === "signin" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: authMode === "signin" ? 20 : -20 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col justify-between"
              >
                {/* Mode Selector Tabs */}
                <div className="flex bg-black/20 rounded-lg p-1 mb-4 border border-white/10">
                  <button
                    onClick={() => {
                      setAuthMode("signin");
                      setErrorMsg("");
                    }}
                    className={`flex-1 text-center py-1 font-handwritten text-lg rounded-md transition-colors ${
                      authMode === "signin" ? "bg-[#FFD166] text-neutral-900 font-bold" : "text-white hover:bg-white/5"
                    }`}
                  >
                    🔑 Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      setErrorMsg("");
                    }}
                    className={`flex-1 text-center py-1 font-handwritten text-lg rounded-md transition-colors ${
                      authMode === "signup" ? "bg-[#FFD166] text-neutral-900 font-bold" : "text-white hover:bg-white/5"
                    }`}
                  >
                    ✨ Create Account
                  </button>
                </div>

                {/* SIGN IN FORM */}
                {authMode === "signin" ? (
                  <form onSubmit={handleSignIn} className="space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest block mb-1">Explorer Email:</label>
                        <div className="relative">
                          <Mail className="absolute left-2.5 top-2 w-3.5 h-3.5 text-neutral-400" />
                          <input
                            type="email"
                            required
                            placeholder="e.g. alex@wanderer.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg pl-8 pr-2.5 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-yellow-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest block mb-1">Password Key:</label>
                        <div className="relative">
                          <Lock className="absolute left-2.5 top-2 w-3.5 h-3.5 text-neutral-400" />
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg pl-8 pr-2.5 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-yellow-500"
                          />
                        </div>
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5 mt-2">
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {successMsg && (
                      <div className="bg-green-500/20 border border-green-500/30 text-green-200 p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5 mt-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                        <span>{successMsg}</span>
                      </div>
                    )}

                    <div className="pt-4 space-y-2">
                      <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-handwritten text-lg font-bold py-1.5 rounded-lg border-2 border-neutral-800 shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" /> Open Diary Passport
                      </button>
                      <div className="text-center">
                        <span className="text-[10px] font-mono text-neutral-300">
                          Demo account: <span className="text-yellow-400 font-bold">alex@wanderer.com</span> / <span className="text-yellow-400 font-bold">password</span>
                        </span>
                      </div>
                    </div>
                  </form>
                ) : (
                  // CREATE ACCOUNT FORM
                  <form onSubmit={handleSignUp} className="space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Email:</label>
                          <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg px-2 py-0.5 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Password Key:</label>
                          <input
                            type="password"
                            required
                            placeholder="Min 4 chars"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg px-2 py-0.5 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Wanderer Name:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Maya Explorer"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg px-2 py-0.5 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Home Airport:</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. HND (Tokyo)"
                            value={homeAirport}
                            onChange={(e) => setHomeAirport(e.target.value)}
                            className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg px-2 py-0.5 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Travel Class:</label>
                          <select
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg px-2 py-0.5 text-xs font-mono"
                          >
                            {titlePresets.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Stamp Avatar:</label>
                          <select
                            value={avatarEmoji}
                            onChange={(e) => setAvatarEmoji(e.target.value)}
                            className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg px-2 py-0.5 text-xs font-mono"
                          >
                            {avatarPresets.map((emoji) => (
                              <option key={emoji} value={emoji}>{emoji} Style</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-1.5 rounded-lg text-[10px] font-mono flex items-center gap-1 mt-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#FFD166] hover:bg-yellow-400 text-neutral-900 font-handwritten text-lg font-bold py-1.5 rounded-lg border-2 border-neutral-800 shadow-sm transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" /> Issue New Passport ID
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              // SIGNED IN: SHOW USER PROFILE CARD
              <motion.div
                key="signedin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 flex-1 flex flex-col justify-between"
              >
                {!isEditingProfile ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/20">
                      <div className="w-16 h-16 rounded-full bg-[#FAF6EE] border-2 border-yellow-500 flex items-center justify-center text-3xl shadow-inner relative">
                        {currentUser.avatarEmoji}
                      </div>
                      <div>
                        <h4 className="font-handwritten text-2xl leading-none text-yellow-400">{currentUser.name}</h4>
                        <span className="text-[11px] font-mono text-neutral-300 block mt-1 uppercase tracking-wider flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-yellow-500" /> {currentUser.title}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 font-mono text-xs text-neutral-200">
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span>🛫 Home Hub:</span>
                        <span className="font-bold text-yellow-400">{currentUser.homeAirport}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span>📧 Registered Email:</span>
                        <span className="font-bold text-neutral-100">{currentUser.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1">
                        <span>🛡️ Authority Level:</span>
                        <span className="font-bold text-green-400">ACTIVE EXPLORER</span>
                      </div>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setTempProfile({
                            name: currentUser.name,
                            homeAirport: currentUser.homeAirport,
                            title: currentUser.title,
                            avatarEmoji: currentUser.avatarEmoji,
                          });
                          setIsEditingProfile(true);
                        }}
                        className="bg-white/15 hover:bg-white/25 text-white font-handwritten text-lg font-bold py-1.5 rounded-lg border border-white/30 transition-colors cursor-pointer"
                      >
                        ✏️ Edit Badge
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="bg-red-500/80 hover:bg-red-600 text-white font-handwritten text-lg font-bold py-1.5 rounded-lg border-2 border-neutral-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  // EDIT BADGE FORM
                  <form onSubmit={handleSaveProfile} className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Full Name:</label>
                        <input
                          type="text"
                          required
                          value={tempProfile.name}
                          onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                          className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg px-2 py-0.5 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Home Airport:</label>
                        <input
                          type="text"
                          required
                          value={tempProfile.homeAirport}
                          onChange={(e) => setTempProfile({ ...tempProfile, homeAirport: e.target.value })}
                          className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg px-2 py-0.5 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Travel Class:</label>
                        <select
                          value={tempProfile.title}
                          onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                          className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg p-0.5 text-xs font-mono"
                        >
                          {titlePresets.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-neutral-300 uppercase block mb-0.5">Stamp Icon:</label>
                        <select
                          value={tempProfile.avatarEmoji}
                          onChange={(e) => setTempProfile({ ...tempProfile, avatarEmoji: e.target.value })}
                          className="w-full bg-white text-neutral-800 border-2 border-neutral-800 rounded-lg p-0.5 text-xs font-mono"
                        >
                          {avatarPresets.map((emoji) => (
                            <option key={emoji} value={emoji}>{emoji} Style</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1.5">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-mono text-xs py-1 rounded-lg border border-white/20"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-mono text-xs font-bold py-1 rounded-lg border-2 border-neutral-800"
                      >
                        Confirm Changes
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Golden Badge Detail bottom */}
          <div className="mt-4 border-t border-yellow-600/30 pt-3 flex items-center justify-between text-[10px] font-mono text-yellow-500">
            <span>PASSPORT DOCUMENT</span>
            <span>SECURE SYSTEM</span>
          </div>

          {/* Stamped passport overlay animation */}
          {justStamped && (
            <div className="absolute inset-0 z-40 bg-white/10 backdrop-blur-[1.5px] flex items-center justify-center pointer-events-none">
              <PassportStamp text={stampText} country={currentUser ? currentUser.name : "WANDERER"} className="scale-125" />
            </div>
          )}
        </div>

        {/* RIGHT SIDE: SAVED ADVENTURES TRAVEL ALBUM */}
        <div className="bg-white dark:bg-[#1A1A1A] sketch-border-sm p-5 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
          <div>
            <h4 className="font-handwritten text-2xl text-neutral-800 dark:text-[#FAF6EE] border-b border-dashed border-neutral-300 dark:border-neutral-700 pb-2 mb-3 flex items-center gap-2">
              📂 Saved Adventures Album
            </h4>

            {currentTrip && !savedTrips.some((t) => t.destination.toLowerCase() === currentTrip.destination.toLowerCase()) ? (
              <div className="bg-[#FFD166]/20 border-2 border-dashed border-[#FFD166]/40 p-3 rounded-xl mb-4 flex items-center justify-between">
                <div>
                  <p className="font-handwritten text-lg leading-tight text-neutral-800 dark:text-[#FAF6EE] font-bold">
                    Save current plan to album?
                  </p>
                  <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                    📂 {currentTrip.destination}, {currentTrip.country}
                  </span>
                </div>
                <button
                  onClick={handleSaveCurrentTrip}
                  className="bg-[#FFD166] hover:bg-yellow-400 text-neutral-900 border-2 border-neutral-800 font-mono text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Trip
                </button>
              </div>
            ) : null}

            {savedTrips.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 font-handwritten text-lg italic px-4">
                {currentUser ? (
                  `"No adventures saved in ${currentUser.name}'s passport album yet. Create an itinerary above to save!"`
                ) : (
                  '"Log in or issue a travel passport to start storing your adventure notebooks!"'
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {savedTrips.map((trip) => (
                  <div
                    key={trip.destination}
                    onClick={() => onLoadTrip(trip)}
                    className="group bg-[#FAF6EE] dark:bg-[#2D2D2A] hover:bg-[#A8E6CF]/30 dark:hover:bg-[#A8E6CF]/20 border-2 border-neutral-800 dark:border-neutral-700 p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✈️</span>
                      <div>
                        <h5 className="font-handwritten text-lg font-bold leading-none text-neutral-800 dark:text-[#FAF6EE]">
                          {trip.destination}
                        </h5>
                        <span className="font-mono text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                          {trip.country} ({trip.itinerary.length} Days) • {trip.averageTemp}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteTrip(trip.destination, e)}
                      className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-800 dark:hover:border-neutral-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-right border-t border-dashed border-neutral-200 dark:border-neutral-700 pt-3 mt-4 flex justify-between items-center text-[10px] font-mono text-neutral-400">
            <span>
              {currentUser ? `Account: ${currentUser.email}` : "Guest Mode"}
            </span>
            <span className="uppercase">
              Total Saved: {savedTrips.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
