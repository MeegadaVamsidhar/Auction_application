import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import API_URL from '../config';

const CaptainDashboard = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liveAuction, setLiveAuction] = useState(null);
    const [nextBidAmount, setNextBidAmount] = useState(0);
    const socketRef = useRef(null);

    const [error, setError] = useState(null);

    const formatPrice = (value) => {
        if (!value && value !== 0) return '₹0 L';
        if (value >= 100) {
            return `₹${(value / 100).toFixed(2)} Cr`;
        }
        return `₹${value} L`;
    };

    const fetchTeamData = async () => {
        try {
            const userData = localStorage.getItem('user');
            console.log("Logged In User Data:", userData);
            if (!userData) {
                setError("No user session found. Please login.");
                setLoading(false);
                return;
            }

            const user = JSON.parse(userData);
            let teamInfo = null;

            // Try fetching by user.team ID first
            if (user.team) {
                try {
                    const res = await axios.get(`${API_URL}/api/admin/teams/${user.team}`);
                    teamInfo = res.data;
                } catch (e) {
                    console.log("Team ID in session failed, trying fallback...");
                }
            }

            // Fallback: Fetch by Captain ID if not found yet
            if (!teamInfo) {
                try {
                    const res = await axios.get(`${API_URL}/api/admin/teams/captain/${user.id || user._id}`);
                    teamInfo = res.data;

                    // Sync localStorage with the found team ID
                    if (teamInfo && teamInfo._id) {
                        user.team = teamInfo._id;
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                } catch (e) {
                    console.error("Fallback finding failed", e);
                }
            }

            if (!teamInfo) {
                setError("No team linked to your account. Please register your team first.");
                setLoading(false);
                return;
            }

            if (teamInfo.status === 'pending') {
                setError("Your Team Registration is pending Admin approval. Please check back later.");
                setLoading(false);
                return;
            } else if (teamInfo.status === 'rejected') {
                setError("Your Team Registration has been rejected by the Admin.");
                setLoading(false);
                return;
            }

            setTeam(teamInfo);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching team data:", err);
            if (err.response?.status === 404) {
                setError("Team not found for this account. Your session might be outdated.");
            } else {
                setError("Connection problem. Your account data might be stale.");
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamData();

        socketRef.current = io(API_URL);

        socketRef.current.on('auctionUpdate', (data) => {
            if (data.isActive) {
                setLiveAuction(data);
                const currentVal = data.highestBid === 0 ? (data.currentPlayer?.basePrice || 0) : data.highestBid;
                const calculatedBid = data.highestBid === 0 ? currentVal : currentVal + (data.bidIncreaseAmount || 5);
                setNextBidAmount(calculatedBid);
            } else {
                setLiveAuction(null);
            }
        });

        socketRef.current.on('playerSold', () => {
            fetchTeamData(); // Update purse/squad instantly
            setLiveAuction(null);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleBid = () => {
        if (team && team._id && socketRef.current && liveAuction) {
            socketRef.current.emit('placeBid', {
                teamId: team._id,
                bidAmount: nextBidAmount
            });
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-premium-dark flex items-center justify-center">
            <div className="text-xl font-black italic text-premium-gold animate-pulse">LOADING SQUAD...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-premium-dark flex flex-col items-center justify-center p-4">
            <div className="premium-card p-8 border border-red-900/50 bg-black/40 text-center max-w-md">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-white mb-2 uppercase">Access Error</h2>
                <p className="text-gray-400 text-sm mb-6">{error}</p>

                {error.includes("No team linked") ? (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-500 mb-4">
                            It looks like you don't have a team registered yet. Please register your team to continue.
                        </p>
                        <button
                            onClick={() => { window.location.href = '/team-registration'; }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded mb-2"
                        >
                            REGISTER TEAM
                        </button>
                        <button
                            onClick={() => { localStorage.clear(); window.location.href = '/captain-login'; }}
                            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded"
                        >
                            BACK TO LOGIN
                        </button>
                    </div>
                ) : error.includes("pending") ? (
                    <div className="space-y-3">
                        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded p-4 mb-4">
                            <p className="text-yellow-400 text-xs">
                                ⏳ Your team registration is awaiting admin approval. You'll be able to access the dashboard once approved.
                            </p>
                        </div>
                        <button
                            onClick={() => { fetchTeamData(); }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded mb-2"
                        >
                            CHECK STATUS AGAIN
                        </button>
                        <button
                            onClick={() => { localStorage.clear(); window.location.href = '/captain-login'; }}
                            className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded"
                        >
                            LOGOUT
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/captain-login'; }}
                        className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded"
                    >
                        BACK TO LOGIN
                    </button>
                )}
            </div>
        </div>
    );

    if (!team) return (
        <div className="min-h-screen bg-premium-dark flex items-center justify-center text-white">
            Portal Unavailable
        </div>
    );

    return (
        <div className="min-h-screen bg-premium-dark p-4 md:p-6 text-white grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Logout Button - Fixed Top Right */}
            <button
                onClick={() => {
                    if (confirm('Are you sure you want to logout?')) {
                        localStorage.clear();
                        window.location.href = '/captain-login';
                    }
                }}
                className="fixed top-4 right-4 z-50 bg-red-600/20 hover:bg-red-600 border border-red-600/50 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
                LOGOUT
            </button>

            {/* LEFT COLUMN: Squad & Stats */}
            <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
                {/* Header Info */}
                <div className="premium-card p-6 border-l-4 border-premium-gold">
                    <h1 className="text-2xl font-black italic uppercase text-white mb-1">{team.name}</h1>
                    <p className="text-xs opacity-50 uppercase tracking-widest mb-4">Captain Dashboard</p>
                    <div className="flex justify-between items-end border-t border-gray-800 pt-4">
                        <div>
                            <p className="text-xs opacity-50 uppercase">Purse Remaining</p>
                            <p className="text-3xl font-mono font-bold text-green-400">{formatPrice(team.remainingPurse)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs opacity-50 uppercase">Squad</p>
                            <p className="text-xl font-bold">{team.players?.length || 0}/{team.maxPlayers}</p>
                        </div>
                    </div>
                </div>

                {/* Squad List */}
                <div className="premium-card p-4 h-[600px] overflow-y-auto">
                    <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2 bg-black/50 p-2 sticky top-0">YOUR SQUAD</h3>
                    <div className="space-y-3">
                        {team.players && team.players.map((player) => (
                            <div key={player._id} className="bg-black/30 p-3 rounded border border-gray-800 flex justify-between items-center group hover:border-premium-gold/30 transition-all">
                                <div>
                                    <p className="font-bold text-sm">{player.name}</p>
                                    <p className="text-[10px] uppercase opacity-50">{player.role}</p>
                                    <div className="flex gap-2 text-[10px] text-gray-400 mt-1">
                                        <span>M:{player.stats?.matches || 0}</span>
                                        <span>R:{player.stats?.runs || 0}</span>
                                        <span>W:{player.stats?.wickets || 0}</span>
                                    </div>
                                </div>
                                <p className="font-mono text-premium-gold font-bold">{formatPrice(player.soldPrice)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Live Auction Arena */}
            <div className="lg:col-span-2 order-1 lg:order-2">
                {liveAuction ? (
                    <div className="premium-card h-full flex flex-col relative overflow-hidden border-2 border-premium-gold/20">
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 animate-pulse">LIVE</div>

                        {/* Player Info */}
                        <div className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-800">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-800 rounded-full flex items-center justify-center border-2 border-premium-gold shadow-lg shadow-premium-gold/20 flex-shrink-0">
                                <span className="text-4xl font-black text-white">{liveAuction.currentPlayer?.name?.charAt(0)}</span>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">{liveAuction.currentPlayer?.name}</h2>
                                <p className="text-lg opacity-60 mb-1">{liveAuction.currentPlayer?.role} | {liveAuction.currentPlayer?.dept} | Year: {liveAuction.currentPlayer?.year}</p>
                                {liveAuction.currentPlayer?.previousTeams && (
                                    <p className="text-premium-gold font-bold text-sm mb-1 uppercase tracking-tight">Prev Teams: {liveAuction.currentPlayer.previousTeams}</p>
                                )}
                                <p className="text-premium-gold font-black italic mb-4">BASE PRICE: {formatPrice(liveAuction.currentPlayer?.basePrice)}</p>
                                <div className="flex gap-4 text-sm font-mono text-gray-400">
                                    <span className="bg-black/40 px-3 py-1 rounded">Matches: {liveAuction.currentPlayer?.stats?.matches}</span>
                                    <span className="bg-black/40 px-3 py-1 rounded">Runs: {liveAuction.currentPlayer?.stats?.runs}</span>
                                    <span className="bg-black/40 px-3 py-1 rounded">Wickets: {liveAuction.currentPlayer?.stats?.wickets}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bidding Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 flex-1">
                            {/* Stats/Current Bid */}
                            <div className="p-6 bg-black/20 flex flex-col justify-center items-center border-r border-gray-800">
                                <p className="text-sm opacity-50 uppercase mb-2">Current Price</p>
                                <div className="text-5xl font-black text-white mb-2 font-mono">{formatPrice(liveAuction.highestBid === 0 ? liveAuction.currentPlayer?.basePrice : liveAuction.highestBid)}</div>
                                <p className="text-xs text-gray-400 mb-2 uppercase">
                                    Base Price: <span className="text-white">{formatPrice(liveAuction.currentPlayer?.basePrice)}</span>
                                </p>
                                <p className="text-premium-gold font-bold mb-8 italic">
                                    {liveAuction.highestBidderName ? `Held by: ${liveAuction.highestBidderName}` : 'Waiting for Opening Bid'}
                                </p>

                                {/* Bid Button */}
                                <button
                                    onClick={handleBid}
                                    disabled={team.remainingPurse < nextBidAmount}
                                    className={`w-full max-w-xs py-4 text-xl font-black italic rounded-lg transition-all transform active:scale-95 ${team.remainingPurse < nextBidAmount
                                        ? 'bg-gray-700 cursor-not-allowed opacity-50'
                                        : 'btn-gold shadow-lg shadow-premium-gold/20 hover:shadow-premium-gold/40'
                                        }`}
                                >
                                    {team.remainingPurse < nextBidAmount ? 'INSUFFICIENT FUNDS' : `BID ${formatPrice(nextBidAmount)}`}
                                </button>
                                <p className="text-xs text-gray-500 mt-4">Timer: {liveAuction.timer}s</p>
                            </div>

                            {/* Bid Log */}
                            <div className="p-6 bg-black/40 overflow-y-auto max-h-[400px]">
                                <h4 className="text-xs font-bold opacity-50 uppercase mb-4 sticky top-0 bg-[#121212] py-2">Real-time Activity</h4>
                                <div className="space-y-3 font-mono text-sm">
                                    {liveAuction.bidHistory && liveAuction.bidHistory.map((log, idx) => (
                                        <div key={idx} className="flex justify-between items-center border-b border-gray-800/50 pb-2">
                                            <span className={log.teamName === team.name ? "text-premium-gold font-bold" : "text-gray-300"}>
                                                {log.teamName === team.name ? "YOU" : log.teamName}
                                            </span>
                                            <span className="text-white font-bold">{formatPrice(log.amount)}</span>
                                        </div>
                                    ))}
                                    {(!liveAuction.bidHistory || liveAuction.bidHistory.length === 0) && (
                                        <p className="text-xs opacity-30 italic text-center mt-10">Bidding has started. Waiting for first bid...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="premium-card h-full flex items-center justify-center flex-col opacity-50 p-12 text-center border-dashed border-2 border-gray-700">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">⏳</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">WAITING FOR AUCTION</h2>
                        <p className="max-w-md">The admin has not started the bidding for the next player yet. Review your strategy while you wait.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CaptainDashboard;
