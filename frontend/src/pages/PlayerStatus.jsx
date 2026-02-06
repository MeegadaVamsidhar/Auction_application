import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  LogOut,
  Trophy,
  TrendingUp,
  Activity,
  Shield,
  ChevronRight,
  Target,
  Clock,
  Zap,
  Star
} from "lucide-react";
import io from "socket.io-client";

import API_URL from "../config";

const PlayerStatus = () => {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveAuction, setLiveAuction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPlayer = localStorage.getItem("currentPlayer");
    if (!storedPlayer) {
      navigate("/player-login");
      return;
    }

    const player = JSON.parse(storedPlayer);

    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/players/status/mobile/${player.mobile}`,
        );
        setPlayerData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStatus();

    const socket = io(API_URL);

    socket.on("auctionUpdate", (data) => {
      if (data.isActive && data.currentPlayer?.name === player.name) {
        setLiveAuction(data);
      } else {
        setLiveAuction(null);
      }
    });

    socket.on("playerSold", (data) => {
      if (data.player.name === player.name) {
        setPlayerData(data.player);
        setLiveAuction(null);
      }
    });

    return () => socket.disconnect();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentPlayer");
    navigate("/player-login");
  };

  const formatPrice = (value) => {
    if (!value && value !== 0) return "₹0 L";
    if (value >= 100) {
      return `₹${(value / 100).toFixed(2)} Cr`;
    }
    return `₹${value} L`;
  };

  if (loading)
    return (
      <div className="min-h-screen bg-premium-dark flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-premium-gold animate-pulse">Synchronizing Bio-Data...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-premium-dark text-white font-sans selection:bg-premium-gold/30 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-b from-premium-gold/[0.05] to-transparent"></div>
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-premium-gold/[0.03] rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/[0.03] rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-24">
        {/* Top Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center group-hover:border-premium-gold/30 transition-all">
              <Trophy size={18} className="text-premium-gold" />
            </div>
            <span className="text-sm font-black italic tracking-tighter uppercase group-hover:text-premium-gold transition-colors">GULTI <span className="text-premium-gold">2K26</span></span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 bg-red-500/5 border border-red-500/20 rounded-xl hover:bg-red-500/10 hover:border-red-500/40 transition-all group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Deauthorize Session</span>
            <LogOut size={16} className="text-red-500 group-hover:translate-x-1 transition-transform" />
          </button>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Dossier Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-12"
          >
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
              <div className="space-y-4">
                <span className="badge-gold">Draft Status Portfolio</span>
                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
                  {playerData?.name.split(' ')[0]} <br />
                  <span className="shimmer-text">{playerData?.name.split(' ').slice(1).join(' ') || "UNNAMED"}</span>
                </h1>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-lg">
                    <Shield size={14} className="text-premium-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{playerData?.role}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-lg">
                    <Target size={14} className="text-premium-gold" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{playerData?.dept} | {playerData?.year}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <div className={`p-8 rounded-3xl border backdrop-blur-xl flex flex-col items-center md:items-end gap-2 text-center md:text-right shadow-2xl ${playerData?.status === 'sold' ? 'bg-green-500/5 border-green-500/20' :
                    playerData?.status === 'unsold' ? 'bg-red-500/5 border-red-500/20' :
                      'bg-premium-gold/5 border-premium-gold/20'
                  }`}>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Current Market Position</p>
                  <h2 className={`text-4xl font-black italic uppercase tracking-tighter ${playerData?.status === 'sold' ? 'text-green-500' :
                      playerData?.status === 'unsold' ? 'text-red-500' :
                        'text-premium-gold'
                    }`}>
                    {playerData?.status}
                  </h2>
                  {playerData?.status === 'pending' && <p className="text-[9px] text-gray-600 font-bold uppercase mt-2">Awaiting Admin Verification</p>}
                </div>
              </div>
            </div>

            {/* Live Auction Broadcast Feed */}
            <AnimatePresence>
              {liveAuction && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="mb-12 glass-panel p-1 bg-gradient-to-r from-premium-gold to-yellow-600 overflow-hidden shadow-2xl shadow-premium-gold/20"
                >
                  <div className="bg-black rounded-[calc(1rem-1px)] p-6 md:p-10 relative">
                    <div className="absolute top-0 right-0 p-4">
                      <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Live Floor</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                      <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">YOU ARE ON THE <span className="text-premium-gold">STAGE</span></h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest max-w-sm">Every franchise is currently evaluating your profile. Eyes are on you.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-12 bg-white/[0.03] p-8 rounded-2xl border border-white/5 flex-1 max-w-lg">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Internal Value</p>
                          <p className="text-3xl font-black italic font-mono text-white">{formatPrice(playerData?.basePrice)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-premium-gold uppercase tracking-widest mb-2">Current Bid</p>
                          <p className="text-3xl font-black italic font-mono shimmer-text">
                            {formatPrice(liveAuction.highestBid === 0 ? liveAuction.currentPlayer?.basePrice : liveAuction.highestBid)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center md:justify-start items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                      <Zap size={14} className="text-premium-gold" />
                      {liveAuction.highestBidderName
                        ? `Front Runner: ${liveAuction.highestBidderName}`
                        : "Scanning for franchise interest..."}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stat Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Valuation Card */}
              <div className="glass-panel p-8 space-y-4">
                <div className="flex justify-between items-center text-gray-500">
                  <Wallet size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Financials</span>
                </div>
                <div>
                  <p className="text-4xl font-black italic font-mono text-white mb-1">
                    {playerData?.status === 'sold' ? formatPrice(playerData?.soldPrice) : formatPrice(playerData?.basePrice)}
                  </p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                    {playerData?.status === 'sold' ? 'Settlement Price' : 'Opening Valuation'}
                  </p>
                </div>
              </div>

              {/* Operational Data */}
              <div className="glass-panel p-8 space-y-4">
                <div className="flex justify-between items-center text-gray-500">
                  <Activity size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Analytics</span>
                </div>
                <div>
                  <p className="text-4xl font-black italic text-white mb-1 uppercase tracking-tighter">
                    {playerData?.role.split(' ')[0]}
                  </p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Primary Discipline</p>
                </div>
              </div>

              {/* Franchise Card */}
              <div className={`glass-panel p-8 space-y-4 transition-all duration-500 ${playerData?.status === 'sold' ? 'border-premium-gold/30 bg-premium-gold/[0.02]' : ''}`}>
                <div className="flex justify-between items-center text-gray-500">
                  <Star size={20} className={playerData?.status === 'sold' ? 'text-premium-gold' : ''} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Franchise</span>
                </div>
                <div>
                  <p className={`text-2xl md:text-3xl font-black italic text-white mb-1 uppercase tracking-tighter ${playerData?.status === 'sold' ? 'shimmer-text' : 'opacity-30'}`}>
                    {playerData?.team?.name || "UNASSIGNED"}
                  </p>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Active Assignment</p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-center">
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">Official Draft Record | Authentication ID: {playerData?._id.slice(-8).toUpperCase()}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;
