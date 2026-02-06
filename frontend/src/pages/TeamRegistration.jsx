import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ChevronRight,
  ArrowLeft,
  PieChart,
  Users,
  Lock,
  Zap,
  CheckCircle2,
  Clock
} from "lucide-react";

import API_URL from "../config";

const TeamRegistration = () => {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/captain-login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "captain") {
      navigate("/");
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_URL}/api/auth/create-team`, {
        userId: user.id || user._id,
        teamName,
      });

      alert("Franchise application submitted! Awaiting high-command authorization.");

      const statusRes = await axios.get(
        `${API_URL}/api/auth/captain-status/${user.id || user._id}`,
      );
      if (statusRes.data.hasTeam && statusRes.data.team) {
        user.team = statusRes.data.team._id;
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/captain");
    } catch (err) {
      setError(err.response?.data?.error || "Franchise authorization failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-premium-dark text-white font-sans selection:bg-blue-500/30 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cinematic Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/[0.05] rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.2) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: Tactical Guidance */}
        <div className="lg:col-span-5 hidden lg:block space-y-8">
          <div className="space-y-4">
            <Link to="/captain-login" className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Portal Abort
            </Link>
            <h1 className="text-6xl font-black italic tracking-tighter text-white leading-[0.85] uppercase">
              ESTABLISH <br />
              <span className="text-blue-500 underline underline-offset-8 decoration-blue-500/30">FRANCHISE</span> <br />
              IDENTITY.
            </h1>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Your franchise name is your brand in the arena. Choose wisely—this identity will be etched in the GULTI 2K26 hall of fame.
          </p>

          <div className="space-y-6 pt-8 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-center">
                <PieChart size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white tracking-widest text-blue-400">Purse Allocation</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Initial draft capital: ₹10,000L</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-center">
                <Users size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-white tracking-widest text-blue-400">Squad Strategy</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">Max capacity: 15 Elite Prospects</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Registration Console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-7 glass-panel p-8 md:p-16 shadow-2xl relative border-blue-500/20 bg-blue-500/[0.02]"
        >
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <span className="badge-gold !bg-blue-500/10 !text-blue-400 !border-blue-500/20">Franchise Protocol v1.0</span>
              <Shield size={20} className="text-blue-500/30" />
            </div>
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">SECURE <span className="text-blue-500">FRANCHISE</span> NAME</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden">
                <span className="text-[10px] font-black text-blue-400">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Captain Identified: <span className="text-white italic">{user.username}</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Operational Designation</label>
              <div className="relative group">
                <Shield className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" size={20} />
                <input
                  required
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={loading}
                  className="premium-input !pl-16 !py-5 text-xl font-black italic tracking-tighter"
                  placeholder="e.g. TITAN STRIKERS"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <p className="text-xs font-black uppercase text-red-500 tracking-widest">{error}</p>
              </motion.div>
            )}

            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-blue-400" />
                <p className="text-xs font-black uppercase tracking-widest text-blue-400">Authorization Cycle</p>
              </div>
              <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase">
                Upon submission, your franchise designation will enter the <span className="text-white italic">Admin Verification Queue</span>. Access to the Tactical Auction Dashboard will remain restricted until high-command approval.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium !border-blue-500/30 hover:!border-blue-400 !text-blue-400 !py-6 flex items-center justify-center gap-4 transition-all group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-400/20 border-t-blue-400 rounded-full animate-spin"></div>
                    <span className="text-sm font-black tracking-[0.2em] uppercase">INITIALIZING...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-black tracking-[0.2em] uppercase">COMMISSION FRANCHISE</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <Lock size={12} className="text-gray-700" />
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">ENCRYPTED PORTAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-gray-700" />
                  <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">INSTANT SYNC</span>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamRegistration;
