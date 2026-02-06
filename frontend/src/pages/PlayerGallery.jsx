import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  User as UserIcon,
  Shield,
  Crown,
  ChevronRight,
  ArrowLeft,
  X,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import API_URL from "../config";

const PlayerGallery = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [filterTeam, setFilterTeam] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const teamName = searchParams.get("team");
    if (teamName) {
      setFilterTeam(teamName);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/players`);
        setPlayers(res.data);
        setFilteredPlayers(res.data);

        // Extract unique teams
        const uniqueTeams = [
          ...new Set(
            res.data
              .filter((p) => p.team)
              .map((p) => p.team.name)
              .filter(Boolean),
          ),
        ];
        setTeams(["All", ...uniqueTeams]);

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
    if (filterTeam !== "All") {
      result = result.filter((p) => p.team && p.team.name === filterTeam);
    }
    setFilteredPlayers(result);
  }, [search, filter, filterTeam, players]);

  const roles = ["All", "Batsman", "Bowler", "All-rounder", "Wicket-keeper"];

  const clearFilters = () => {
    setSearch("");
    setFilter("All");
    setFilterTeam("All");
    searchParams.delete("team");
    setSearchParams(searchParams);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-premium-dark text-white p-4 md:p-12 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-premium-gold/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <Link
              to="/"
              className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-gray-500 hover:text-premium-gold transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-premium-gold/50 transition-all">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              Back to Command
            </Link>
            <div className="badge-gold">Registry v4.0.2</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
              PLAYER <span className="shimmer-text">GALLERY</span>
            </h1>
            <p className="text-gray-400 max-w-2xl border-l-2 border-premium-gold/30 pl-6 text-sm md:text-base font-bold uppercase tracking-widest leading-relaxed opacity-70">
              Complete archive of tactical assets. Filter by discipline, franchise association, or identify specific units via callsign search.
            </p>
          </motion.div>
        </header>

        {/* Tactical Interaction Layer (Filters) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 md:p-8 mb-12 space-y-8 border-white/5"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            {/* Search Input */}
            <div className="relative w-full lg:w-96 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-premium-gold transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="SEARCH CALLSIGN / DEPT..."
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-premium-gold/50 focus:ring-4 focus:ring-premium-gold/5 transition-all font-black text-xs tracking-widest uppercase placeholder:text-gray-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Role Filter */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                <Target size={12} className="text-premium-gold" /> Discipline Matrix
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilter(role)}
                    className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border transform ${filter === role
                        ? "bg-gradient-to-r from-premium-gold to-premium-gold-dark text-black border-premium-gold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105"
                        : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Team Filter */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                <Shield size={12} className="text-blue-500" /> Franchise Deployment
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {teams.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setFilterTeam(t);
                      if (t === "All") {
                        searchParams.delete("team");
                      } else {
                        searchParams.set("team", t);
                      }
                      setSearchParams(searchParams);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border transform ${filterTeam === t
                        ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105"
                        : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(search || filter !== "All" || filterTeam !== "All") && (
              <button
                onClick={clearFilters}
                className="lg:ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors group"
              >
                <X size={14} className="group-hover:rotate-90 transition-transform" />
                System Reset
              </button>
            )}
          </div>
        </motion.div>

        {/* Global Asset Grid */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-premium-gold/10 border-t-premium-gold rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-premium-gold uppercase tracking-[0.4em] animate-pulse">Synchronizing Global Intel...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredPlayers.map((player) => (
                <motion.div
                  key={player._id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -12 }}
                  className="glass-panel group relative overflow-hidden border-white/5 hover:border-premium-gold/30 transition-all bg-black/40 flex flex-col"
                >
                  {/* Status Indicator Bar */}
                  <div
                    className={`h-1 w-full absolute top-0 left-0 z-30 ${player.status === "sold" ? "bg-green-500" :
                      player.status === "unsold" ? "bg-red-500" :
                        player.status === "approved" ? "bg-premium-gold" : "bg-gray-700"
                      }`}
                  />

                  {/* Header Area */}
                  <div className="h-56 bg-gradient-to-br from-white/5 to-transparent relative flex items-center justify-center overflow-hidden">
                    <UserIcon
                      size={100}
                      className="text-gray-900 group-hover:scale-110 group-hover:text-gray-800 transition-all duration-700 relative z-10"
                    />
                    <div className="absolute inset-0 bg-premium-gold/5 group-hover:bg-premium-gold/10 transition-colors"></div>

                    {/* Role Overlay */}
                    <div className="absolute top-6 right-6">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md text-premium-gold px-3 py-1.5 rounded-lg border border-premium-gold/20">
                        {player.role}
                      </span>
                    </div>

                    {/* Scanning Animation */}
                    <div className="absolute inset-x-0 h-1 bg-premium-gold/20 top-0 group-hover:animate-scan pointer-events-none"></div>

                    {/* Operational Status Overlay */}
                    <div className="absolute bottom-4 inset-x-4 flex justify-between items-end z-20">
                      <div className="flex flex-col gap-1">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic leading-none">Status</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest italic ${player.status === "sold" ? "text-green-500" :
                          player.status === "unsold" ? "text-red-500" : "text-premium-gold"
                          }`}>
                          {player.status === "pending" ? "Awaiting Intel" : player.status}
                        </p>
                      </div>
                      {player.team && (
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic leading-none">Franchise</p>
                          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                            <Shield size={10} className="text-blue-500" />
                            <span className="text-[9px] font-black text-blue-400 uppercase">{player.team.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 space-y-6 flex-1 flex flex-col border-t border-white/5">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-premium-gold transition-colors truncate">
                        {player.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                        <span>{player.dept}</span>
                        <div className="w-1 h-1 bg-premium-gold/30 rounded-full" />
                        <span>LVL_{player.year} UNIT</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.03] border border-white/5 p-3 rounded-xl hover:bg-white/[0.05] transition-all">
                        <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1 italic">
                          Reserve Price
                        </p>
                        <p className="text-lg font-black font-mono text-white">
                          ₹{player.basePrice} <span className="text-[10px] text-gray-500">L</span>
                        </p>
                      </div>

                      {player.status === "sold" ? (
                        <div className="bg-green-500/5 border border-green-500/10 p-3 rounded-xl">
                          <p className="text-[8px] text-green-600 uppercase font-black tracking-widest mb-1 italic">
                            Market Value
                          </p>
                          <p className="text-lg font-black font-mono text-green-500">
                            ₹{player.soldPrice} <span className="text-[10px] opacity-50">L</span>
                          </p>
                        </div>
                      ) : (
                        <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl">
                          <p className="text-[8px] text-blue-500 uppercase font-black tracking-widest mb-1 italic">
                            Active Stats
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-black font-mono text-blue-400">
                              {player.stats?.matches || 0}
                            </p>
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Matches</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {player.status === "approved" && !player.team && (
                      <div className="flex items-center gap-3 py-3 border-y border-white/5 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Activity size={12} className="text-premium-gold" />
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Awaiting Operational Allocation</p>
                      </div>
                    )}

                    {/* View Profile Action (Optional future addition) */}
                    {/* <button className="mt-auto w-full py-3 bg-white/[0.03] hover:bg-premium-gold hover:text-black transition-all rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 group/btn">
                        Access Full Dossier <ChevronRight size={12} className="inline ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </button> */}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredPlayers.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 glass-panel border-dashed border-2 flex flex-col items-center gap-6"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
              <Search size={32} />
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 font-black uppercase tracking-widest">
                No tactical assets matching criteria.
              </p>
              <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">Verify system filters or initialize reset.</p>
            </div>
            <button
              onClick={clearFilters}
              className="text-premium-gold font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2"
            >
              <Zap size={14} /> Global System Restore
            </button>
          </motion.div>
        )}

        {/* Footer Note */}
        <footer className="mt-24 text-center space-y-4">
          <div className="w-px h-12 bg-gradient-to-b from-premium-gold/30 to-transparent mx-auto"></div>
          <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] italic leading-relaxed">
            Tactical Intel Registry G2K26 | Authorized Access Only | Global Recruitment Framework
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PlayerGallery;
