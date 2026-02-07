import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Key, Phone, ArrowLeft, ChevronRight, AlertCircle, Activity, Crown, Mail, ShieldCheck } from "lucide-react";
import API_URL from "../config";

const CaptainRegister = () => {
  const [formData, setFormData] = useState({
    captainName: "",
    mobile: "",
    email: "",
    password: "",
    teamName: "",
    role: "captain",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("Operational Profile Initialized. Welcome to the League.");
      navigate("/captain-login");
    } catch (err) {
      setError(err.response?.data?.error || "PROTOCOL_ERROR: INITIALIZATION_FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark flex overflow-hidden font-sans">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-premium-gold/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* Side Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 p-12 flex-col justify-between border-r border-white/5 bg-black/20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/30">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">
              Gulties <span className="text-blue-500">CAPTAIN</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.4em] text-gray-500 uppercase">Strategic Recruitment Terminal</p>
          </div>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="badge-gold !bg-blue-500/10 !text-blue-500 !border-blue-500/20">Official Franchise Registration</span>
            <h2 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
              BUILD THY <br />
              <span className="text-blue-500 shimmer-text">CHAMPION</span> <br />
              LEGACY.
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed font-light">
              Register your team name and operational credentials to participate in the upcoming draft cycle.
            </p>
          </motion.div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-600 group-hover:text-blue-500 transition-all">
                <Activity size={18} />
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">Real-time market <br />synchronization active</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">
          FRANCHISE_ENROLLMENT_2026
        </div>
      </div>

      {/* Register Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10 overflow-y-auto custom-scrollbar">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-panel w-full max-w-md p-8 md:p-12 relative overflow-hidden group shadow-2xl border-white/5 bg-black/40 my-10"
        >
          <div className="mb-10 space-y-2">
            <Link to="/captain-login" className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em] mb-6">
              <ArrowLeft size={12} /> Back to Login
            </Link>
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">ENROLL <span className="text-blue-500">FRANCHISE</span></h3>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Initialize Strategic Dossier</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">CAPTAIN_NAME</label>
                <div className="relative group/input">
                  <Crown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.captainName}
                    onChange={(e) => setFormData({ ...formData, captainName: e.target.value })}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-blue-500/50 !text-white"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">TEAM_IDENTIFIER</label>
                <div className="relative group/input">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-blue-500/50 !text-blue-400 font-black italic"
                    placeholder="E.G. TITANS XI"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">CAPTAIN_IDENTIFIER (MOBILE)</label>
                  <div className="relative group/input">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                    <input
                      required
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-blue-500/50 font-mono"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">SECURE_CHANNEL (EMAIL)</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-blue-500/50"
                      placeholder="captain@league.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">SECURE_PASSCODE</label>
                <div className="relative group/input">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-blue-500/50"
                    placeholder="••••••••"
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
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white !py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] disabled:opacity-50 active:scale-95 group/btn mt-4"
            >
              <span className="text-xs font-black tracking-[0.2em] uppercase">{isLoading ? "REGISTERING..." : "COMMIT REGISTRATION"}</span>
              {!isLoading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CaptainRegister;
