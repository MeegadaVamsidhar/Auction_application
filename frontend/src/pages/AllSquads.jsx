import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, User, ChevronRight, Trophy, Users, Wallet, ArrowLeft, Target, Star } from "lucide-react";
import { Link } from "react-router-dom";
import API_URL from "../config";

const AllSquads = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [viewTeam, setViewTeam] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/admin/teams`);
                const approvedTeams = res.data.filter((t) => t.status === "approved");
                setTeams(approvedTeams);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching teams:", err);
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    const filteredTeams = viewTeam
        ? teams.filter(t => t._id === viewTeam)
        : teams;

    const formatPrice = (value) => {
        if (!value && value !== 0) return "₹0 L";
        if (value >= 100) {
            return `₹${(value / 100).toFixed(2)} Cr`;
        }
        return `₹${value} L`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-premium-dark flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-premium-gold/20 border-t-premium-gold rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-premium-gold animate-pulse">Compiling Global Intel...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-premium-dark text-white font-sans selection:bg-premium-gold/30 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-premium-gold/[0.03] rounded-full blur-[150px]"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.1) 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 relative z-10">
                <header className="mb-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                        <div className="space-y-4">
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center group-hover:border-premium-gold/30 transition-all">
                                    <ArrowLeft size={18} className="text-premium-gold group-hover:-translate-x-1 transition-transform" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">Abort to Portal</span>
                            </Link>
                            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-[0.85]">
                                GLOBAL <br />
                                <span className="shimmer-text">ROSTERS</span>.
                            </h1>
                            {viewTeam && (
                                <button
                                    onClick={() => setViewTeam(null)}
                                    className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-premium-gold hover:bg-premium-gold/10 hover:border-premium-gold/30 transition-all flex items-center gap-2"
                                >
                                    <ArrowLeft size={12} /> RESTORE GLOBAL VIEW
                                </button>
                            )}
                        </div>

                        <div className="glass-panel p-6 border-white/5 bg-white/[0.01] flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Franchises</p>
                                <p className="text-3xl font-black italic text-white font-mono">{teams.length}</p>
                            </div>
                            <div className="w-px h-10 bg-white/5"></div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-premium-gold uppercase tracking-widest mb-1 text-right">Drafted Prospects</p>
                                <p className="text-3xl font-black italic text-white font-mono text-right">{teams.reduce((acc, team) => acc + (team.players?.length || 0), 0)}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs max-w-xl border-l-2 border-premium-gold/30 pl-6 leading-relaxed">
                        The official dossier of every franchise competing in GULTI 2K26. Monitor the squad composition, discipline distribution, and remaining capital of all contenders.
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {filteredTeams.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-40 glass-panel border-dashed border-2 border-white/5">
                            <Users size={48} className="mx-auto mb-6 text-gray-700" />
                            <p className="text-sm font-black text-gray-600 uppercase tracking-widest italic">No Authorized Franchises Found in Archive</p>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col gap-12">
                            {filteredTeams.map((team, idx) => (
                                <motion.div
                                    key={team._id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    whileHover={!viewTeam ? { scale: 1.01 } : {}}
                                    onClick={() => !viewTeam && setViewTeam(team._id)}
                                    className={`glass-panel p-0 overflow-hidden border-white/5 transition-all group ${!viewTeam ? 'cursor-pointer hover:border-premium-gold/20' : ''}`}
                                >
                                    {/* Team Header Panel */}
                                    <div className="p-8 md:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/5 bg-white/[0.01]">
                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-premium-gold/30 transition-all relative">
                                                <Shield size={44} className="text-premium-gold/40 group-hover:text-premium-gold/80 transition-all" />
                                                <span className="absolute text-xl font-black italic text-white">{team.name.charAt(0)}</span>
                                            </div>
                                            <div className="space-y-3 text-center md:text-left">
                                                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white group-hover:shimmer-text transition-all">
                                                    {team.name}
                                                </h2>
                                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-lg">
                                                        <Trophy size={12} className="text-premium-gold" />
                                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{team.captain?.username || "UNASSIGNED"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5 rounded-lg">
                                                        <Users size={12} className="text-blue-400" />
                                                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{team.players?.length || 0} SECURED</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-2 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-2xl">
                                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">Capital Reserve</p>
                                            <p className="text-3xl font-black italic font-mono text-green-500">{formatPrice(team.remainingPurse)}</p>
                                            <div className="w-40 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${(team.remainingPurse / 10000) * 100}%` }}
                                                    className="h-full bg-green-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Squad Roster Sub-Grid */}
                                    <div className="p-8 md:p-10 bg-black/20">
                                        {(!team.players || team.players.length === 0) ? (
                                            <div className="py-12 text-center opacity-30 flex flex-col items-center gap-4">
                                                <Star size={32} />
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Readiness: Pending Draft Assignments</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                                {team.players.map((player) => (
                                                    <motion.div
                                                        key={player._id}
                                                        whileHover={{ y: -5 }}
                                                        className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.04] hover:border-premium-gold/30 transition-all relative overflow-hidden"
                                                    >
                                                        <div className="flex justify-between items-start relative z-10">
                                                            <div className="space-y-1 overflow-hidden">
                                                                <p className="font-black italic uppercase tracking-tighter text-white truncate text-sm">
                                                                    {player.name}
                                                                </p>
                                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest uppercase truncate">{player.role}</p>
                                                            </div>
                                                            <p className="text-xs font-black italic text-premium-gold font-mono whitespace-nowrap">{formatPrice(player.soldPrice)}</p>
                                                        </div>

                                                        <div className="flex items-center gap-4 pt-4 border-t border-white/5 relative z-10 opacity-30 group-hover:opacity-100 transition-opacity">
                                                            <div className="flex items-center gap-1.5">
                                                                <Target size={10} className="text-premium-gold" />
                                                                <span className="text-[9px] font-bold text-gray-400 uppercase">{player.dept}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 italic">
                                                                <Star size={10} className="text-premium-gold" />
                                                                <span className="text-[9px] font-bold text-gray-400 uppercase">{player.year}</span>
                                                            </div>
                                                        </div>

                                                        {/* Subtle Background Icon */}
                                                        <Target size={60} className="absolute -bottom-4 -right-4 text-white/[0.02] -rotate-12 pointer-events-none" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Capacity Indicator Bar */}
                                    <div className="px-10 pb-10">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                                                <Shield size={10} /> FRANCHISE ROSTER CAPACITY
                                            </p>
                                            <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">
                                                {team.players?.length || 0} / 15 SECURED
                                            </p>
                                        </div>
                                        <div className="h-1.5 bg-white/[0.02] w-full rounded-full overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${(team.players?.length || 0) / 15 * 100}%` }}
                                                className="h-full bg-gradient-to-r from-premium-gold to-yellow-600"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* Performance Note */}
                <div className="mt-20 text-center space-y-4">
                    <div className="w-px h-12 bg-gradient-to-b from-premium-gold to-transparent mx-auto"></div>
                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] italic">Official Authentication Layer | Cryptographic Registry G2K26</p>
                </div>
            </div>
        </div>
    );
};

export default AllSquads;
