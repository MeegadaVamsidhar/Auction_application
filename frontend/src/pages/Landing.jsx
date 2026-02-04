import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Shield, Crown, Users, TrendingUp, UserCheck, UserX } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';

import API_URL from '../config';

const Landing = () => {
    const [stats, setStats] = useState({
        totalPlayers: 0,
        soldPlayers: 0,
        unsoldPlayers: 0,
        teamStats: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/stats`);
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };

        // Initial fetch
        fetchStats();

        // Socket connection for real-time updates
        const socket = io(API_URL);

        socket.on('playerSold', () => {
            console.log("Real-time Update: Player Sold");
            fetchStats();
        });

        socket.on('playerUnsold', () => {
            console.log("Real-time Update: Player Unsold");
            fetchStats();
        });

        // Background polling every 30s as fallback
        const interval = setInterval(fetchStats, 30000);

        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, []);
    return (
        <div className="min-h-screen bg-premium-dark flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-premium-gold/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* Navbar Placeholder (Enhances look) */}
            <nav className="w-full p-6 flex justify-between items-center relative z-20">
                <div className="text-2xl font-black italic tracking-tighter text-white">Gulties <span className="text-premium-gold">AUCTION</span></div>
                <div className="text-xs font-mono opacity-50">The South Indian Cricket League</div>
            </nav>

            <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                <div className="max-w-6xl w-full">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
                        {/* Hero Text */}
                        <div className="md:w-1/2 text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-block bg-premium-gold/10 border border-premium-gold/20 rounded-full px-4 py-1 text-premium-gold text-xs font-bold mb-4 uppercase tracking-wider"
                            >
                                Official Auction Portal
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.9] mb-6"
                            >
                                BUILD<br />YOUR<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold to-yellow-600">LEGACY.</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-400 text-lg max-w-md border-l-2 border-premium-gold pl-4"
                            >
                                The stage is set. Bidding wars begin now. Manage your squad, bid for stars, and create the ultimate team.
                            </motion.p>
                        </div>

                        {/* Hero Visual/Stats */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="md:w-1/2 space-y-6"
                        >
                            {/* Auction Overview */}
                            <div className="glass-panel p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <TrendingUp size={80} />
                                </div>
                                <h3 className="text-premium-gold font-bold text-sm mb-4 uppercase tracking-widest">Auction Pulse</h3>
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Users size={14} className="text-blue-400" />
                                            <span className="text-[10px] uppercase font-bold">Registered</span>
                                        </div>
                                        <p className="text-2xl font-mono font-bold text-white">{stats.totalPlayers}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <UserCheck size={14} className="text-green-400" />
                                            <span className="text-[10px] uppercase font-bold">Sold</span>
                                        </div>
                                        <p className="text-2xl font-mono font-bold text-white">{stats.soldPlayers}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 col-span-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 text-gray-400 mb-1">
                                                    <UserX size={14} className="text-red-400" />
                                                    <span className="text-[10px] uppercase font-bold">Unsold / Pending</span>
                                                </div>
                                                <p className="text-2xl font-mono font-bold text-white">{stats.unsoldPlayers}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-premium-gold uppercase mb-1">Success Rate</div>
                                                <div className="text-xl font-mono text-premium-gold">
                                                    {stats.totalPlayers > 0 ? Math.round((stats.soldPlayers / (stats.soldPlayers + stats.unsoldPlayers)) * 100) : 0}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Teams Status */}
                            <div className="glass-panel p-6 relative overflow-hidden">
                                <h3 className="text-blue-400 font-bold text-sm mb-4 uppercase tracking-widest flex items-center gap-2">
                                    <Shield size={16} /> Team Squads
                                </h3>
                                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {stats.teamStats.length > 0 ? (
                                        stats.teamStats.map((team, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-premium-gold/20 to-yellow-600/20 flex items-center justify-center text-[10px] font-black italic border border-premium-gold/30">
                                                        {team.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-200">{team.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <span className="block text-[8px] uppercase text-gray-500 font-bold">Squad Size</span>
                                                        <span className="text-sm font-mono text-white font-bold">{team.playerCount}/15</span>
                                                    </div>
                                                    <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-premium-gold transition-all duration-1000"
                                                            style={{ width: `${(team.playerCount / 15) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-gray-500 italic text-sm">
                                            No teams registered yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Role Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Player Card */}
                        <Link to="/player-login" className="group">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glass-panel p-6 h-full border-t-4 border-t-transparent hover:border-t-premium-gold transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-gray-800/50 p-3 rounded-lg group-hover:bg-premium-gold group-hover:text-black transition-colors">
                                        <User size={24} />
                                    </div>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-premium-gold">→</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">PLAYER</h2>
                                <p className="text-sm text-gray-500 leading-relaxed">View your auction status, sold price, and team allocation.</p>
                            </motion.div>
                        </Link>

                        {/* Captain Card */}
                        <Link to="/captain-login" className="group">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glass-panel p-6 h-full border-t-4 border-t-transparent hover:border-t-blue-500 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-gray-800/50 p-3 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Crown size={24} />
                                    </div>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-blue-500">→</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">CAPTAIN</h2>
                                <p className="text-sm text-gray-500 leading-relaxed">Enter the war room. Bid for players and build your squad.</p>
                            </motion.div>
                        </Link>

                        {/* Admin Card */}
                        <Link to="/admin-login" className="group">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="glass-panel p-6 h-full border-t-4 border-t-transparent hover:border-t-red-500 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-gray-800/50 p-3 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                                        <Shield size={24} />
                                    </div>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-red-500">→</span>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">ADMIN</h2>
                                <p className="text-sm text-gray-500 leading-relaxed">Control the flow. Manage teams, players, and auction rules.</p>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
