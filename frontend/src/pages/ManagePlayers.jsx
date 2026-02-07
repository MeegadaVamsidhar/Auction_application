import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  Search,
  Edit3,
  Trash2,
  ChevronLeft,
  Filter,
  X,
  ShieldCheck,
  User,
  MoreVertical,
  Activity,
  ArrowRight,
  Database,
  Users,
  LayoutGrid,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import API_URL from "../config";

const ManagePlayers = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    role: "BATSMAN",
    dept: "N/A",
    year: "",
    basePrice: 5,
    status: "approved",
  });

  const formatPrice = (value) => {
    if (!value && value !== 0) return "₹0 L";
    if (value >= 100) {
      return `₹${(value / 100).toFixed(2)} Cr`;
    }
    return `₹${value} L`;
  };

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/players`);
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this player profile? This cannot be undone.")) {
      try {
        await axios.delete(`${API_URL}/api/admin/players/${id}`);
        fetchPlayers();
      } catch (err) {
        alert("Error deleting player");
      }
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      mobile: player.mobile,
      role: player.role,
      dept: player.dept,
      year: player.year,
      basePrice: player.basePrice,
      status: player.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlayer) {
        await axios.put(
          `${API_URL}/api/admin/players/${editingPlayer._id}`,
          formData,
        );
      } else {
        await axios.post(`${API_URL}/api/admin/players/register`, formData);
      }
      setShowModal(false);
      setEditingPlayer(null);
      setFormData({
        name: "",
        mobile: "",
        role: "BATSMAN",
        dept: "N/A",
        year: "",
        basePrice: 5,
        status: "approved",
      });
      fetchPlayers();
    } catch (err) {
      alert(err.response?.data?.error || "Error saving player");
    }
  };

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-premium-dark text-white font-sans selection:bg-premium-gold/30 flex">
      {/* Cinematic Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.05) 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-premium-gold/[0.02] rounded-full blur-[150px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col">
        {/* Header - Sub-Command Style */}
        <header className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="p-3 bg-white/5 hover:bg-premium-gold hover:text-black rounded-xl transition-all border border-white/10 hover:border-premium-gold/30 group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-premium-gold/10 border border-premium-gold/20 rounded-2xl flex items-center justify-center shadow-2xl relative">
                <Database className="text-premium-gold" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                  PLAYER <span className="shimmer-text">DOSSIER</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-premium-gold animate-pulse"></div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Archive Active • {players.length} Entities</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 pr-6 border-r border-white/5">
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Global Status</p>
                <p className="text-xs font-bold text-green-500 italic">SYSTEM OPTIMIZED</p>
              </div>
              <Activity size={16} className="text-green-500" />
            </div>
            <button
              onClick={() => {
                setEditingPlayer(null);
                setFormData({
                  name: "",
                  mobile: "",
                  role: "BATSMAN",
                  dept: "N/A",
                  year: "",
                  basePrice: 5,
                  status: "approved",
                });
                setShowModal(true);
              }}
              className="bg-premium-gold hover:bg-premium-gold-light text-black px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              <UserPlus size={18} />
              Enlist Prospect
            </button>
          </div>
        </header>

        <main className="p-8 lg:p-12 space-y-10 flex-1">
          {/* Dashboard Intelligence Filter */}
          <div className="glass-panel p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group border-white/10">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-premium-gold transition-colors" />
              <input
                type="text"
                placeholder="Search Archive by Name, Role, or Department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-sm outline-none focus:border-premium-gold/40 transition-all font-medium placeholder:text-gray-700"
              />
            </div>
            <div className="flex gap-4">
              <button className="px-8 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all text-gray-400 hover:text-white">
                <Filter size={18} /> Filter Protocol
              </button>
              <div className="w-14 items-center justify-center flex bg-white/5 border border-white/5 rounded-2xl text-gray-600 hover:text-premium-gold cursor-pointer transition-colors">
                <LayoutGrid size={20} />
              </div>
            </div>
            {/* Ambient line glow */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-premium-gold/20 to-transparent"></div>
          </div>

          {/* Records Layout */}
          <div className="glass-panel overflow-hidden border border-white/5 shadow-2xl relative">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">IDENTIFIER</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">SPECIALIZATION</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">OPERATIONAL ORIGIN</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">VALUATION SIGNATURE</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">REGISTRY STATE</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic text-right">PROTOCOLS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={player._id}
                        className="group hover:bg-white/[0.02] transition-colors relative"
                      >
                        <td className="p-8">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-black text-premium-gold italic text-xl group-hover:border-premium-gold/40 transition-all relative overflow-hidden">
                              <span className="relative z-10">{player.name.charAt(0)}</span>
                              <div className="absolute inset-0 bg-premium-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div>
                              <p className="text-[15px] font-black italic text-white group-hover:text-premium-gold transition-colors tracking-tight uppercase">{player.name}</p>
                              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                <FileText size={10} /> CONTACT-SIG: {player.mobile}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <span className="px-4 py-2 bg-premium-gold/5 text-premium-gold border border-premium-gold/20 rounded-xl text-[10px] font-black tracking-widest uppercase italic">
                            {player.role}
                          </span>
                        </td>
                        <td className="p-8">
                          <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] italic">{player.dept}</div>
                          <div className="text-[9px] text-gray-600 font-bold mt-2 uppercase flex items-center gap-2">
                            <div className="w-3 h-[1px] bg-white/10"></div> BATCH {player.year}
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="space-y-1">
                            <p className="text-xl font-black tabular-nums font-mono text-white tracking-tighter shimmer-text">{formatPrice(player.basePrice)}</p>
                            <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest italic">Asset Base Value</p>
                          </div>
                        </td>
                        <td className="p-8">
                          <span className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border flex items-center gap-3 w-fit tracking-widest ${player.status === 'sold' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            player.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              player.status === 'approved' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                'bg-white/5 text-gray-500 border-white/10'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${player.status === 'sold' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                              player.status === 'rejected' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                player.status === 'approved' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                                  'bg-gray-500'
                              }`}></div>
                            {player.status}
                          </span>
                        </td>
                        <td className="p-8 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleEdit(player)}
                              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-premium-gold hover:border-premium-gold/30 hover:bg-premium-gold/5 transition-all flex items-center justify-center group/btn"
                              title="Update Records"
                            >
                              <Edit3 size={16} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleDelete(player._id)}
                              className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all flex items-center justify-center group/btn"
                              title="Decommission Entry"
                            >
                              <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-32 text-center">
                        <div className="flex flex-col items-center gap-6 opacity-30">
                          <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                            <Search size={32} className="text-gray-700" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">NO SIGNAL DETECTED</p>
                            <p className="text-xs text-gray-700 font-bold italic uppercase tracking-widest">Adjust filtering parameters or initialize new prospect enlistment</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Subtle glow edges */}
            <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
          </div>
        </main>

        <footer className="p-10 border-t border-white/5 text-center flex flex-col items-center gap-6">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-premium-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]"></div>
              <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">SECURE COMMS v2.6.4</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">NEURAL LINK SYNCED</span>
            </div>
          </div>
          <p className="text-[9px] font-black text-gray-800 uppercase tracking-[1em] italic">GULTI AUCTION INFRASTRUCTURE SYSTEMS</p>
        </footer>
      </div>

      {/* Advanced Configuration Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 30 }}
              className="glass-panel w-full max-w-3xl relative z-10 overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.1)] border border-white/10"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-premium-gold/10 border border-premium-gold/20 rounded-2xl flex items-center justify-center">
                    <Database className="text-premium-gold" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                      {editingPlayer ? "RECORD" : "INGESTION"} <span className="text-premium-gold">MATRIX</span>
                    </h2>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mt-1.5 italic">Configure Prospect Neural-Signature</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-white/[0.03] hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center border border-white/5">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">CANDIDATE IDENTITY</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="premium-input !bg-black/40"
                      placeholder="FULL NAME..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">COMMUNICATION UPLINK</label>
                    <input
                      required
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="premium-input !bg-black/40 font-mono"
                      placeholder="+91-000-0000-000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">SPECIALIZATION PROTOCOL</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="premium-input !bg-black/40 !py-4.5 appearance-none cursor-pointer focus:border-premium-gold"
                    >
                      <option value="Batsman" className="text-black">BATSMAN</option>
                      <option value="Bowler" className="text-black">BOWLER</option>
                      <option value="All-rounder" className="text-black">ALL-ROUNDER</option>
                      <option value="Wicket-keeper" className="text-black">WICKET-KEEPER</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">DYNAMO STATUS</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="premium-input !bg-black/40 !py-4.5 appearance-none cursor-pointer focus:border-premium-gold"
                    >
                      <option value="pending" className="text-black">PENDING PROTOCOL</option>
                      <option value="approved" className="text-black">AUTHORIZED</option>
                      <option value="rejected" className="text-black">VOIDED</option>
                      <option value="sold" className="text-black">CONCLUDED (SOLD)</option>
                      <option value="unsold" className="text-black">UNSOLD ARCHIVE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">ORIGIN COORDINATES (DEPT)</label>
                    <input
                      required
                      type="text"
                      value={formData.dept}
                      onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                      className="premium-input !bg-black/40"
                      placeholder="BRANCH / UNIT..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">DRAFT CHRONOLOGY (YEAR)</label>
                    <input
                      required
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="premium-input !bg-black/40 font-mono"
                      placeholder="202X"
                    />
                  </div>
                </div>

                <div className="space-y-6 p-8 bg-premium-gold/[0.03] border border-premium-gold/10 rounded-3xl">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-gold italic">AUCTION INITIAL VALUATION</label>
                    <span className="text-2xl font-black text-premium-gold font-mono tracking-tighter shimmer-text">{formatPrice(formData.basePrice)}</span>
                  </div>
                  <div className="relative pt-4">
                    <input
                      type="range"
                      min="5"
                      max="500"
                      step="5"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) })}
                      className="w-full accent-premium-gold bg-white/5 h-2 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-4 text-[9px] font-black text-gray-700 uppercase tracking-widest px-1">
                      <span>MIN: 5L</span>
                      <span>MAX: 5Cr</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/[0.08] transition-all text-gray-500 hover:text-white"
                  >
                    ABORT CONFIG
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-premium-gold hover:bg-premium-gold-light text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all flex items-center justify-center gap-3 group"
                  >
                    {editingPlayer ? "SYNCHRONIZE RECORD" : "INITIALIZE INGESTION"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePlayers;
