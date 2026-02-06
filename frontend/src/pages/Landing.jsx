import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  Crown,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  ChevronRight,
  Trophy,
  Activity,
  ArrowUpRight
} from "lucide-react";
import axios from "axios";
import io from "socket.io-client";

import API_URL from "../config";

const Landing = () => {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    soldPlayers: 0,
    unsoldPlayers: 0,
    teamStats: [],
  });

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [allTeams, setAllTeams] = useState([]);

  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const [statsRes, teamsRes] = await Promise.all([
          axios.get(`${API_URL}/api/stats`),
          axios.get(`${API_URL}/api/admin/teams`)
        ]);
        setStats(statsRes.data);
        setAllTeams(teamsRes.data.filter(t => t.status === "approved"));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchEverything();
    const socket = io(API_URL);
    socket.on("playerSold", fetchEverything);
    socket.on("playerUnsold", fetchEverything);
    const interval = setInterval(fetchEverything, 30000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, []);

  const selectedTeamData = allTeams.find(t => t.name === selectedTeam);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-premium-dark flex flex-col relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-premium-gold/5 rounded-full blur-[160px] animate-pulse-slow"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-premium-accent/5 rounded-full blur-[160px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      </div>

      {/* Navbar Integration */}
      <nav className="relative z-50 w-full px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-premium-gold to-premium-gold-dark rounded-xl flex items-center justify-center shadow-lg shadow-premium-gold/20 transform rotate-3">
            <Trophy className="text-black" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">
              Gulties <span className="text-premium-gold">AUCTION</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] text-gray-500 uppercase">
              South Indian Cricket League
            </p>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "The Arena", path: "/live" },
            { name: "Squads", path: "/squads" },
            { name: "Player Gallery", path: "/players" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-premium-gold transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-tighter">Live Portal</span>
        </motion.div>
      </nav>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-20 max-w-7xl mx-auto w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full grid lg:grid-cols-12 gap-12 items-center"
        >
          {/* Hero Section */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div variants={itemVariants}>
              <span className="badge-gold mb-4 inline-block">Official 2026 Portal</span>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white leading-[0.85]">
                DRAFT THE <br />
                <span className="shimmer-text">ULTIMATE</span> <br />
                SQUAD.
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed font-light">
              Experience the intensity of high-stakes bidding. Watch real-time
              player allocations and manage your team budget with precision.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
              <Link to="/player-login" className="btn-gold group flex items-center gap-2">
                JOIN AS PLAYER
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/captain-login" className="btn-outline-gold flex items-center gap-2">
                CAPTAIN'S ROOM
                <Shield size={18} />
              </Link>
            </motion.div>

            {/* Quick Stats Banner */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              {[
                { label: "Players", value: stats.totalPlayers, icon: Users, color: "text-premium-gold" },
                { label: "Sold", value: stats.soldPlayers, icon: UserCheck, color: "text-green-400" },
                { label: "Remaining", value: stats.unsoldPlayers, icon: UserX, color: "text-red-400" },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-500">
                    <stat.icon size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <p className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Real-time Dashboard Preview */}
          <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-8 relative overflow-hidden group min-h-[500px] flex flex-col">
              <div className="absolute top-0 right-0 p-6 text-premium-gold opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={120} />
              </div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-premium-gold">Auction Pulse</h3>
                  {selectedTeam && (
                    <button
                      onClick={() => setSelectedTeam(null)}
                      className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors mt-2 flex items-center gap-1 group/back"
                    >
                      <ChevronRight size={10} className="rotate-180 group-hover/back:-translate-x-1 transition-transform" />
                      System Restore / All Units
                    </button>
                  )}
                </div>
                <div className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[8px] font-bold uppercase">Updating Live</div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {selectedTeamData ? (
                    <motion.div
                      key="selected-team"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="glass-card p-6 bg-premium-gold/5 border-premium-gold/20">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-premium-gold/10 border border-premium-gold/30 flex items-center justify-center text-xl font-black italic text-premium-gold">
                              {selectedTeamData.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-xl font-black italic text-white uppercase">{selectedTeamData.name}</h4>
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Classification: Active Franchise</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Reserve Balance</p>
                            <p className="text-xl font-black font-mono text-green-500 italic">₹{(selectedTeamData.remainingPurse / 100).toFixed(2)} Cr</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <span>Secured Units</span>
                            <span>{selectedTeamData.players?.length || 0} / 15</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${((selectedTeamData.players?.length || 0) / 15) * 100}%` }}
                              className="h-full bg-premium-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] pl-2 border-l-2 border-premium-gold/30 italic">Secured Assets Archive</p>
                        {selectedTeamData.players && selectedTeamData.players.length > 0 ? (
                          selectedTeamData.players.map((p, idx) => (
                            <motion.div
                              key={p._id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="bg-white/[0.02] border border-white/5 p-3 rounded-xl flex justify-between items-center group/player hover:bg-white/[0.05] transition-all"
                            >
                              <div>
                                <p className="text-xs font-black text-white uppercase group-hover/player:text-premium-gold transition-colors">{p.name}</p>
                                <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{p.role}</p>
                              </div>
                              <p className="text-[10px] font-black font-mono text-premium-gold italic">₹{p.soldPrice} L</p>
                            </motion.div>
                          ))
                        ) : (
                          <div className="py-12 text-center opacity-20 flex flex-col items-center gap-3">
                            <Users size={32} />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Tactical Allocations Yet</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="team-list"
                      className="space-y-4"
                    >
                      {stats.teamStats.length > 0 ? (
                        stats.teamStats.map((team, idx) => (
                          <motion.div
                            key={idx}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => setSelectedTeam(team.name)}
                            className="glass-card p-4 flex items-center justify-between group/card cursor-pointer border-transparent hover:border-premium-gold/30 hover:bg-white/[0.04] transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center text-xs font-black italic text-premium-gold group-hover/card:scale-110 transition-transform">
                                {team.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white group-hover/card:text-premium-gold transition-colors">{team.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(team.playerCount / 15) * 100}%` }}
                                      className="h-full bg-premium-gold"
                                    />
                                  </div>
                                  <span className="text-[10px] font-mono text-gray-500">{team.playerCount}/15</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 text-gray-500 group-hover/card:text-premium-gold transition-colors">
                              <ArrowUpRight size={18} />
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4">
                            <TrendingUp className="text-gray-600" size={32} />
                          </div>
                          <p className="text-sm text-gray-500 italic">Waiting for teams to join the arena...</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Success Rate</div>
                <div className="text-xl font-black font-mono text-premium-gold">
                  {stats.totalPlayers > 0 ? Math.round((stats.soldPlayers / (stats.soldPlayers + stats.unsoldPlayers)) * 100) : 0}%
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Cards */}
        <div className="w-full grid md:grid-cols-3 gap-6 mt-20">
          {[
            {
              title: "PLAYER",
              desc: "Verify your status and team allocation.",
              icon: User,
              link: "/player-login",
              regLink: "/player-registration",
              hoverBorder: "hover:border-premium-gold/50"
            },
            {
              title: "CAPTAIN",
              desc: "Enter the war room and build your squad.",
              icon: Crown,
              link: "/captain-login",
              regLink: "/captain-register",
              hoverBorder: "hover:border-blue-500/50"
            },
            {
              title: "ADMIN",
              desc: "Manage rules, teams and player database.",
              icon: Shield,
              link: "/admin-login",
              regLink: "/admin-register",
              hoverBorder: "hover:border-red-500/50"
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              className={`glass-panel p-8 group border-b-2 border-transparent ${card.hoverBorder} transition-all duration-500 flex flex-col`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-premium-gold/10 group-hover:border-premium-gold/50 transition-all duration-500">
                  <card.icon size={28} className="text-gray-400 group-hover:text-premium-gold transition-colors" />
                </div>
                <div className="text-[10px] font-black tracking-widest text-gray-600 group-hover:text-premium-gold transition-colors">OPERATIONS</div>
              </div>
              <h3 className="text-2xl font-black italic text-white mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-12 flex-grow">{card.desc}</p>

              <div className="space-y-4">
                <Link to={card.link} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all group/btn">
                  SECURE LOGIN <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link to={card.regLink} className="block text-center text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
                  NEW REGISTRATION
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="relative z-10 w-full p-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
          &copy; 2026 Gulties South Indian Cricket League. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
