import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import io from 'socket.io-client';

import API_URL from '../config';

const PlayerStatus = () => {
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liveAuction, setLiveAuction] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedPlayer = localStorage.getItem('currentPlayer');
        if (!storedPlayer) {
            navigate('/player-login');
            return;
        }

        const player = JSON.parse(storedPlayer);

        // Initial Fetch
        const fetchStatus = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/players/status/${encodeURIComponent(player.name)}`);
                setPlayerData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStatus();

        // Socket Listener for Live Updates
        const socket = io(API_URL);

        socket.on('auctionUpdate', (data) => {
            if (data.isActive && data.currentPlayer?.name === player.name) {
                setLiveAuction(data);
            } else {
                setLiveAuction(null);
            }
        });

        socket.on('playerSold', (data) => {
            if (data.player.name === player.name) {
                setPlayerData(data.player); // Update local status to sold
                setLiveAuction(null);
            }
        });

        return () => socket.disconnect();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentPlayer');
        navigate('/player-login');
    };

    if (loading) return <div className="min-h-screen bg-premium-dark flex items-center justify-center text-premium-gold">Loading...</div>;

    return (
        <div className="min-h-screen bg-premium-dark p-4 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card w-full max-w-md relative z-10 bg-black/40 backdrop-blur-xl border border-premium-border/50 p-8"
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-black text-white italic">MY <span className="text-premium-gold">STATUS</span></h1>
                    <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-400 border border-red-900/50 px-3 py-1 rounded">LOGOUT</button>
                </div>

                {/* Live Auction Feed */}
                {liveAuction && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 w-full bg-gradient-to-r from-premium-gold to-yellow-600 p-1 rounded-lg animate-pulse"
                    >
                        <div className="bg-black p-4 rounded text-center">
                            <h3 className="text-premium-gold font-bold text-xl animate-bounce tracking-tighter uppercase">Live Auction Arena</h3>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="border-r border-gray-800">
                                    <p className="text-gray-400 text-[10px] uppercase">Base Price</p>
                                    <p className="text-xl font-mono font-bold text-white italic">₹{liveAuction.currentPlayer?.basePrice || 0}L</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase">Current Price</p>
                                    <p className="text-xl font-mono font-bold text-premium-gold italic">₹{liveAuction.highestBid === 0 ? liveAuction.currentPlayer?.basePrice : liveAuction.highestBid}L</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest">
                                {liveAuction.highestBidderName ? `Highest Bidder: ${liveAuction.highestBidderName}` : 'Waiting for first bid...'}
                            </p>
                        </div>
                    </motion.div>
                )}

                {playerData && (
                    <div
                        className="bg-gradient-to-br from-gray-900 to-black border border-premium-border rounded-xl p-6 text-center"
                    >
                        <h2 className="text-2xl font-bold mb-2">{playerData.name}</h2>
                        <p className="text-sm opacity-50 mb-6 uppercase tracking-widest">{playerData.role}</p>

                        <div className="py-4 border-t border-b border-gray-800 mb-6 flex justify-between px-4">
                            <div className="text-left">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Current Status</p>
                                <div className={`text-xl font-black italic uppercase ${playerData.status === 'sold' ? 'text-green-500' :
                                    playerData.status === 'unsold' ? 'text-red-500' : 'text-yellow-500'
                                    }`}>
                                    {playerData.status}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Base Price</p>
                                <div className="text-xl font-black italic text-white font-mono">
                                    ₹{playerData.basePrice || 0} L
                                </div>
                            </div>
                        </div>

                        {playerData.status === 'sold' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Sold To</p>
                                    <p className="text-lg font-bold text-premium-gold">{playerData.team?.name || 'Processing...'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Sold Price</p>
                                    <p className="text-lg font-bold text-white font-mono">₹{playerData.soldPrice} L</p>
                                </div>
                            </div>
                        )}

                        {playerData.status === 'pending' && (
                            <p className="text-sm text-gray-400">Your application is currently under review by the admin.</p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PlayerStatus;
