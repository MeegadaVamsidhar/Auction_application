import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import { Trophy, Clock, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const socket = io('http://localhost:5000');

const AuctionArena = () => {
    const { user, logout } = useContext(AuthContext);
    const [auctionData, setAuctionData] = useState(null);
    const [teams, setTeams] = useState([]);
    const [bidAmount, setBidAmount] = useState(0);

    useEffect(() => {
        socket.on('auctionUpdate', (data) => {
            setAuctionData(data);
            if (data && data.highestBid !== undefined) {
                // Calculate next bid: Highest Bid + Increment (or Base Price if no bid yet)
                const nextBid = data.highestBid === 0 ? (data.currentPlayer?.basePrice || 0) : data.highestBid + (data.bidIncreaseAmount || 20);
                setBidAmount(nextBid);
            }
        });

        return () => socket.off('auctionUpdate');
    }, []);

    const handleBid = () => {
        // In a real app, teamId would come from the logged-in captain's user object
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'captain' && user.team) {
            socket.emit('placeBid', { teamId: user.team, bidAmount });
        } else {
            alert('Only captains can bid!');
        }
    };

    return (
        <div className="min-h-screen bg-premium-dark p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 border-b border-premium-border pb-6 gap-4">
                <h1 className="text-2xl md:text-4xl font-extrabold italic text-premium-gold tracking-tighter text-center md:text-left">
                    LIVE AUCTION <span className="text-white text-lg md:text-xl ml-2 font-normal not-italic block md:inline">ARENA 2026</span>
                </h1>
                <div className="flex items-center gap-6">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-gray-400 uppercase hidden md:inline">{user.username} ({user.role})</span>
                            <button onClick={logout} className="text-xs border border-red-500/50 text-red-500 px-3 py-1 rounded hover:bg-red-500/10 transition-colors">
                                LOGOUT
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="text-sm font-bold text-premium-gold hover:underline">LOGIN</Link>
                    )}
                    <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-premium-border">
                        <Clock className="text-premium-gold w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-xl md:text-2xl font-mono">{auctionData?.timer || 0}s</span>
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
                {/* Center: Current Player Card (First on Mobile) */}
                <div className="order-1 lg:order-2 lg:col-span-6">
                    <AnimatePresence mode="wait">
                        {auctionData?.currentPlayer ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="premium-card bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 md:p-4 bg-premium-gold text-black font-bold skew-x-[-20deg] mr-[-10px] mt-4 pr-6 text-sm md:text-base">
                                    {auctionData.currentPlayer.role.toUpperCase()}
                                </div>
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-2 md:p-4">
                                    <div className="w-full md:w-1/2 aspect-square bg-black/50 rounded-lg flex items-center justify-center border border-premium-border">
                                        <UserIcon size={120} className="text-gray-700 w-24 h-24 md:w-32 md:h-32" />
                                    </div>
                                    <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
                                        <h3 className="text-3xl md:text-5xl font-black mb-2">{auctionData.currentPlayer.name}</h3>
                                        <p className="text-lg md:text-xl opacity-60 mb-6">{auctionData.currentPlayer.dept} | {auctionData.currentPlayer.year} Year</p>

                                        <div className="grid grid-cols-3 gap-2 mb-6 bg-black/30 p-4 rounded-lg border border-premium-border/50 text-center">
                                            <div>
                                                <p className="text-xs opacity-50 uppercase">Matches</p>
                                                <p className="font-mono font-bold">{auctionData.currentPlayer.stats?.matches || '0'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs opacity-50 uppercase">Runs</p>
                                                <p className="font-mono font-bold text-premium-gold">{auctionData.currentPlayer.stats?.runs || '0'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs opacity-50 uppercase">Wickets</p>
                                                <p className="font-mono font-bold">{auctionData.currentPlayer.stats?.wickets || '0'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div>
                                                <p className="text-xs opacity-50 uppercase">Base Price</p>
                                                <p className="text-lg md:text-xl font-mono">₹{auctionData.currentPlayer.basePrice} L</p>
                                            </div>
                                            <div>
                                                <p className="text-xs opacity-50 uppercase">Current Bid</p>
                                                <p className="text-2xl md:text-3xl font-black text-premium-gold font-mono transition-all">
                                                    ₹{auctionData.highestBid} L
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <input
                                                type="number"
                                                className="w-full p-3 md:p-4 bg-black/50 border border-premium-border rounded-lg text-xl md:text-2xl font-mono text-center md:text-left"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(Number(e.target.value))}
                                            />
                                            <button
                                                onClick={handleBid}
                                                className="btn-gold flex-shrink-0 !py-3 !px-8 md:!py-4 md:!px-12 text-lg md:text-xl w-full sm:w-auto"
                                            >
                                                BID
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="premium-card h-[300px] md:h-[400px] flex items-center justify-center">
                                <p className="text-xl md:text-2xl opacity-30 italic text-center px-4">WAITING FOR NEXT PLAYER...</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Left Panel: Teams Stats (Second on Mobile) */}
                <div className="order-3 lg:order-1 lg:col-span-3 space-y-4">
                    <h2 className="text-lg md:text-xl font-bold mb-4 opacity-70 border-b border-gray-700 pb-2 lg:border-none lg:pb-0">TEAM STANDINGS</h2>
                    {/* Placeholder for teams - usually fetched from API */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="premium-card p-4 flex justify-between items-center bg-black/30">
                                <div>
                                    <p className="font-bold text-sm md:text-base">TEAM {i}</p>
                                    <p className="text-xs opacity-50">SQUAD: 8/15</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-premium-gold font-mono text-sm md:text-base">₹85.5 Cr</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Recent Activity (Third on Mobile) */}
                <div className="order-2 lg:order-3 lg:col-span-3 space-y-4">
                    <h2 className="text-lg md:text-xl font-bold mb-4 opacity-70 border-b border-gray-700 pb-2 lg:border-none lg:pb-0">LOGS</h2>
                    <div className="premium-card h-[200px] md:h-[500px] overflow-y-auto space-y-3 font-mono text-xs md:text-sm bg-black/20">
                        <p className="text-green-500">{">> Auction Started"}</p>
                        <p className="text-premium-gold">{">> Virat Kohli up for bidding"}</p>
                        <p className="text-blue-400">{">> CSK bid ₹15.0 Cr"}</p>
                        <p className="text-blue-400">{">> RCB bid ₹15.5 Cr"}</p>
                        <p className="text-blue-400">{">> CSK bid ₹16.0 Cr"}</p>
                        <p className="text-blue-400">{">> MI bid ₹16.5 Cr"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionArena;
