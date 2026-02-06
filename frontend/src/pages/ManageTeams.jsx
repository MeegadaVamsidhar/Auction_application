import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  Users,
  Wallet,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  TrendingDown,
  Activity,
  ArrowRight,
  Database,
  Cpu,
  Fingerprint,
  Crown,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import API_URL from "../config";

const ManageTeams = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCaptainModal, setShowCaptainModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [playerSearch, setPlayerSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    initialPurse: 8000,
    status: "approved",
    captainName: "",
    captainMobile: "",
    captainEmail: "",
  });

  const formatPrice = (value) => {
    if (!value && value !== 0) return "₹0 L";
    if (value >= 100) {
      return `₹${(value / 100).toFixed(2)} Cr`;
    }
    return `₹${value} L`;
  };

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/teams`);
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    }
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
    fetchTeams();
    fetchPlayers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to decommission this franchise? All team data will be lost.")) {
      try {
        await axios.delete(`${API_URL}/api/admin/teams/${id}`);
        fetchTeams();
      } catch (err) {
        alert("Error deleting team");
      }
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      initialPurse: team.initialPurse,
      status: team.status,
      captainName: team.captain?.username || "",
      captainMobile: team.captain?.mobile || "",
      captainEmail: team.captain?.email || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        await axios.put(
          `${API_URL}/api/admin/teams/${editingTeam._id}`,
          formData,
        );
      } else {
        await axios.post(`${API_URL}/api/admin/teams`, formData);
      }
      setShowModal(false);
      setEditingTeam(null);
      setFormData({
        name: "",
        initialPurse: 8000,
        status: "approved",
        captainName: "",
        captainMobile: "",
        captainEmail: "",
      });
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.error || "Error saving team");
    }
  };

  const handleAssignCaptain = async (playerId) => {
    try {
      await axios.post(`${API_URL}/api/admin/assign-captain`, {
        playerId,
        teamId: selectedTeam._id,
      });
      setShowCaptainModal(false);
      setSelectedTeam(null);
      setPlayerSearch("");
      fetchTeams();
      alert("Captain assigned successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Error assigning captain");
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark text-white font-sans selection:bg-premium-gold/30 flex">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.05) 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-500/[0.02] rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-premium-gold/[0.02] rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col">
        <header className="px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="p-3 bg-white/5 hover:bg-blue-500 hover:text-white rounded-xl transition-all border border-white/10 hover:border-blue-500/30 group">
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-2xl relative">
                <Shield className="text-blue-400" size={24} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                  FRANCHISE <span className="text-blue-400 shimmer-text">REGISTRY</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Protocol Active • {teams.length} Squads Online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-8 pr-8 border-r border-white/5">
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">ALLOCATED CAPITAL</p>
                <p className="text-sm font-black text-premium-gold tabular-nums font-mono tracking-tighter shimmer-text">
                  {formatPrice(teams.reduce((acc, t) => acc + t.initialPurse, 0))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">AVG SQUAD SIZE</p>
                <p className="text-sm font-black text-blue-400 tabular-nums font-mono tracking-tighter">
                  {(teams.reduce((acc, t) => acc + (t.players?.length || 0), 0) / (teams.length || 1)).toFixed(1)}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingTeam(null);
                setFormData({
                  name: "",
                  initialPurse: 8000,
                  status: "approved",
                  captainName: "",
                  captainMobile: "",
                  captainEmail: "",
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.2)] border border-blue-400/30"
            >
              <Plus size={18} />
              Incorporate Unit
            </button>
          </div>
        </header>

        <main className="p-8 lg:p-12 space-y-10 flex-1">
          <div className="glass-panel overflow-hidden border border-white/5 shadow-2xl relative">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">UNIT IDENTITY</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">COMMANDER INFRA</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic text-center">ASSET DEPLOYMENT</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">FINANCIAL LIQUIDITY</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">INTEGRITY STATE</th>
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic text-right">PROTOCOLS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {teams.length > 0 ? (
                    teams.map((team) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={team._id}
                        className="group hover:bg-white/[0.02] transition-colors relative"
                      >
                        <td className="p-8">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-black text-blue-400 italic text-xl group-hover:border-blue-400/40 group-hover:scale-105 transition-all relative overflow-hidden">
                              <span className="relative z-10">{team.name.substring(0, 2).toUpperCase()}</span>
                              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div>
                              <p className="text-[16px] font-black italic text-white group-hover:text-blue-400 transition-colors tracking-tight uppercase">{team.name}</p>
                              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2 italic">
                                <Fingerprint size={10} /> UNIT-ID: {team._id.substring(0, 8).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase italic">
                              {(team.captain?.username || "??").charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-black text-white italic uppercase">{team.captain?.username || "PENDING ASSIGN"}</p>
                              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1.5 italic">Operational Captain</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-center">
                          <div className="inline-flex flex-col items-center">
                            <div className="flex items-center gap-3 mb-2">
                              <Users size={16} className="text-blue-500" />
                              <span className="text-lg font-black font-mono tracking-tighter">{team.players?.length || 0}</span>
                            </div>
                            <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(team.players?.length || 0) / 15 * 100}%` }}
                                className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                              />
                            </div>
                            <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest mt-2 italic shadow-text">Squad Load: {((team.players?.length || 0) / 15 * 100).toFixed(0)}%</p>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="space-y-3 max-w-[180px]">
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[16px] font-black font-mono text-premium-gold tracking-tighter shimmer-text">{formatPrice(team.remainingPurse)}</p>
                                <p className="text-[9px] text-gray-700 font-black uppercase italic tracking-widest mt-1">Liquidity Available</p>
                              </div>
                              <span className="text-[10px] font-mono font-black text-gray-600 mb-5">/ {formatPrice(team.initialPurse)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(team.remainingPurse / team.initialPurse) * 100}%` }}
                                className="h-full bg-gradient-to-r from-premium-gold/40 to-premium-gold"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <span className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border flex items-center gap-3 w-fit tracking-widest ${team.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            team.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }`}>
                            {team.status === 'approved' && <CheckCircle2 size={12} className="animate-pulse" />}
                            {team.status === 'rejected' && <AlertCircle size={12} />}
                            {team.status === 'pending' && <Clock size={12} className="animate-spin-slow" />}
                            {team.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-8 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => {
                                setSelectedTeam(team);
                                setShowCaptainModal(true);
                              }}
                              className="w-10 h-10 rounded-xl bg-premium-gold/5 border border-premium-gold/10 text-premium-gold hover:bg-premium-gold hover:text-black transition-all flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                              title="Assign Captain"
                            >
                              <Crown size={16} />
                            </button>
                            <button onClick={() => handleEdit(team)} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/5 transition-all flex items-center justify-center"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(team._id)} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/5 transition-all flex items-center justify-center"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="p-32 text-center opacity-30">NO FRANCHISES REGISTERED</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel w-full max-w-xl relative z-10 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">UNIT <span className="text-blue-400">CONFIG</span></h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Franchise Name</label>
                  <input required className="premium-input w-full" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Initial Capital (Lakhs)</label>
                  <input type="number" className="premium-input w-full" value={formData.initialPurse} onChange={e => setFormData({ ...formData, initialPurse: parseInt(e.target.value) })} />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-white/5 rounded-xl text-[10px] font-black">ABORT</button>
                  <button type="submit" className="flex-1 py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase">EXECUTE</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCaptainModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCaptainModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="glass-panel w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">PROMOTE <span className="shimmer-text">COMMANDER</span></h2>
                <button onClick={() => setShowCaptainModal(false)}><X size={20} /></button>
              </div>
              <div className="p-6 bg-black/20 relative">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                <input placeholder="SEARCH ASSETS..." className="premium-input w-full !pl-12" value={playerSearch} onChange={e => setPlayerSearch(e.target.value)} />
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {players.filter(p => p.name.toLowerCase().includes(playerSearch.toLowerCase())).map(player => (
                  <div key={player._id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                    <div>
                      <p className="text-sm font-black uppercase italic">{player.name}</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">{player.role} • {player.dept}</p>
                    </div>
                    <button onClick={() => handleAssignCaptain(player._id)} className="px-4 py-2 bg-premium-gold/10 text-premium-gold border border-premium-gold/20 rounded-lg text-[9px] font-black hover:bg-premium-gold hover:text-black transition-all">APPOINT</button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageTeams;
