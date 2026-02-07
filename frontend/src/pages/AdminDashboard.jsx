import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import {
  Shield,
  Users,
  Activity,
  TrendingUp,
  Settings,
  Search,
  Upload,
  CheckCircle,
  XCircle,
  ExternalLink,
  Zap,
  ArrowRight,
  User as UserIcon,
  LogOut,
  Layout,
  Clock,
  ChevronRight,
  AlertCircle,
  FileText,
  Target,
  BarChart3,
  Trophy,
  Cpu,
  Fingerprint,
  Radio,
  Wifi,
  Database,
  Edit3,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import API_URL from "../config";

const AdminDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [liveAuction, setLiveAuction] = useState(null);
  const [activeTab, setActiveTab] = useState("control");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    mobile: "",
    role: "",
    dept: "",
    year: "",
    basePrice: 5,
  });
  const navigate = useNavigate();

  const formatPrice = (value) => {
    if (!value && value !== 0) return "₹0 L";
    if (value >= 100) {
      return `₹${(value / 100).toFixed(2)} Cr`;
    }
    return `₹${value} L`;
  };

  const [uploading, setUploading] = useState(false);
  const [playerListLink, setPlayerListLink] = useState("");
  const [savedPlayerListLink, setSavedPlayerListLink] = useState("");
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);

  const fetchData = async () => {
    try {
      const [playersRes, teamsRes, pendingAdminsRes, allAdminsRes, linkRes] =
        await Promise.all([
          axios.get(`${API_URL}/api/admin/players`),
          axios.get(`${API_URL}/api/admin/teams`),
          axios.get(`${API_URL}/api/admin/pending-admins`),
          axios.get(`${API_URL}/api/admin/all-admins`),
          axios.get(`${API_URL}/api/admin/settings/player-list-link`),
        ]);
      const sortedPlayers = playersRes.data.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return 0;
      });
      setPlayers(sortedPlayers);
      setTeams(teamsRes.data);
      setPendingAdmins(pendingAdminsRes.data || []);
      setAllAdmins(allAdminsRes.data || []);
      if (linkRes.data.link) {
        setSavedPlayerListLink(linkRes.data.link);
        if (!playerListLink) setPlayerListLink(linkRes.data.link);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const savePlayerListLink = async () => {
    try {
      setUploading(true);
      const res = await axios.post(
        `${API_URL}/api/admin/settings/player-list-link`,
        { link: playerListLink },
      );
      setSavedPlayerListLink(playerListLink);
      alert(res.data.message || "Operation successful!");
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error saving link/syncing players");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchData();
    socketRef.current = io(API_URL);

    socketRef.current.on("auctionUpdate", (data) => {
      setLiveAuction(data.isActive ? data : null);
    });

    socketRef.current.on("playerSold", () => {
      fetchData();
    });

    socketRef.current.on("playerUnsold", () => {
      fetchData();
    });

    return () => socketRef.current.disconnect();
  }, []);

  const handlePlayerStatus = async (id, status) => {
    await axios.patch(`${API_URL}/api/admin/players/${id}/status`, { status });
    fetchData();
  };

  const handleTeamStatus = async (id, status) => {
    await axios.patch(`${API_URL}/api/admin/teams/${id}/status`, { status });
    fetchData();
  };

  const startAuction = (player) => {
    socketRef.current.emit("startAuction", { player });
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setEditFormData({
      name: player.name,
      mobile: player.mobile,
      role: player.role,
      dept: player.dept,
      year: player.year,
      basePrice: player.basePrice || 5,
    });
    setShowEditModal(true);
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/admin/players/${editingPlayer._id}`, editFormData);
      setShowEditModal(false);
      fetchData();
      alert("Player updated successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Error updating player");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/admin/upload-players`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      alert(res.data.message);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error uploading file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const sellPlayer = () => {
    if (confirm("Are you sure you want to SELL this player?")) {
      socketRef.current.emit("sellPlayer");
    }
  };

  const markUnsold = () => {
    if (confirm("Mark player as UNSOLD?")) {
      socketRef.current.emit("markUnsold");
    }
  };

  const handleAdminApproval = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/admin/approve-admin/${id}`);
      alert("Admin Approved and email sent!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Error approving admin");
    }
  };

  const handleLogout = () => {
    if (confirm("Terminate admin session and exit command center?")) {
      localStorage.clear();
      navigate("/admin-login");
    }
  };

  return (
    <div className="min-h-screen bg-premium-dark text-white font-sans selection:bg-premium-gold/30 flex">
      {/* Cinematic Background Layer */}
      <div className="cinematic-bg fixed z-0">
        <div className="cinematic-glow w-[1000px] h-[1000px] -top-96 -right-96 bg-premium-accent/15"></div>
        <div className="cinematic-glow w-[800px] h-[800px] bottom-0 left-0 bg-premium-gold/5"></div>
        <div className="cinematic-bg modern-grid opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-premium-dark via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col">
        {/* Global Operations Header */}
        <header className="px-10 py-6 flex flex-col lg:flex-row justify-between items-center gap-8 border-b border-white/5 bg-white/[0.01] backdrop-blur-3xl sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-2xl relative group overflow-hidden">
              <Shield className="text-blue-400" size={32} />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-400/50 animate-scan"></div>
              <div className="absolute inset-0 bg-blue-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
                CENTRAL <span className="text-blue-400 shimmer-text">COMMAND</span>
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Operations Matrix Online</span>
                </div>
                <div className="w-px h-3 bg-white/10"></div>
                <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest">v.4.12.0_TACTICAL</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-2 bg-black/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="flex px-1">
                {[
                  { id: "control", label: "OPERATIONS", icon: Cpu },
                  { id: "history", label: "ARCHIVES", icon: Database }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-blue-400/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="w-px h-8 bg-white/5 mx-2"></div>
              <div className="flex items-center gap-3 pr-2">
                <Link to="/admin/players" className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all border border-transparent hover:border-blue-400/20 group" title="Player Archive">
                  <Fingerprint size={20} className="group-hover:scale-110 transition-transform" />
                </Link>
                <Link to="/admin/teams" className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-premium-gold hover:bg-premium-gold/10 rounded-xl transition-all border border-transparent hover:border-premium-gold/20 group" title="Franchise Registry">
                  <Shield size={20} className="group-hover:scale-110 transition-transform" />
                </Link>
                <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 group">
                  <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </nav>
          </div>
        </header>

        <main className="p-10 lg:p-14 space-y-12 flex-1 scroll-smooth">
          {/* Tactical Telemetry Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "POOL_CAPACITY", icon: Users, val: players.length, sub: "UNIT_RECORDS", color: "blue", trend: "+12%" },
              { label: "FRANCHISES", icon: Trophy, val: teams.filter(t => t.status === "approved").length, sub: "AUTH_UNITS", color: "gold", trend: "NOMINAL" },
              { label: "SECURE_PEERS", icon: Shield, val: allAdmins.length, sub: "TIER_1_AUTH", color: "purple", trend: "SYNCED" },
              { label: "AUCTION_GRID", icon: Activity, val: liveAuction ? "LIVE" : "IDLE", sub: liveAuction ? "OPS_ACTIVE" : "OPS_STANDBY", color: liveAuction ? "green" : "gray", trend: liveAuction ? "BUSY" : "READY" }
            ].map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                key={i}
                className="glass-panel p-8 relative overflow-hidden group hover:bg-white/[0.02] border-white/5 hover:border-blue-500/20 transition-all shadow-2xl"
              >
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-2 h-2 rounded-full ${stat.val === 'IDLE' ? 'bg-gray-600' : 'bg-blue-500 animate-pulse'}`}></div>
                      <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] font-mono italic">{stat.label}</p>
                    </div>
                    <h3 className={`text-4xl font-black italic tabular-nums text-white tracking-tighter ${stat.val === 'LIVE' ? 'text-green-500 shimmer-text' : ''}`}>{stat.val}</h3>
                    <div className="flex items-center gap-3 mt-3">
                      <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest italic">{stat.sub}</p>
                      <span className="text-[8px] font-black text-blue-500/40 font-mono tracking-tighter">[{stat.trend}]</span>
                    </div>
                  </div>
                  <stat.icon className={`text-blue-500/20 group-hover:text-blue-500/40 transition-all group-hover:scale-110`} size={40} />
                </div>
                {/* Micro-HUD Accentuations */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/[0.02] blur-2xl group-hover:bg-blue-500/[0.05] transition-all"></div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* LEFT: Dossier Operations Queue */}
            <aside className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <Radio size={16} className="text-blue-400" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">UNIT_QUEUE</h2>
                </div>
                <span className="text-[9px] font-black text-gray-800 uppercase tracking-widest">{players.length} RECS</span>
              </div>

              <div className="glass-panel flex flex-col h-[780px] overflow-hidden border-white/5 bg-black/40 relative">
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10"></div>

                <div className="p-8 border-b border-white/5 space-y-8 bg-white/[0.01]">
                  <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 italic flex items-center gap-3">
                      <Upload size={12} /> BATCH_INGESTION
                    </p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls" className="hidden" />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      disabled={uploading}
                      className="w-full bg-blue-600 text-white hover:bg-blue-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(37,99,235,0.2)] border border-blue-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {uploading ? "INDEXING_DATA..." : "UPLOAD_XLS_PROTO"}
                    </button>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 italic">CLOUD_CLOUD_SYNC</p>
                      <Wifi size={10} className="text-gray-800" />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={playerListLink}
                        onChange={(e) => setPlayerListLink(e.target.value)}
                        placeholder="SHEET_TOKEN..."
                        className="flex-1 bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-[10px] outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 transition-all font-mono text-blue-400 tracking-tighter"
                      />
                      <button onClick={savePlayerListLink} className="p-3 bg-white/[0.03] text-gray-500 hover:text-blue-400 rounded-xl border border-white/5 hover:border-blue-400/30 transition-all hover:bg-blue-400/5 group">
                        <Activity size={18} className="group-hover:animate-pulse" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-black/20">
                  {players.map((player, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + (idx * 0.03) }}
                      key={player._id}
                      className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl group hover:border-blue-500/20 transition-all hover:bg-white/[0.03] relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-sm font-black italic uppercase tracking-tight truncate max-w-[150px] text-white group-hover:text-blue-400 transition-colors leading-none">{player.name}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">{player.role}</span>
                            <div className="w-[3px] h-[3px] rounded-full bg-gray-800"></div>
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">{player.dept}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-[8px] px-3 py-1 rounded-xl font-black uppercase tracking-widest italic border ${player.status === 'sold' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                            player.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse' :
                              'bg-white/5 text-gray-600 border-white/10'
                            }`}>{player.status}</span>
                          <button
                            onClick={() => handleEditPlayer(player)}
                            className="w-7 h-7 bg-white/5 hover:bg-blue-600/20 border border-white/5 hover:border-blue-500/30 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-400 transition-all"
                            title="Refine Asset Details"
                          >
                            <Edit3 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {player.status === 'pending' ? (
                          <>
                            <button onClick={() => handlePlayerStatus(player._id, 'approved')} className="flex-1 bg-blue-500/10 text-blue-500 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all italic">ENROLL</button>
                            <button onClick={() => handlePlayerStatus(player._id, 'rejected')} className="flex-1 bg-red-500/10 text-red-500 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all italic">VOID</button>
                          </>
                        ) : (
                          player.status !== 'sold' && !liveAuction && (
                            <button
                              onClick={() => startAuction(player)}
                              className="w-full bg-white/[0.03] text-white hover:bg-blue-600 hover:text-white py-3 rounded-xl text-[10px] font-black tracking-[0.3em] border border-white/10 transition-all group/btn uppercase italic flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                            >
                              DEPLOY_TO_ARENA
                              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          )
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </aside>

            {/* CENTER: Main Tactical Operations Console */}
            <section className="lg:col-span-9 space-y-10">
              <AnimatePresence mode="wait">
                {liveAuction ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.99, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.99, y: -10 }}
                    className="grid lg:grid-cols-2 gap-10"
                  >
                    {/* Active Unit Telemetry Panel */}
                    <div className="glass-panel p-10 border-blue-500/20 bg-blue-500/[0.01] relative overflow-hidden shadow-[0_0_80px_rgba(59,130,246,0.05)]">
                      <div className="absolute top-0 right-0 p-8">
                        <div className="flex items-center gap-4 bg-blue-600 px-6 py-2.5 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-blue-400/30">
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">OPS_PRIMARY_FOCUS</span>
                        </div>
                      </div>

                      <div className="space-y-12">
                        <div className="flex items-center gap-10">
                          <div className="relative group">
                            <div className="absolute -inset-4 border border-blue-500/10 rounded-full animate-spin-slow"></div>
                            <div className="w-32 h-32 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden relative">
                              <span className="text-6xl font-black italic text-blue-400 group-hover:scale-110 transition-transform duration-700">
                                {liveAuction.currentPlayer?.name.charAt(0)}
                              </span>
                              <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-400/40 animate-scan"></div>
                            </div>
                          </div>
                          <div className="space-y-5">
                            <div className="flex items-center gap-4">
                              <span className="bg-blue-600/10 text-blue-400 border border-blue-500/20 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                <Shield size={10} /> TARGET_ALPHA
                              </span>
                              <span className="text-[10px] font-black text-gray-700 font-mono tracking-tighter uppercase px-3 py-1 bg-white/[0.03] rounded-lg border border-white/5">
                                SIG_ID: {liveAuction.currentPlayer?._id.substring(0, 8).toUpperCase()}
                              </span>
                            </div>
                            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none shimmer-text">{liveAuction.currentPlayer?.name}</h2>
                            <div className="flex items-center gap-6 pt-2">
                              <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                {liveAuction.currentPlayer?.role}
                              </p>
                              <div className="w-px h-3 bg-white/10"></div>
                              <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] italic">{liveAuction.currentPlayer?.dept}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 py-12 border-y border-white/5 bg-white/[0.01] rounded-[40px] px-12 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-blue-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="space-y-4 relative z-10 border-r border-white/5 pr-4">
                            <p className="text-[11px] font-black uppercase text-gray-700 tracking-[0.3em] font-mono italic">BASE_VALUATION</p>
                            <p className="text-3xl font-black italic font-mono text-gray-400 tabular-nums tracking-tighter">{formatPrice(liveAuction.currentPlayer?.basePrice)}</p>
                          </div>
                          <div className="space-y-4 text-right relative z-10">
                            <p className="text-[11px] font-black uppercase text-blue-400 tracking-[0.3em] font-mono italic">PEAK_BID_SIGNATURE</p>
                            <p className="text-4xl font-black italic font-mono text-blue-400 tabular-nums shimmer-text tracking-tighter leading-none">{formatPrice(liveAuction.highestBid)}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-10 pt-4">
                          <div className="px-10 space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                              <p className="text-[11px] font-black text-blue-400/50 uppercase tracking-[0.5em] italic">ALPHA_COMMANDER_IDENT</p>
                            </div>
                            <p className="text-3xl font-black italic text-white uppercase tracking-tighter shimmer-text leading-none">
                              {liveAuction.highestBidderName || "SIGNAL_PENDING_BIDS..."}
                            </p>
                            <p className="text-[9px] font-black text-gray-800 uppercase tracking-[0.3em] italic opacity-40">Verifying encrypted financial handshake...</p>
                          </div>

                          <div className="grid grid-cols-2 gap-8">
                            <button
                              onClick={sellPlayer}
                              className="bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl flex items-center justify-center gap-3 transition-all group shadow-[0_0_50px_rgba(37,99,235,0.4)] border border-blue-400/30 active:scale-95"
                            >
                              <CheckCircle size={18} className="group-hover:scale-110 transition-transform text-white animate-pulse" />
                              <span className="text-[11px] font-black italic tracking-[0.3em] uppercase">EXECUTE_SALE</span>
                            </button>
                            <button
                              onClick={markUnsold}
                              className="bg-black/60 border border-white/10 hover:border-red-500/30 text-white hover:text-red-500 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all group active:scale-95"
                            >
                              <XCircle size={18} className="group-hover:rotate-90 transition-transform" />
                              <span className="text-[11px] font-black italic tracking-[0.3em] uppercase">VOID_ASSET</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Operational Telemetry Analytics Feed */}
                    <div className="glass-panel flex flex-col h-[650px] border-white/5 bg-black/40 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-blue-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                          <Activity size={20} className="text-blue-500 animate-pulse" />
                          <h3 className="text-[11px] font-black italic uppercase tracking-[0.4em] text-white">BATTLE_TELEMETRY</h3>
                        </div>
                        <div className="flex items-center gap-3 bg-black/60 px-5 py-2 rounded-xl border border-white/10 shadow-[inner_0_0_10px_rgba(255,255,255,0.05)]">
                          <Clock size={12} className="text-blue-500" />
                          <span className="text-[11px] font-black italic text-white font-mono tracking-tighter">{String(liveAuction.timer).padStart(2, '0')}<span className="text-gray-600 text-[8px] ml-1 uppercase">s_window</span></span>
                        </div>
                      </div>
                      <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar relative z-10">
                        {liveAuction.bidHistory && liveAuction.bidHistory.length > 0 ? (
                          [...liveAuction.bidHistory].reverse().map((log, idx) => (
                            <motion.div
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={idx}
                              className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:border-blue-500/20 transition-all group/bid relative overflow-hidden"
                            >
                              <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 opacity-20 group-hover/bid:opacity-100 transition-opacity"></div>
                              <div className="flex items-center gap-5">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                <div>
                                  <span className="text-xs font-black uppercase tracking-[0.2em] text-white italic group-hover/bid:text-blue-400 transition-colors">
                                    {log.teamName}
                                  </span>
                                  <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest mt-1 italic">FRANCHISE_COMMANDER</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-black italic font-mono text-blue-400 tracking-tighter shimmer-text">{formatPrice(log.amount)}</span>
                                <p className="text-[7px] font-black text-gray-800 uppercase italic tracking-widest mt-0.5">SIGNED_PROTOCOL</p>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center opacity-30 gap-8 py-32">
                            <div className="relative">
                              <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse"></div>
                              <Target size={80} className="text-gray-800 relative z-10" />
                            </div>
                            <div className="text-center space-y-2">
                              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 italic">STANDBY_STATUS</p>
                              <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest italic">Awaiting Bid Signal Detection...</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-panel p-36 flex flex-col items-center justify-center text-center space-y-12 border-dashed border-2 border-white/5 bg-black/[0.05] relative overflow-hidden group shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-blue-500/[0.01] group-hover:bg-blue-500/[0.02] transition-colors"></div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full animate-pulse"></div>
                      <div className="w-32 h-32 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-700">
                        <Shield size={56} className="text-gray-700 group-hover:text-blue-500/30 transition-colors" />
                        <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-reverse-spin opacity-20"></div>
                      </div>
                    </div>
                    <div className="space-y-6 relative z-10">
                      <h2 className="text-5xl font-black italic uppercase tracking-tighter text-gray-500 group-hover:text-white transition-colors duration-500">SYSTEM <span className="text-blue-500/30 group-hover:text-blue-500 transition-colors duration-500 shimmer-text font-mono tracking-[0.5em] ml-4">IDLE</span></h2>
                      <p className="text-xs text-gray-600 uppercase tracking-[0.4em] max-w-xl mx-auto leading-relaxed font-black italic opacity-60">The Global Tactical Grid is currently in standby. Select an Alpha Target from the Dossier Queue to transmit the auction protocol.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Advanced Access Management Matrix */}
              <div className="grid lg:grid-cols-2 gap-10">
                {/* Authorized Tactical Personnel */}
                <div className="glass-panel p-10 space-y-8 border-white/5 bg-black/40 relative group overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-blue-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <Shield size={20} className="text-blue-400" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">AUTHORIZED_PEERS</h3>
                    </div>
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest font-mono italic">ACTIVE_POOL_{allAdmins.length}</span>
                  </div>
                  <div className="space-y-5 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                    {allAdmins.map((adm, idx) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (idx * 0.05) }}
                        key={adm._id}
                        className="flex justify-between items-center p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-blue-500/20 transition-all group/card"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover/card:bg-blue-600 transition-colors">
                            <UserIcon size={16} className="text-blue-400 group-hover/card:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white italic group-hover/card:text-blue-400 transition-colors uppercase leading-none">{adm.username}</p>
                            <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest mt-2 italic font-mono">{adm.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-[9px] font-black text-gray-700 uppercase italic">TIER_1_OP</span>
                          </div>
                          <p className="text-[7px] font-black text-gray-800 uppercase italic font-mono tracking-widest">ACCESS_GRANTED</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Secure Access Requests & Team Validations */}
                <div className="glass-panel p-10 space-y-8 border-red-500/10 bg-black/40 shadow-2xl group overflow-hidden relative">
                  <div className="absolute inset-0 bg-red-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <Zap size={20} className="text-red-500 animate-pulse" />
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">OPERATIONAL_APPROVALS</h3>
                    </div>
                    <span className="text-[9px] font-black text-red-500/60 uppercase tracking-widest italic animate-pulse">ACTION_REQUIRED_NOW</span>
                  </div>

                  <div className="space-y-8 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                    {pendingAdmins.length > 0 && (
                      <div className="space-y-5">
                        <p className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em] font-mono italic px-2 border-l-2 border-red-500/30">ADMIN_ENROLLMENT</p>
                        {pendingAdmins.map(adm => (
                          <div key={adm._id} className="flex justify-between items-center p-5 bg-red-500/[0.03] border border-red-500/10 rounded-2xl group/adm transition-all hover:bg-red-500/[0.06]">
                            <div className="flex items-center gap-5">
                              <AlertCircle size={20} className="text-red-500" />
                              <div>
                                <p className="text-sm font-black text-white italic leading-none">{adm.username.toUpperCase()}</p>
                                <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest mt-2 italic font-mono">{adm.email}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAdminApproval(adm._id)}
                              className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-red-400/30 hover:bg-red-500 transition-all hover:scale-105"
                            >
                              AUTHORIZE_NOW
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-5 pt-8 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em] font-mono italic px-2 border-l-2 border-blue-500/30">TEAM_SQUAD_VALIDATION</p>
                      {teams.filter(t => t.status === 'pending').map(team => (
                        <div key={team._id} className="flex justify-between items-center p-6 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group/team relative overflow-hidden">
                          <div className="absolute inset-y-0 left-0 w-1 bg-yellow-500/50 opacity-100"></div>
                          <div className="relative z-10 px-2">
                            <p className="text-sm font-black italic text-white uppercase leading-none tracking-tight">{team.name}</p>
                            <div className="flex items-center gap-3 mt-3">
                              <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest italic">CAPTAIN: {team.captain?.username.toUpperCase()}</p>
                              <div className="w-1 h-1 rounded-full bg-gray-800"></div>
                              <p className="text-[9px] font-black text-blue-500/60 uppercase italic font-mono tracking-tighter">PROTO_PENDING</p>
                            </div>
                          </div>
                          <div className="flex gap-3 relative z-10">
                            <button onClick={() => handleTeamStatus(team._id, 'approved')} className="w-11 h-11 bg-green-500/10 text-green-500 rounded-xl border border-green-500/20 hover:bg-green-600 hover:text-white transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center"><CheckCircle size={18} /></button>
                            <button onClick={() => handleTeamStatus(team._id, 'rejected')} className="w-11 h-11 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-600 hover:text-white transition-all shadow-lg hover:shadow-red-500/20 flex items-center justify-center"><XCircle size={18} /></button>
                          </div>
                        </div>
                      ))}
                      {teams.filter(t => t.status === 'pending').length === 0 && pendingAdmins.length === 0 && (
                        <div className="py-20 text-center opacity-30 flex flex-col items-center gap-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/10 blur-[50px] rounded-full"></div>
                            <CheckCircle size={44} className="text-gray-800 relative z-10" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700 italic">SIG_POOL_VACANT</p>
                            <p className="text-[9px] font-black text-gray-800 uppercase italic tracking-widest">No Priority Pending Verification Signals Detectable</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className="p-10 border-t border-white/5 text-center flex flex-col items-center gap-8 bg-black/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.01] to-transparent animate-shimmer"></div>
          <div className="flex items-center gap-16 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse"></div>
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">GLOBAL_OPS_CORE v.4.1.28</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]"></div>
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">CRYPTO_LOG_SYNC_OK</span>
            </div>
            <div className="flex items-center gap-4">
              <Radio size={14} className="text-blue-500/40 animate-pulse" />
              <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">ARENA_LIVE_ACTIVE</span>
            </div>
          </div>
          <div className="space-y-4 relative z-10">
            <p className="text-[10px] font-black text-gray-800 uppercase tracking-[1.8em] italic leading-none pl-[1.8em]">GULTI TACTICAL AUCTION INFRASTRUCTURE</p>
            <div className="w-full h-px bg-white/5 max-w-[400px] mx-auto relative overflow-hidden">
              <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 bg-blue-500/20" />
            </div>
          </div>
        </footer>
      </div>

      {/* Advanced Asset Refinement Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 30 }}
              className="glass-panel w-full max-w-3xl relative z-10 overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.1)] border border-white/10"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Fingerprint className="text-blue-400" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                      REFINE <span className="text-blue-400">ASSET</span>
                    </h2>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mt-1.5 italic">Modify Operational Parameters</p>
                  </div>
                </div>
                <button onClick={() => setShowEditModal(false)} className="w-12 h-12 rounded-2xl bg-white/[0.03] hover:bg-red-500/10 hover:text-red-500 transition-all flex items-center justify-center border border-white/5">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdatePlayer} className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">CANDIDATE IDENTITY</label>
                    <input
                      required
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="premium-input !bg-black/40"
                      placeholder="FULL NAME..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">COMMUNICATION UPLINK</label>
                    <input
                      required
                      type="text"
                      value={editFormData.mobile}
                      onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                      className="premium-input !bg-black/40 font-mono"
                      placeholder="+91-000-0000-000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">SPECIALIZATION PROTOCOL</label>
                    <select
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      className="premium-input !bg-black/40 !py-4.5 appearance-none cursor-pointer focus:border-blue-500"
                    >
                      <option className="text-black" value="Batsman">BATSMAN</option>
                      <option className="text-black" value="Bowler">BOWLER</option>
                      <option className="text-black" value="All-rounder">ALL-ROUNDER</option>
                      <option className="text-black" value="Wicket-keeper">WICKET-KEEPER</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">ORIGIN COORDINATES (DEPT)</label>
                    <input
                      required
                      type="text"
                      value={editFormData.dept}
                      onChange={(e) => setEditFormData({ ...editFormData, dept: e.target.value })}
                      className="premium-input !bg-black/40"
                      placeholder="BRANCH / UNIT..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">DRAFT CHRONOLOGY (YEAR)</label>
                    <input
                      required
                      type="text"
                      value={editFormData.year}
                      onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                      className="premium-input !bg-black/40 font-mono"
                      placeholder="202X / 1ST YEAR..."
                    />
                  </div>
                </div>

                <div className="space-y-6 p-8 bg-blue-600/[0.03] border border-blue-500/10 rounded-3xl">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 italic">AUCTION BASE VALUATION</label>
                    <span className="text-2xl font-black text-blue-400 font-mono tracking-tighter shimmer-text">{formatPrice(editFormData.basePrice)}</span>
                  </div>
                  <div className="relative pt-4">
                    <input
                      type="range"
                      min="5"
                      max="500"
                      step="5"
                      value={editFormData.basePrice}
                      onChange={(e) => setEditFormData({ ...editFormData, basePrice: parseInt(e.target.value) })}
                      className="w-full accent-blue-600 bg-white/5 h-2 rounded-full appearance-none cursor-pointer"
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
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-5 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/[0.08] transition-all text-gray-500 hover:text-white"
                  >
                    ABORT CONFIG
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(37,99,235,0.2)] transition-all flex items-center justify-center gap-3 group"
                  >
                    SYNCHRONIZE RECORD
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

export default AdminDashboard;
