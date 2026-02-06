import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import {
  Trophy,
  Clock,
  User as UserIcon,
  Activity,
  TrendingUp,
  History,
  LogOut,
  ChevronRight,
  Zap,
  Target,
  Shield,
  Cpu,
  Radio,
  Wifi,
  BarChart3,
  Crosshair
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API_URL from "../config";

const socket = io(API_URL);

const AuctionArena = () => {
  const { user, logout } = useContext(AuthContext);
  const [auctionData, setAuctionData] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const scrollRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/players`);
      const teamsRes = await axios.get(`${API_URL}/api/admin/teams`);
      setTeams(teamsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    socket.on("auctionUpdate", (data) => {
      setAuctionData(data);
      if (data && data.highestBid !== undefined) {
        const currentVal = data.highestBid === 0 ? data.currentPlayer?.basePrice || 0 : data.highestBid;
        const nextBid = data.highestBid === 0 ? currentVal : currentVal + (data.bidIncreaseAmount || 5);
        setBidAmount(nextBid);
      }
    });

    socket.on("playerSold", () => fetchData());
    socket.on("playerUnsold", () => fetchData());

    return () => {
      socket.off("auctionUpdate");
      socket.off("playerSold");
      socket.off("playerUnsold");
    };
  }, []);

  const formatPrice = (value) => {
    if (!value && value !== 0) return "₹0 L";
    if (value >= 100) {
      return `₹${(value / 100).toFixed(2)} Cr`;
    }
    return `₹${value} L`;
  };

  const handleBid = () => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (userLocal && userLocal.role === "captain" && userLocal.team) {
      socket.emit("placeBid", { teamId: userLocal.team, bidAmount });
    } else {
      alert("Only captains can bid!");
    }
  };

  const filteredTeams = selectedTeamId
    ? teams.filter(t => t._id === selectedTeamId)
    : teams;

  return (
    <div className="min-h-screen bg-premium-dark text-white font-sans selection:bg-premium-gold/30 flex flex-col">
      {/* Cinematic Tactical Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.05) 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/[0.02] to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/[0.03] rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-premium-gold/[0.03] rounded-full blur-[120px] animate-pulse-slow"></div>
        {/* Scanning Line Effect */}
        <motion.div
          animate={{ y: ['0%', '1000%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-full h-[2px] bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Tactical Header */}
        <header className="px-8 py-4 border-b border-white/5 bg-white/[0.01] backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-2xl relative">
                <Radio className="text-blue-400" size={24} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">
                  OPERATIONS <span className="text-blue-400 shimmer-text">ARENA</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                    <Wifi size={10} /> SYS_ONLINE_READY
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8 pl-8 border-l border-white/5">
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic">MARKET VOLATILITY</p>
                <div className="flex items-center gap-2">
                  <TrendingUp size={12} className="text-green-500" />
                  <p className="text-sm font-black text-white tabular-nums font-mono tracking-tighter">HIGH_ACTIVE</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic">SQUAD_QUOTA_MAX</p>
                <p className="text-sm font-black text-blue-400 tabular-nums font-mono tracking-tighter">15 UNITS</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Master Timer Control */}
            <div className="bg-black/40 border border-blue-500/20 px-8 py-3 rounded-2xl flex items-center gap-6 relative group overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.1)]">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col items-end">
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest italic">TARGET_WINDOW</p>
                <span className="text-3xl font-black font-mono tracking-tighter shimmer-text tabular-nums">
                  {String(auctionData?.timer || 0).padStart(2, '0')}
                  <span className="text-[10px] text-gray-500 ml-1 font-sans">s</span>
                </span>
              </div>
              <div className="w-[1px] h-10 bg-white/5"></div>
              <div className="h-10 w-10 flex items-center justify-center">
                <Clock className={`text-blue-500 ${auctionData?.timer <= 10 ? 'animate-spin-slow' : ''}`} size={24} />
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest">OPERATOR_AUTH</p>
                  <p className="text-sm font-black text-white italic truncate max-w-[120px]">{user.username.toUpperCase()}</p>
                </div>
                <button onClick={logout} className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20 flex items-center justify-center group">
                  <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1 grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Financial War Room */}
          <section className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-400" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">LIQUIDITY MATRIX</h2>
              </div>
              <div className="flex items-center gap-2">
                {selectedTeamId && (
                  <button
                    onClick={() => setSelectedTeamId(null)}
                    className="text-[8px] font-black text-blue-400 underline uppercase tracking-widest"
                  >
                    RESET
                  </button>
                )}
                <span className="text-[8px] font-black text-gray-700 bg-white/5 px-2 py-0.5 rounded italic">{teams.length} UNITS</span>
              </div>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {filteredTeams.filter(t => t.status === "approved").map((team) => (
                  <motion.div
                    layout
                    key={team._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => !selectedTeamId && setSelectedTeamId(team._id)}
                    className={`glass-panel border-white/5 p-4 group transition-all relative ${!selectedTeamId ? 'cursor-pointer hover:bg-white/[0.03] hover:border-blue-400/20' : 'border-blue-500/30 bg-blue-500/5'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center text-[10px] font-black italic text-blue-400 group-hover:scale-105 transition-transform group-hover:border-blue-400/40">
                          {team.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-black text-[11px] uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">{team.name}</h3>
                          <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 italic">ID: {team._id.substring(0, 6)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-premium-gold font-mono tracking-tighter shimmer-text">{formatPrice(team.remainingPurse)}</p>
                        <p className="text-[7px] uppercase font-black text-gray-700 mt-1 tracking-widest italic">CREDITS_AVAIL</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest">
                        <span>ASSET LOAD: {team.players?.length || 0}/15</span>
                        <span className="italic">{((team.players?.length || 0) / 15 * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(team.players?.length || 0) / 15 * 100}%` }}
                          className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Center: Targeting Module (Current Player) */}
          <main className="lg:col-span-6">
            <AnimatePresence mode="wait">
              {auctionData?.currentPlayer ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  className="glass-panel p-8 md:p-12 relative overflow-hidden border-white/5 shadow-[0_0_100px_rgba(59,130,246,0.05)]"
                >
                  {/* Tactical Targeting UI Elements */}
                  <div className="absolute top-0 left-0 p-4 opacity-20"><Crosshair size={32} /></div>
                  <div className="absolute top-0 right-0 p-4 opacity-20 rotate-90"><Crosshair size={32} /></div>
                  <div className="absolute bottom-0 left-0 p-4 opacity-20 -rotate-90"><Crosshair size={32} /></div>
                  <div className="absolute bottom-0 right-0 p-4 opacity-20 180"><Crosshair size={32} /></div>

                  {/* Operational Role Badge */}
                  <div className="absolute top-8 right-8">
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] italic">UNIT_CLASS</span>
                      <span className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-400/30 italic">
                        {auctionData.currentPlayer.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    {/* Targeting Visualizer */}
                    <div className="relative mb-8 pt-4">
                      <div className="absolute -inset-8 border border-blue-500/10 rounded-full animate-spin-slow pointer-events-none"></div>
                      <div className="absolute -inset-16 border border-white/5 rounded-full animate-reverse-spin pointer-events-none"></div>
                      <div className="w-56 h-56 md:w-72 md:h-72 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl relative group">
                        <UserIcon size={140} className="text-gray-800 transition-transform group-hover:scale-110 duration-700" />
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        {/* Scanning HUD */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-blue-500/30 animate-scan"></div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end justify-center pb-8">
                          <div className="flex gap-8">
                            <div className="text-center">
                              <p className="text-[8px] uppercase font-black text-gray-600 tracking-widest italic mb-1">UNIT_ORIGIN</p>
                              <p className="text-xs font-black text-white italic">{auctionData.currentPlayer.dept}</p>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10 mt-1"></div>
                            <div className="text-center">
                              <p className="text-[8px] uppercase font-black text-gray-600 tracking-widest italic mb-1">DEPLOY_YEAR</p>
                              <p className="text-xs font-black text-white italic">LVL_{auctionData.currentPlayer.year}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-center mb-10 uppercase text-white leading-none">
                      {auctionData.currentPlayer.name}
                    </h2>

                    {/* Telemetry Matrix */}
                    <div className="grid grid-cols-3 gap-1 w-full max-w-xl p-6 bg-black/40 border border-white/5 rounded-3xl mb-12 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {[
                        { label: "BATTLE_COUNT", val: auctionData.currentPlayer.stats?.matches || 0, icon: <Activity size={10} /> },
                        { label: "ACCUM_STRIKE", val: auctionData.currentPlayer.stats?.runs || 0, highlight: true, icon: <Zap size={10} /> },
                        { label: "ENTITY_NEUTR", val: auctionData.currentPlayer.stats?.wickets || 0, icon: <Target size={10} /> },
                      ].map((stat, i) => (
                        <div key={i} className={`p-4 text-center ${i !== 2 ? 'border-r border-white/5' : ''}`}>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-gray-600">{stat.icon}</span>
                            <p className="text-[8px] uppercase font-black text-gray-500 tracking-widest italic">{stat.label}</p>
                          </div>
                          <p className={`text-3xl font-black font-mono tracking-tighter ${stat.highlight ? 'text-premium-gold shimmer-text' : 'text-white'}`}>{stat.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Valuation Panel */}
                    <div className="grid md:grid-cols-2 gap-8 w-full">
                      <div className="glass-panel p-6 border-white/5 bg-white/[0.01] relative overflow-hidden">
                        <p className="text-[9px] uppercase font-black text-gray-600 mb-2 tracking-[0.2em] italic">INITIAL_VALUATION (BASE)</p>
                        <p className="text-4xl font-black font-mono tracking-tighter text-gray-400 tabular-nums">{formatPrice(auctionData.currentPlayer.basePrice)}</p>
                        <div className="absolute bottom-2 right-4 text-[7px] font-black text-gray-800 uppercase italic">STABLE_PARAM</div>
                      </div>
                      <div className="glass-panel p-6 border-blue-500/20 bg-blue-500/5 relative group overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                        <div className="absolute top-0 right-0 p-4 text-blue-500/10 animate-pulse group-hover:text-blue-500/20 transition-colors">
                          <TrendingUp size={48} />
                        </div>
                        <p className="text-[9px] uppercase font-black text-blue-400 mb-2 tracking-[0.3em] italic">LIVE_COMMAND_BID (PEAK)</p>
                        <p className="text-5xl font-black font-mono tracking-tighter text-blue-400 animate-pulse tabular-nums shimmer-text">{formatPrice(auctionData.highestBid)}</p>
                        <div className="absolute bottom-2 right-4 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                          <span className="text-[7px] font-black text-blue-500 uppercase italic">REALTIME_TELEMETRY</span>
                        </div>
                      </div>
                    </div>

                    {/* Command Input Area */}
                    <div className="w-full mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-6">
                      <div className="flex-1 relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-black italic text-xl group-focus-within:scale-110 transition-transform">₹</span>
                        <input
                          type="number"
                          className="w-full pl-12 pr-6 py-6 bg-black/40 border border-white/10 rounded-2xl text-3xl font-mono text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none tracking-tighter"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <span className="text-[10px] font-black text-gray-700 tracking-[0.2em] italic">LAKHS_UNIT</span>
                        </div>
                      </div>
                      <button
                        onClick={handleBid}
                        disabled={user?.role !== 'captain'}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-6 rounded-2xl flex items-center justify-center gap-4 group shadow-[0_0_40px_rgba(37,99,235,0.4)] border border-blue-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Zap size={24} className="fill-current text-white animate-pulse" />
                        <span className="text-2xl font-black italic tracking-widest uppercase">EXECUTE_BID</span>
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-panel p-24 flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="w-32 h-32 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center relative group">
                    <div className="absolute inset-0 border border-blue-500/20 rounded-full animate-ping opacity-30"></div>
                    <Cpu size={64} className="text-gray-800 animate-pulse group-hover:text-blue-500/30 transition-colors" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase shimmer-text opacity-30">Awaiting Signal</h3>
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mt-4 leading-relaxed">Central Command is indexing the next unit profile...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Right: Operational Activity (Battle Logs) */}
          <section className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 mb-2 px-1">
              <History size={16} className="text-blue-400" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">OPERATIONAL_LOGS</h2>
            </div>
            <div className="glass-panel h-[calc(100vh-250px)] flex flex-col overflow-hidden border-white/5 relative">
              {/* Tactical scanline for logs */}
              <div className="absolute inset-x-0 h-10 bg-gradient-to-b from-blue-500/5 to-transparent top-0 z-10 pointer-events-none"></div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-black/10"
              >
                <AnimatePresence>
                  {[
                    { msg: "COMMAND_LINK_ESTABLISHED", type: "system", time: "09:00:01" },
                    { msg: "MARKET_TELEMETRY_SYNCED", type: "system", time: "09:00:15" },
                    { msg: "PLAYER_INDEX_VERIFIED", type: "system", time: "09:01:04" },
                    { msg: "AUCTION_PROTOCOL_ENGAGED", type: "auction", time: "09:05:00" },
                  ].map((log, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className="flex gap-4 group/log"
                    >
                      <span className="text-[8px] font-mono text-gray-700 mt-1 whitespace-nowrap">{log.time}</span>
                      <p className={`text-[11px] font-mono leading-relaxed uppercase tracking-tighter ${log.type === 'system' ? 'text-blue-400' : 'text-premium-gold'} group-hover/log:brightness-125 transition-all`}>
                        <span className="opacity-20 mr-2">»</span>
                        {log.msg}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-5 bg-black/40 border-t border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-gray-700 uppercase italic">COMMS_STATUS: ENCRYPTED</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[8px] font-black text-green-500 uppercase tracking-widest italic">STREAMING_LIVE</span>
                  </div>
                </div>
                <div className="flex gap-1 h-[2px]">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex-1 bg-white/5 relative overflow-hidden">
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        className="absolute inset-0 bg-blue-500/30"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="p-8 border-t border-white/5 text-center flex flex-col items-center gap-4 bg-white/[0.01]">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">LIVE_SOCKET_LINK_VERIFIED v.2.8.1</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-premium-gold shadow-[0_0_8px_rgba(212,175,55,0.5)]"></div>
              <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em]">MARKET_FLUX_STABILIZED</span>
            </div>
          </div>
          <p className="text-[9px] font-black text-gray-800 uppercase tracking-[1.5em] italic">GULTI TACTICAL AUCTION PROTOCOLS</p>
        </footer>
      </div>
    </div>
  );
};

export default AuctionArena;
