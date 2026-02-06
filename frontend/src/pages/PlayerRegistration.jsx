import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Phone,
  BookOpen,
  Briefcase,
  Trophy,
  ChevronRight,
  ArrowLeft,
  Activity,
  Star,
  Users,
  Target,
  FileText
} from "lucide-react";

import API_URL from "../config";

const PlayerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    previousTeams: "",
    year: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/players/register`, formData);
      alert("Registration submitted successfully! Your athlete profile is now pending verification.");
      navigate("/player-login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed. Verify your network link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark flex overflow-hidden font-sans">
      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-premium-gold/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* Side Brand Panel */}
      <div className="hidden lg:flex lg:w-2/5 relative z-10 p-12 flex-col justify-between border-r border-white/5 bg-black/20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-premium-gold rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-premium-gold/30">
            <Trophy className="text-black" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">
              Gulties <span className="text-premium-gold">DRAFT</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.4em] text-gray-500 uppercase">Athlete Enrollment Protocol</p>
          </div>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="badge-gold">Registry Protocol v2.6</span>
            <h2 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
              STEP INTO <br />
              <span className="text-premium-gold shimmer-text">THE ARENA</span> <br />
              HISTORY.
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed font-light">
              Submit your tactical data to be evaluated by the league's top franchises. This is your first step toward the championship.
            </p>
          </motion.div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-600 group-hover:text-premium-gold transition-all">
                <Users size={18} />
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">Direct visibility <br />to 10+ franchise scouts</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">
          OFFICIAL_REGISTRATION_PORTAL
        </div>
      </div>

      {/* Registration Form Panel */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-start p-6 lg:p-12 relative z-10 overflow-y-auto custom-scrollbar">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-panel w-full max-w-2xl p-8 md:p-12 relative overflow-hidden group shadow-2xl border-white/5 bg-black/40 my-auto"
        >
          <div className="mb-10 lg:mb-16 space-y-4">
            <Link to="/" className="flex lg:hidden items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em] mb-6">
              <ArrowLeft size={12} /> Back to Home
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter">ENLIST <span className="text-premium-gold">PROSPECT</span></h3>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Complete the operational docket below</p>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-xl">
                <Activity size={14} className="text-premium-gold" />
                <span className="text-[9px] font-black text-premium-gold uppercase tracking-widest animate-pulse">Live Draft Sync Active</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Form Sections */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Identity Section */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                    <User size={12} className="text-premium-gold/50" /> Athlete Identity
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="premium-input !bg-white/[0.02] !border-white/5 focus:!border-premium-gold/50"
                    placeholder="LEGAL FULL NAME"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                    <Phone size={12} className="text-premium-gold/50" /> Telemetry Link (Mobile)
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="premium-input !bg-white/[0.02] !border-white/5 focus:!border-premium-gold/50 font-mono"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              {/* Categorization Section */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                    <BookOpen size={12} className="text-premium-gold/50" /> Academic Cohort
                  </label>
                  <select
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="premium-input !bg-white/[0.02] !border-white/5 focus:!border-premium-gold/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-premium-dark">SELECT YEAR</option>
                    {["1ST YEAR", "2ND YEAR", "3RD YEAR", "4TH YEAR", "MTECH"].map(yr => (
                      <option key={yr} value={yr} className="bg-premium-dark">{yr}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                    <Target size={12} className="text-premium-gold/50" /> Tactical Discipline
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="premium-input !bg-white/[0.02] !border-white/5 focus:!border-premium-gold/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-premium-dark">SELECT ROLE</option>
                    {["BATSMAN", "BOWLER", "ALLROUNDER", "WICKETKEEPER"].map(r => (
                      <option key={r} value={r} className="bg-premium-dark">{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                <FileText size={12} className="text-premium-gold/50" /> Historical Performance Narrative
              </label>
              <textarea
                required
                rows="3"
                value={formData.previousTeams}
                onChange={(e) => setFormData({ ...formData, previousTeams: e.target.value })}
                className="premium-input !bg-white/[0.02] !border-white/5 focus:!border-premium-gold/50 resize-none !py-4"
                placeholder="DESCRIBE YOUR PREVIOUS FRANCHISES, TOURNAMENTS, AND ACHIEVEMENTS..."
              />
              <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest italic ml-1">Historical verification system active. Specify "NEW_ENTRY" if no history exists.</p>
            </div>

            {/* Action Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-3/5 btn-gold !py-5 rounded-2xl flex items-center justify-center gap-4 transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] disabled:opacity-50 group"
              >
                <span className="text-sm font-black tracking-[0.2em] uppercase text-black">
                  {loading ? "INITIALIZING..." : "COMMIT ENLISTMENT"}
                </span>
                {!loading && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform text-black" />}
              </button>

              <div className="flex flex-col gap-1 items-center md:items-start opacity-30">
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-premium-gold" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">Elite Verification</span>
                </div>
                <p className="text-[8px] font-bold uppercase text-gray-500">Authorized GULTI 2K26 Node</p>
              </div>
            </div>
          </form>

          {/* Hidden Link for Desktop back button */}
          <div className="hidden lg:block absolute bottom-0 left-0 p-8">
            <Link to="/" className="text-[10px] font-black text-gray-700 hover:text-white transition-colors uppercase tracking-[0.4em]">
              ← ABORT_PORTAL
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlayerRegistration;
