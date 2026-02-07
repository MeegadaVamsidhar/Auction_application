import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowLeft, Phone, Shield, ChevronRight, AlertCircle, Activity, User, Star } from "lucide-react";
import API_URL from "../config";

const PlayerLogin = () => {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/players/login`, { mobile });
      if (res.data && res.data.player) {
        localStorage.setItem("currentPlayer", JSON.stringify(res.data.player));
        navigate("/player");
      }
    } catch (err) {
      setError("DOCKET_NOT_FOUND: MOBILE_NOT_REGISTERED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark flex overflow-hidden font-sans">
      {/* Cinematic Background Layer */}
      <div className="cinematic-bg fixed z-0">
        <div className="cinematic-glow w-[800px] h-[800px] -top-96 -right-96 bg-premium-gold/10"></div>
        <div className="cinematic-glow w-[600px] h-[600px] bottom-0 left-0 bg-blue-600/5"></div>
        <div className="cinematic-bg modern-grid opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-premium-dark via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]"></div>
      </div>

      {/* Side Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 p-12 flex-col justify-between border-r border-white/5 bg-black/20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-premium-gold rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-premium-gold/30">
            <Star className="text-black" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">
              Gulties <span className="text-premium-gold">PLAYER</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.4em] text-gray-500 uppercase">Athlete Performance Network</p>
          </div>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="badge-gold">Operational Status Check</span>
            <h2 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
              TRACK YOUR <br />
              <span className="text-premium-gold shimmer-text">AUCTION</span> <br />
              DYNAMISM.
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed font-light">
              Access your personal athlete dashboard to monitor your verification status, market valuation, and squad enlistment.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Network Status</p>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-premium-gold animate-pulse"></div>
                <span className="text-xs font-black text-white italic">LIVE_FEED</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Verification Tier</p>
              <p className="text-xs font-black text-white italic">PLAYER_v.AUTH</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">
          ATHLETE_ACCESS_POINT_2026
        </div>
      </div>

      {/* Auth Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-panel w-full max-w-md p-8 md:p-12 relative overflow-hidden group shadow-2xl border-white/5 bg-black/40"
        >
          <div className="mb-12 space-y-2">
            <Link to="/" className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em] mb-6">
              <ArrowLeft size={12} /> Portal Home
            </Link>
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">ATHLETE <span className="text-premium-gold">LOGIN</span></h3>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Verify Operational Mobile Link</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">MEMBER_TELEMETRY (MOBILE)</label>
                <div className="relative group/input">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-premium-gold transition-colors" size={18} />
                  <input
                    required
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-premium-gold/50 font-mono tracking-widest"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold !py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] disabled:opacity-50 active:scale-95 group/btn"
            >
              <span className="text-sm font-black tracking-[0.2em] uppercase text-black">{isLoading ? "VERIFYING..." : "ENTER ARENA"}</span>
              {!isLoading && <ChevronRight size={18} className="text-black group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="flex flex-col gap-4 mt-12 pt-12 border-t border-white/5">
              <Link to="/player-registration" className="text-center text-[10px] font-black text-gray-500 hover:text-premium-gold transition-colors uppercase tracking-widest italic">
                New Prospect? Initialize Athlete Profile
              </Link>
              <div className="flex justify-center items-center gap-4 opacity-30">
                <div className="h-px w-8 bg-gray-800"></div>
                <Activity size={14} className="text-gray-800" />
                <div className="h-px w-8 bg-gray-800"></div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PlayerLogin;
