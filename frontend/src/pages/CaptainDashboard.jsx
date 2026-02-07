import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import {
  Trophy,
  Wallet,
  Users,
  Zap,
  Activity,
  LogOut,
  ChevronRight,
  Shield,
  TrendingUp,
  Clock,
  Layout,
  User as UserIcon,
  AlertCircle,
  Target,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import API_URL from "../config";

const CaptainDashboard = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveAuction, setLiveAuction] = useState(null);
  const [nextBidAmount, setNextBidAmount] = useState(0);
  const socketRef = useRef(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatPrice = (value) => {
    if (!value && value !== 0) return "₹0 L";
    if (value >= 100) {
      return `₹${(value / 100).toFixed(2)} Cr`;
    }
    return `₹${value} L`;
  };

  const fetchTeamData = async () => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        setError("No user session found. Please login.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      let teamInfo = null;

      if (user.team) {
        try {
          const res = await axios.get(`${API_URL}/api/admin/teams/${user.team}`);
          teamInfo = res.data;
        } catch (e) {
          console.log("Team ID in session failed, trying fallback...");
        }
      }

      if (!teamInfo) {
        try {
          const res = await axios.get(`${API_URL}/api/admin/teams/captain/${user.id || user._id}`);
          teamInfo = res.data;
          if (teamInfo && teamInfo._id) {
            user.team = teamInfo._id;
            localStorage.setItem("user", JSON.stringify(user));
          }
        } catch (e) {
          console.error("Fallback finding failed", e);
        }
      }

      if (!teamInfo) {
        setError("No team linked to your account. Please register your team first.");
        setLoading(false);
        return;
      }

      if (teamInfo.status === "pending") {
        setError("Your Team Registration is pending Admin approval. Please check back later.");
        setLoading(false);
        return;
      } else if (teamInfo.status === "rejected") {
        setError("Your Team Registration has been rejected by the Admin.");
        setLoading(false);
        return;
      }

      setTeam(teamInfo);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching team data:", err);
      setError("Connection problem. Your account data might be stale.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
    socketRef.current = io(API_URL);

    socketRef.current.on("auctionUpdate", (data) => {
      if (data.isActive) {
        setLiveAuction(data);
        const currentVal = data.highestBid === 0 ? data.currentPlayer?.basePrice || 0 : data.highestBid;
        const calculatedBid = data.highestBid === 0 ? currentVal : currentVal + (data.bidIncreaseAmount || 5);
        setNextBidAmount(calculatedBid);
      } else {
        setLiveAuction(null);
      }
    });

    socketRef.current.on("playerSold", () => {
      fetchTeamData();
      setLiveAuction(null);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleBid = () => {
    if (team && team._id && socketRef.current && liveAuction) {
      socketRef.current.emit("placeBid", {
        teamId: team._id,
        bidAmount: nextBidAmount,
      });
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to exit the war room?")) {
      localStorage.clear();
      navigate("/captain-login");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-premium-dark flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 animate-pulse">Initializing War Room...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-premium-dark flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-10 max-w-md w-full border-red-500/20">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white text-center mb-4">ACCESS DENIED</h2>
          <p className="text-gray-500 text-sm text-center mb-8">{error}</p>
          <div className="space-y-3">
            {error.includes("No team linked") ? (
              <button onClick={() => navigate("/team-registration")} className="w-full btn-premium !border-blue-500/30 hover:!border-blue-400 !text-blue-400 py-4">REGISTER FRANCHISE</button>
            ) : (
              <button onClick={() => { localStorage.clear(); navigate("/captain-login"); }} className="w-full btn-premium py-4">RETURN TO PORTAL</button>
            )}
          </div>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-premium-dark text-white font-sans selection:bg-blue-500/30">
      {/* Cinematic Background Layer */}
      <div className="cinematic-bg fixed z-0">
        <div className="cinematic-glow w-[900px] h-[900px] -top-64 -left-64 bg-premium-accent/15"></div>
        <div className="cinematic-glow w-[700px] h-[700px] bottom-0 right-0 bg-premium-gold/5"></div>
        <div className="cinematic-bg modern-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-premium-dark via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-[1600px] mx-auto flex flex-col gap-6">
        {/* Top Header */}
        <header className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/10">
              <Shield size={24} className="text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none"><span className="text-blue-400">{team.name}</span> OPS</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Protocol Active</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end px-6 border-r border-white/5">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Squad Strength</p>
              <p className="text-xl font-black italic tracking-tighter text-white">{team.players?.length || 0} <span className="text-xs text-gray-600 font-bold not-italic">/ {team.maxPlayers || 15}</span></p>
            </div>
            <div className="hidden md:flex flex-col items-end px-6">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 text-right">Available Purse</p>
              <p className="text-xl font-black italic tracking-tighter text-blue-400 underline underline-offset-4 decoration-blue-500/30">{formatPrice(team.remainingPurse)}</p>
            </div>
            <button onClick={handleLogout} className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-red-500 hover:bg-red-500/10 hover:border-red-500/40 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left: Squad & Strategy */}
          <aside className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <div className="glass-panel p-6 border-blue-500/20">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-400" />
                  <h3 className="text-sm font-black italic uppercase tracking-widest">DRAFTED SQUAD</h3>
                </div>
                <Link to="/squads" className="text-[9px] font-black uppercase text-gray-500 hover:text-white transition-colors">Global Intel</Link>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {team.players && team.players.length > 0 ? (
                  team.players.map((player) => (
                    <div key={player._id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/20 group transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase">{player.name}</p>
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{player.role}</p>
                        </div>
                        <p className="text-xs font-black italic text-blue-400 font-mono">{formatPrice(player.soldPrice)}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <div className="text-center">
                          <p className="text-[8px] font-black text-gray-600 uppercase">RUNS</p>
                          <p className="text-[10px] font-bold text-white font-mono">{player.stats?.runs || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-gray-600 uppercase">WKT</p>
                          <p className="text-[10px] font-bold text-white font-mono">{player.stats?.wickets || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-gray-600 uppercase">MATCH</p>
                          <p className="text-[10px] font-bold text-white font-mono">{player.stats?.matches || 0}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center opacity-30">
                    <Users size={40} className="mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">No Drafts Secured</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Center & Right: War Room Floor */}
          <main className="lg:col-span-9 order-1 lg:order-2 space-y-6">
            <AnimatePresence mode="wait">
              {liveAuction ? (
                <motion.div
                  key="active-auction"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid lg:grid-cols-2 gap-6"
                >
                  {/* Player Profile & Controls */}
                  <div className="glass-panel p-8 relative overflow-hidden border-blue-500/30 bg-blue-500/[0.02]">
                    <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-blue-500 px-4 py-1.5 rounded-full shadow-2xl shadow-blue-500/50">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">ENGAGED</span>
                      </div>
                      <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                        <Clock size={12} className="text-blue-400" />
                        <span className="text-[10px] font-black italic text-white font-mono">{liveAuction.timer}s SECODS LEFT</span>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-10">
                        <div className="w-36 h-36 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group relative">
                          <span className="text-7xl font-black italic text-blue-400 group-hover:scale-110 transition-transform duration-700">
                            {liveAuction.currentPlayer?.name.charAt(0)}
                          </span>
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-400/40 animate-scan"></div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                              <Shield size={10} /> TARGET_ALPHA
                            </span>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase leading-none shimmer-text">{liveAuction.currentPlayer?.name}</h2>
                          <div className="flex items-center gap-5 pt-1">
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                              <Target size={12} className="text-blue-500/40" /> {liveAuction.currentPlayer?.role}
                            </p>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20"></div>
                            <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] italic">{liveAuction.currentPlayer?.dept}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-12 py-10 border-y border-white/5 bg-white/[0.01] rounded-[40px] px-10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="space-y-3 relative z-10 border-r border-white/5 pr-4">
                          <p className="text-[11px] font-black uppercase text-gray-700 tracking-[0.3em] font-mono italic">BASE_VALUATION</p>
                          <p className="text-3xl font-black italic font-mono text-gray-500 tabular-nums tracking-tighter">{formatPrice(liveAuction.currentPlayer?.basePrice)}</p>
                        </div>
                        <div className="space-y-3 text-right relative z-10">
                          <p className="text-[11px] font-black uppercase text-blue-400 tracking-[0.3em] font-mono italic">PEAK_BID_SIGNATURE</p>
                          <p className="text-4xl font-black italic font-mono text-blue-400 tabular-nums shimmer-text tracking-tighter leading-none">{formatPrice(liveAuction.highestBid || 0)}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="px-6 space-y-3 py-2">
                          <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                            <p className="text-[11px] font-black text-blue-400/50 uppercase tracking-[0.5em] italic">COMMANDER_IDENT</p>
                          </div>
                          <p className="text-3xl font-black italic text-white uppercase tracking-tighter shimmer-text leading-none">
                            {liveAuction.highestBidderName || "SIGNAL_PENDING..."}
                          </p>
                        </div>

                        <button
                          onClick={handleBid}
                          disabled={team.remainingPurse < nextBidAmount}
                          className={`w-full py-6 rounded-2xl flex items-center justify-center gap-4 group transition-all ${team.remainingPurse < nextBidAmount
                            ? 'bg-gray-800/50 cursor-not-allowed border border-white/5 text-gray-600'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/30'
                            }`}
                        >
                          <Zap size={20} className={team.remainingPurse < nextBidAmount ? 'text-gray-700' : 'fill-current'} />
                          <span className="text-lg font-black italic tracking-widest uppercase">
                            {team.remainingPurse < nextBidAmount ? "CAPACITY EXCEEDED" : `CONFIRM ${formatPrice(nextBidAmount)}`}
                          </span>
                          {!(team.remainingPurse < nextBidAmount) && <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                        {team.remainingPurse < nextBidAmount && (
                          <p className="text-[10px] text-center text-red-500 font-black uppercase tracking-widest">Liquidity Alert: Insufficient Franchise Funds</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bid History Feed */}
                  <div className="glass-panel flex flex-col h-[650px] border-white/5 bg-black/40">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
                      <Activity size={18} className="text-blue-400" />
                      <h3 className="text-sm font-black italic uppercase tracking-widest">TRANSACTION FEED</h3>
                    </div>
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
                      <AnimatePresence>
                        {liveAuction.bidHistory && liveAuction.bidHistory.length > 0 ? (
                          [...liveAuction.bidHistory].reverse().map((log, idx) => (
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={idx}
                              className={`flex justify-between items-center p-3 rounded-xl border ${log.teamName === team.name ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white/[0.02] border-white/5'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${log.teamName === team.name ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                                <span className={`text-xs font-black uppercase tracking-widest ${log.teamName === team.name ? 'text-blue-400' : 'text-gray-400'}`}>
                                  {log.teamName === team.name ? "YOUR FRANCHISE" : log.teamName}
                                </span>
                              </div>
                              <span className="text-sm font-black italic font-mono text-white">{formatPrice(log.amount)}</span>
                            </motion.div>
                          ))
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4 py-20">
                            <TrendingUp size={40} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Waiting for Opening Protocol</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle-auction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-panel p-24 flex flex-col items-center justify-center text-center space-y-8 border-dashed border-2 border-white/10"
                >
                  <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-2xl">
                    <Clock size={40} className="text-gray-700 animate-pulse" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-500">STANDBY MODE <span className="text-blue-400/30">|</span> NO ACTIVE AUCTION</h2>
                    <p className="text-sm text-gray-600 uppercase tracking-widest max-w-sm">The floor is currently closed. Monitor your assets and strategy while the administrator prepares the next prospect.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-500/5 px-6 py-2 rounded-full border border-blue-500/10">
                    <p className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest italic">Awaiting Next Sequence...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 space-y-4">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <Wallet size={12} className="text-blue-400" /> FINANCIAL CAPACITY
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-black italic text-white font-mono">{formatPrice(team.remainingPurse)}</p>
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{((team.remainingPurse / team.initialPurse) * 100).toFixed(1)}% LEFT</p>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(team.remainingPurse / team.initialPurse) * 100}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 space-y-4">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <Layout size={12} className="text-blue-400" /> SQUAD ALLOCATION
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-black italic text-white">{team.players?.length || 0} SECURED</p>
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{(team.maxPlayers || 15) - (team.players?.length || 0)} SLOTS</p>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((team.players?.length || 0) / (team.maxPlayers || 15)) * 100}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 space-y-4 border-blue-500/20 bg-blue-500/[0.02]">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={12} className="text-blue-400" /> FRANCHISE IDENTITY
                </p>
                <div>
                  <p className="text-2xl font-black italic text-white uppercase tracking-tighter truncate">{team.name}</p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1 italic">Classification: Active Franchise</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CaptainDashboard;
