import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  User as UserIcon,
  Shield,
  Crown,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import API_URL from "../config";

const PlayerGallery = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/players`);
        setPlayers(res.data);
        setFilteredPlayers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching players:", err);
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  useEffect(() => {
    let result = players;
    if (search) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.dept.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (filter !== "All") {
      result = result.filter((p) => p.role === filter);
    }
    setFilteredPlayers(result);
  }, [search, filter, players]);

  const roles = ["All", "Batsman", "Bowler", "All-rounder", "Wicket-keeper"];

  return (
    <div className="min-h-screen bg-premium-dark text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-premium-gold/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/"
              className="text-sm font-bold text-premium-gold hover:underline flex items-center gap-2 uppercase tracking-widest"
            >
              ← Back to Arena
            </Link>
            <div className="text-xs font-mono opacity-50 uppercase tracking-[0.3em]">
              Official Player Registry
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">
            PLAYER <span className="text-premium-gold">GALLERY</span>
          </h1>
          <p className="text-gray-400 max-w-2xl border-l-2 border-premium-gold pl-4 text-sm md:text-base">
            Discover the stars of the upcoming season. Browse through all
            registered athletes awaiting their moment in the spotlight.
          </p>
        </header>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or department..."
              className="w-full bg-black/40 border border-premium-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-premium-gold transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${
                  filter === role
                    ? "bg-premium-gold text-black border-premium-gold"
                    : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-premium-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredPlayers.map((player) => (
                <motion.div
                  key={player._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -10 }}
                  className="premium-card group relative overflow-hidden border border-white/5 hover:border-premium-gold/30 transition-all bg-black/40 backdrop-blur-sm"
                >
                  {/* Role Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="text-[10px] bg-premium-gold/10 text-premium-gold px-2 py-1 rounded font-black uppercase tracking-tighter">
                      {player.role}
                    </span>
                  </div>

                  {/* Player Image Placeholder / Header */}
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                    <UserIcon
                      size={80}
                      className="text-gray-700 relative z-10 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-premium-gold/5 group-hover:bg-premium-gold/10 transition-colors"></div>

                    {/* Status Ribbon */}
                    <div
                      className={`absolute bottom-0 left-0 w-full py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] z-20 ${
                        player.status === "sold"
                          ? "bg-green-600 text-white"
                          : player.status === "unsold"
                            ? "bg-red-600 text-white"
                            : player.status === "approved"
                              ? "bg-premium-gold text-black"
                              : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {player.status === "pending"
                        ? "Verification Pending"
                        : player.status}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black italic mb-1 group-hover:text-premium-gold transition-colors">
                      {player.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-bold uppercase tracking-widest">
                      <span>{player.dept}</span>
                      <span className="w-1.5 h-1.5 bg-premium-gold rounded-full opacity-50"></span>
                      <span>{player.year} Year</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <p className="text-[8px] text-gray-500 uppercase font-black mb-1">
                          Base Price
                        </p>
                        <p className="text-sm font-mono font-bold">
                          ₹{player.basePrice}L
                        </p>
                      </div>
                      {player.status === "sold" ? (
                        <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                          <p className="text-[8px] text-green-500 uppercase font-black mb-1">
                            Sold For
                          </p>
                          <p className="text-sm font-mono font-bold text-green-400">
                            ₹{player.soldPrice}L
                          </p>
                        </div>
                      ) : (
                        <div className="bg-blue-500/5 p-2 rounded-lg border border-blue-500/10">
                          <p className="text-[8px] text-blue-400 uppercase font-black mb-1">
                            Matches
                          </p>
                          <p className="text-sm font-mono font-bold">
                            {player.stats?.matches || 0}
                          </p>
                        </div>
                      )}
                    </div>

                    {player.team && (
                      <div className="flex items-center gap-2 p-2 bg-premium-gold/5 rounded border border-premium-gold/20">
                        <Shield size={12} className="text-premium-gold" />
                        <span className="text-[10px] font-bold text-premium-gold uppercase">
                          Squad: {player.team.name}
                        </span>
                      </div>
                    )}

                    {!player.team && player.status === "approved" && (
                      <p className="text-[10px] text-center italic text-gray-600">
                        Awaiting bidding in live auction
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {filteredPlayers.length === 0 && !loading && (
          <div className="text-center py-24 glass-panel border-dashed border-2">
            <p className="text-gray-500 mb-4 opacity-70">
              No players found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setFilter("All");
              }}
              className="text-premium-gold font-bold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerGallery;
