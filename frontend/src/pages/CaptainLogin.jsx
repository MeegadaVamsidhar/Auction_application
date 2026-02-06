import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Key, Phone, ArrowLeft, ChevronRight, AlertCircle, Activity, Crown } from "lucide-react";

const CaptainLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const user = await login(mobile, password);
      if (user.role === "captain") {
        navigate("/captain");
      } else {
        setError("AUTH_FAILURE: ROLE_MISMATCH_EXPECTED_CAPTAIN");
      }
    } catch (err) {
      setError(err.response?.data?.error || "AUTH_FAILURE: INVALID_CREDENTIALS");
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
            <Crown className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">
              Gulties <span className="text-blue-500">CAPTAIN</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.4em] text-gray-500 uppercase">Strategic Leadership Portal</p>
          </div>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="badge-gold !bg-blue-500/10 !text-blue-500 !border-blue-500/20">Franchise Leadership Access</span>
            <h2 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
              LEAD YOUR <br />
              <span className="text-blue-500 shimmer-text">SQUAD TO</span> <br />
              GLORY.
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed font-light">
              Access your team dashboard, track budget allocations, and finalize your championship roster.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Operational Status</p>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs font-black text-white italic">STRATEGIC_READY</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">System Layer</p>
              <p className="text-xs font-black text-white italic">FRANCHISE_v1.2</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">
          CAPTAIN_TERMINAL_2026
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
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">CAPTAIN <span className="text-blue-500">LOGIN</span></h3>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Provide Operational Link (Mobile)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">REGISTERED_MOBILE</label>
                <div className="relative group/input">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                  <input
                    required
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-blue-500/50 font-mono"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">SECURE_PASSCODE</label>
                <div className="relative group/input">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-blue-500 transition-colors" size={18} />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white !py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_40px_rgba(37,99,235,0.3)] disabled:opacity-50 active:scale-95 group/btn"
            >
              <span className="text-sm font-black tracking-[0.2em] uppercase">{isLoading ? "SYNCING..." : "ENTER COMMAND CENTER"}</span>
              {!isLoading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="flex flex-col gap-4 mt-12 pt-12 border-t border-white/5">
              <Link to="/captain-register" className="text-center text-[10px] font-black text-gray-500 hover:text-blue-400 transition-colors uppercase tracking-widest italic">
                Awaiting Appointment? Register as Captain
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

export default CaptainLogin;
