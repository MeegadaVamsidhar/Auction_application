import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Key, User, ArrowLeft, ChevronRight, AlertCircle, Activity, UserPlus, Fingerprint, Phone, Mail } from "lucide-react";
import API_URL from "../config";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    password: "",
    role: "admin",
    adminCode: "", // Key to verify admin creation
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
      alert("Admin registration successful! Please wait for approval from a system administrator.");
      navigate("/admin-login");
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
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* Side Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 p-12 flex-col justify-between border-r border-white/5 bg-black/20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-400/30">
            <UserPlus className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">
              Gulties <span className="text-red-500">ADMIN</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.4em] text-gray-500 uppercase">Recruitment & Oversight Layer</p>
          </div>
        </motion.div>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="badge-gold !bg-red-500/10 !text-red-500 !border-red-500/20">Registry Protocol Activated</span>
            <h2 className="text-7xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
              EXPAND OIL <br />
              <span className="text-red-500 shimmer-text">COMMAND</span> <br />
              NETWORK.
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed font-light">
              Register a new administrative identity. Requires high-level clearance and a valid sector authorization code.
            </p>
          </motion.div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-600 group-hover:text-red-500 group-hover:border-red-500/30 transition-all">
                <Fingerprint size={18} />
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">Multi-level biometric <br />verification active</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">
          SECURE_ENROLLMENT_v2.0
        </div>
      </div>

      {/* Register Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-panel w-full max-w-md p-8 md:p-12 relative overflow-hidden group shadow-2xl border-white/5 bg-black/40 my-10"
        >
          <div className="mb-12 space-y-2">
            <Link to="/admin-login" className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em] mb-6">
              <ArrowLeft size={12} /> Back to Login
            </Link>
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">ENROLL <span className="text-red-500">ADMIN</span></h3>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Initialization of Management Dossier</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">CHOSEN_CALLSIGN</label>
                <div className="relative group/input">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-red-500 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-red-500/50"
                    placeholder="USERNAME"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">MOBILE_IDENTIFIER</label>
                <div className="relative group/input">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-red-500 transition-colors" size={18} />
                  <input
                    required
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-red-500/50"
                    placeholder="MOBILE NUMBER"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">SECURE_EMAIL</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-red-500 transition-colors" size={18} />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-red-500/50"
                    placeholder="EMAIL@EXAMPLE.COM"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">ENCRYPTION_PASSKEY</label>
                <div className="relative group/input">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-red-500 transition-colors" size={18} />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/5 focus:!border-red-500/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">AUTHORIZATION_CODE (OPTIONAL)</label>
                <div className="relative group/input">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/50 group-focus-within/input:text-red-500 transition-colors" size={18} />
                  <input
                    type="password"
                    value={formData.adminCode}
                    onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                    className="premium-input !pl-12 !bg-white/[0.02] !border-white/10 focus:!border-red-500/50 !text-red-500"
                    placeholder="SECURE CODE"
                  />
                </div>
                <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest pl-2 italic">Consult HQ for system access codes</p>
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
              className="w-full bg-red-600 hover:bg-red-500 text-white !py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] disabled:opacity-50 active:scale-95 group/btn mt-4"
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

export default AdminRegister;
