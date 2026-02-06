import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Key, User, ArrowLeft, ChevronRight, AlertCircle, Activity, Lock } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
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
      const user = await login(username, password);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        setError("AUTH_FAILURE: ACCESS_LEVEL_INSUFFICIENT");
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
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* Side Brand Panel - Tactical Style */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 p-12 flex-col justify-between border-r border-white/5 bg-black/20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-400/30">
            <Lock className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">
              Gulties <span className="text-red-500">ADMIN</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.4em] text-gray-500 uppercase">Secure Operations Layer (S.O.L)</p>
          </div>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="badge-gold !bg-red-500/10 !text-red-500 !border-red-500/20">Authorized Access Target</span>
            <h2 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
              COMMAND <br />
              <span className="text-red-500 shimmer-text">CENTRAL</span> <br />
              LOCKDOWN.
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed font-light">
              Initiate command protocols to manage franchises, player dossiers, and the tactical deployment grid.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Operational Status</p>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-black text-white italic">GUARDED_MODE</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Encryption Tier</p>
              <p className="text-xs font-black text-white italic">V.4_TACTICAL</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">
          CRYPTO_REGISTRY_G2K26
        </div>
      </div>

      {/* Auth Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-panel w-full max-w-md p-8 md:p-12 relative overflow-hidden group shadow-2xl border-white/5 bg-black/40"
        >
          <div className="absolute top-0 right-0 p-8 text-red-600 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
            <Shield size={160} />
          </div>

          <div className="mb-12 space-y-2">
            <Link to="/" className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em] mb-6">
              <ArrowLeft size={12} /> Portal Home
            </Link>
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">ADMIN <span className="text-red-500">AUTH</span></h3>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Provide Operational Credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">OPERATOR_ID</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-red-500 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-red-500/50"
                    placeholder="USERNAME"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">ACCESS_PASSKEY</label>
                <div className="relative group/input">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-red-500 transition-colors" size={18} />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-red-500/50"
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
              className="w-full bg-red-600 hover:bg-red-500 text-white !py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] disabled:opacity-50 active:scale-95 group/btn"
            >
              <span className="text-xs font-black tracking-[0.2em] uppercase">{isLoading ? "VERIFYING..." : "INITIALIZE LOGIN"}</span>
              {!isLoading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="flex flex-col gap-4 mt-12 pt-12 border-t border-white/5">
              <Link to="/admin-register" className="text-center text-[10px] font-black text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest italic">
                First time Admin? Create Operational Account
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

export default AdminLogin;
