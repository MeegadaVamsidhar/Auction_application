import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const AdminDashboard = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [pendingAdmins, setPendingAdmins] = useState([]);
    const [allAdmins, setAllAdmins] = useState([]);
    const [bidIncrement, setBidIncrement] = useState(20);
    const [liveAuction, setLiveAuction] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [playerListLink, setPlayerListLink] = useState('');
    const [savedPlayerListLink, setSavedPlayerListLink] = useState('');
    const fileInputRef = useRef(null);
    const socketRef = useRef(null);

    const fetchData = async () => {
        const [playersRes, teamsRes, pendingAdminsRes, allAdminsRes, linkRes] = await Promise.all([
            axios.get('http://localhost:5000/api/admin/players'),
            axios.get('http://localhost:5000/api/admin/teams'),
            axios.get('http://localhost:5000/api/admin/pending-admins'),
            axios.get('http://localhost:5000/api/admin/all-admins'),
            axios.get('http://localhost:5000/api/admin/settings/player-list-link')
        ]);
        setPlayers(playersRes.data);
        setTeams(teamsRes.data);
        setPendingAdmins(pendingAdminsRes.data || []);
        setAllAdmins(allAdminsRes.data || []);
        if (linkRes.data.link) {
            setSavedPlayerListLink(linkRes.data.link);
            setPlayerListLink(linkRes.data.link);
        }
    };

    const savePlayerListLink = async () => {
        try {
            await axios.post('http://localhost:5000/api/admin/settings/player-list-link', { link: playerListLink });
            setSavedPlayerListLink(playerListLink);
            alert('Link saved successfully!');
        } catch (err) {
            alert('Error saving link');
        }
    };

    useEffect(() => {
        fetchData();
        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('auctionUpdate', (data) => {
            setLiveAuction(data.isActive ? data : null);
        });

        socketRef.current.on('playerSold', () => {
            fetchData(); // Refresh lists
        });

        socketRef.current.on('playerUnsold', () => {
            fetchData();
        });

        return () => socketRef.current.disconnect();
    }, []);

    const handlePlayerStatus = async (id, status) => {
        await axios.patch(`http://localhost:5000/api/admin/players/${id}/status`, { status });
        fetchData();
    };

    const handleTeamStatus = async (id, status) => {
        await axios.patch(`http://localhost:5000/api/admin/teams/${id}/status`, { status });
        fetchData();
    };

    const handleBasePriceUpdate = async (id, basePrice) => {
        try {
            await axios.patch(`http://localhost:5000/api/admin/players/${id}/base-price`, { basePrice });
            fetchData();
        } catch (err) {
            alert("Error updating base price");
        }
    };

    const startAuction = (player) => {
        socketRef.current.emit('startAuction', { player, bidIncreaseAmount: bidIncrement });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/admin/upload-players', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(res.data.message);
            fetchData();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Error uploading file");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const sellPlayer = () => {
        if (confirm("Are you sure you want to SELL this player?")) {
            socketRef.current.emit('sellPlayer');
        }
    }

    const markUnsold = () => {
        if (confirm("Mark player as UNSOLD?")) {
            socketRef.current.emit('markUnsold');
        }
    }

    const handleAdminApproval = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/admin/approve-admin/${id}`);
            alert('Admin Approved and email sent!');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || "Error approving admin");
        }
    };

    return (
        <div className="min-h-screen bg-premium-dark p-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-premium-gold italic uppercase tracking-widest">Control Center</h1>
                <div className="space-x-4">
                    <Link to="/admin/players" className="text-sm font-bold text-white hover:text-premium-gold uppercase tracking-wider border border-white/20 px-4 py-2 rounded hover:border-premium-gold/50 transition-all">Manage Players</Link>
                    <Link to="/admin/teams" className="text-sm font-bold text-white hover:text-premium-gold uppercase tracking-wider border border-white/20 px-4 py-2 rounded hover:border-premium-gold/50 transition-all">Manage Teams</Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* LEFT: Player Pool (4 cols) */}
                <div className="md:col-span-4 space-y-4">
                    {/* ... Existing Left Content ... */}
                    <div className="premium-card p-4 h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                            <h2 className="text-xl font-bold">PLAYER POOL</h2>
                            <div className="flex items-center gap-1 text-xs">
                                <span className="opacity-60">Inc(L):</span>
                                <input
                                    type="number"
                                    value={bidIncrement}
                                    onChange={e => setBidIncrement(e.target.value)}
                                    className="w-12 bg-black/50 border border-premium-border rounded p-1 text-center"
                                />
                            </div>
                        </div>

                        {/* Excel Upload Section */}
                        <div className="mb-4 p-3 bg-premium-gold/5 border border-premium-gold/20 rounded-lg">
                            <p className="text-[10px] font-bold text-premium-gold uppercase mb-2">Bulk Player Upload (Excel)</p>
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={uploading}
                                    className="flex-1 bg-premium-gold text-black text-[10px] font-bold py-2 rounded hover:bg-yellow-400 disabled:opacity-50"
                                >
                                    {uploading ? 'UPLOADING...' : 'CHOOSE EXCEL FILE'}
                                </button>
                            </div>
                            <p className="text-[8px] opacity-40 mt-1 italic font-mono">Columns: Name, Mobile, Year, PreviousTeams, Role, Dept</p>
                        </div>

                        {/* Player Source Link Section */}
                        <div className="mb-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <p className="text-[10px] font-bold text-blue-400 uppercase mb-2">Reference Player List (Google Sheet)</p>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={playerListLink}
                                    onChange={(e) => setPlayerListLink(e.target.value)}
                                    placeholder="Paste URL here..."
                                    className="flex-1 bg-black/50 border border-blue-500/30 rounded px-2 py-1 text-[10px] text-white focus:border-blue-500 outline-none"
                                />
                                <button
                                    onClick={savePlayerListLink}
                                    className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-blue-500"
                                >
                                    SAVE
                                </button>
                            </div>
                            {savedPlayerListLink && (
                                <a
                                    href={savedPlayerListLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-center bg-blue-500/10 text-blue-300 text-[10px] py-1.5 rounded border border-blue-500/30 hover:bg-blue-500/20 truncate px-2"
                                >
                                    OPEN REFERENCE SHEET ↗
                                </a>
                            )}
                        </div>

                        <div className="overflow-y-auto pr-2 space-y-3 flex-1">
                            {players.map(player => (
                                <div key={player._id} className="bg-black/30 p-3 rounded border border-gray-800 hover:border-premium-gold/50 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-sm">{player.name}</p>
                                            <p className="text-[10px] uppercase opacity-50">{player.role} | {player.dept}</p>
                                            {player.previousTeams && <p className="text-[8px] opacity-40">Prev: {player.previousTeams}</p>}
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${player.status === 'sold' ? 'text-green-500 bg-green-500/10' :
                                                player.status === 'unsold' ? 'text-red-500 bg-red-500/10' :
                                                    player.status === 'approved' ? 'text-premium-gold bg-yellow-500/10' : 'text-gray-500 bg-gray-800'
                                                }`}>
                                                {player.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-3 space-y-2">
                                        {player.status !== 'sold' && (
                                            <div className="flex gap-2 items-center">
                                                <div className="flex-1 flex items-center bg-black/50 border border-gray-800 rounded px-2">
                                                    <span className="text-[10px] opacity-40 mr-1">₹</span>
                                                    <input
                                                        type="number"
                                                        defaultValue={player.basePrice}
                                                        onBlur={(e) => handleBasePriceUpdate(player._id, e.target.value)}
                                                        className="w-full bg-transparent text-xs py-1 outline-none font-mono"
                                                        placeholder="Base"
                                                    />
                                                    <span className="text-[10px] opacity-40 ml-1">L</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            {player.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handlePlayerStatus(player._id, 'approved')} className="flex-1 bg-green-900/50 hover:bg-green-800 text-[10px] py-1 rounded border border-green-800 relative z-10 text-green-200">Approve</button>
                                                    <button onClick={() => handlePlayerStatus(player._id, 'rejected')} className="flex-1 bg-red-900/50 hover:bg-red-800 text-[10px] py-1 rounded border border-red-800 relative z-10 text-red-200">Reject</button>
                                                </>
                                            )}
                                            {(player.status === 'approved' || player.status === 'unsold') && !liveAuction && (
                                                <button onClick={() => startAuction(player)} className="w-full bg-premium-gold text-black text-xs font-bold py-1.5 rounded hover:bg-yellow-400">START AUCTION</button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sold Details */}
                                    {player.status === 'sold' && (
                                        <div className="mt-2 text-[10px] bg-black/40 p-1.5 rounded flex justify-between">
                                            <span className="opacity-60">Sold Price: <span className="text-white font-mono">₹{player.soldPrice}L</span></span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MIDDLE: Live Auction Control (4 cols) */}
                <div className="md:col-span-4">
                    <div className="premium-card p-6 h-[80vh] flex flex-col relative">
                        <h2 className="text-xl font-bold mb-6 text-center border-b border-gray-800 pb-4">LIVE AUCTION</h2>

                        {liveAuction ? (
                            <div className="flex-1 flex flex-col">
                                <div className="text-center mb-8">
                                    <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 border-2 border-premium-gold flex items-center justify-center">
                                        <span className="text-3xl font-black">{liveAuction.currentPlayer?.name?.charAt(0)}</span>
                                    </div>
                                    <h3 className="text-2xl font-black italic">{liveAuction.currentPlayer?.name}</h3>
                                    <p className="text-sm opacity-50">{liveAuction.currentPlayer?.role} | Base: ₹{liveAuction.currentPlayer?.basePrice}L</p>
                                    {liveAuction.currentPlayer?.previousTeams && <p className="text-xs text-premium-gold mt-1">Prev: {liveAuction.currentPlayer.previousTeams}</p>}
                                </div>

                                <div className="bg-black/40 p-4 rounded-xl border border-gray-700 text-center mb-6">
                                    <p className="text-xs opacity-50 uppercase mb-1">Current Highest Bid</p>
                                    <p className="text-4xl font-mono font-black text-white mb-2">₹{liveAuction.highestBid}L</p>
                                    <p className="text-premium-gold font-bold text-sm">
                                        {liveAuction.highestBidderName ? `Held by: ${liveAuction.highestBidderName}` : 'Waiting for bids...'}
                                    </p>
                                    <div className="mt-4 text-xs font-mono text-gray-500">Timer: {liveAuction.timer}s</div>
                                </div>

                                {/* Bid Log */}
                                <div className="flex-1 overflow-y-auto bg-black/20 rounded p-2 mb-4 text-xs font-mono space-y-1">
                                    {liveAuction.bidHistory?.map((log, i) => (
                                        <div key={i} className="flex justify-between text-gray-400">
                                            <span>{log.teamName}</span>
                                            <span className="text-white">₹{log.amount}L</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Admin Controls */}
                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <button onClick={sellPlayer} disabled={!liveAuction.highestBidder} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                                        SOLD
                                    </button>
                                    <button onClick={markUnsold} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded">
                                        UNSOLD
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center">
                                <div className="text-4xl mb-4">🔲</div>
                                <p>Select an 'Approved' player from the pool to start the auction.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Team Overview (4 cols) */}
                <div className="md:col-span-4">
                    <div className="premium-card p-4 h-[80vh] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">TEAMS & ADMINS</h2>
                        <div className="overflow-y-auto space-y-4 flex-1 pr-2">

                            {/* PENDING ADMINS */}
                            {pendingAdmins.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                        Pending Admin Approvals
                                    </h3>
                                    <div className="space-y-2">
                                        {pendingAdmins.map(admin => (
                                            <div key={admin._id} className="bg-red-500/5 border border-red-500/30 p-3 rounded-lg flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-sm">{admin.username}</p>
                                                    <p className="text-[10px] opacity-60">{admin.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleAdminApproval(admin._id)}
                                                    className="bg-red-500 text-white text-[10px] py-1 px-3 rounded font-bold hover:bg-red-600"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="my-4 border-b border-gray-800"></div>
                                </div>
                            )}

                            {/* APPROVED ADMINS */}
                            <div className="mb-6">
                                <h3 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    System Admins
                                </h3>
                                <div className="space-y-2">
                                    {allAdmins.filter(a => a.isApproved).map(admin => (
                                        <div key={admin._id} className="bg-green-500/5 border border-green-500/30 p-2 rounded flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-xs">{admin.username}</p>
                                                <p className="text-[10px] opacity-60">{admin.mobile}</p>
                                            </div>
                                            <span className="text-[8px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold uppercase">Active</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="my-4 border-b border-gray-800"></div>
                            </div>

                            {/* Pending Teams Section */}
                            {teams.some(team => !team.status || team.status === 'pending') && (
                                <div className="mb-6">
                                    <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>
                                        Pending Approval
                                    </h3>
                                    <div className="space-y-2">
                                        {teams.filter(t => !t.status || t.status === 'pending').map(team => (
                                            <div key={team._id} className="bg-yellow-500/5 border border-yellow-500/30 p-3 rounded-lg">
                                                <p className="font-bold text-sm mb-2">{team.name}</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleTeamStatus(team._id, 'approved')}
                                                        className="flex-1 bg-yellow-500 text-black text-[10px] py-1 rounded font-bold hover:bg-yellow-400"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleTeamStatus(team._id, 'rejected')}
                                                        className="flex-1 bg-red-900/50 text-red-200 text-[10px] py-1 rounded border border-red-800"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="my-4 border-b border-gray-800"></div>
                                </div>
                            )}

                            {/* Active Teams Section */}
                            {teams.filter(t => t.status === 'approved' || t.status === 'rejected').map(team => (
                                <div key={team._id} className="bg-black/30 p-3 rounded border border-gray-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{team.name}</span>
                                            <span className={`text-[9px] uppercase font-bold ${team.status === 'approved' ? 'text-green-500' : team.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                                                {team.status}
                                            </span>
                                        </div>
                                        {team.status === 'approved' && (
                                            <span className="text-premium-gold font-mono text-sm">Rem: ₹{team.remainingPurse}L</span>
                                        )}
                                    </div>

                                    {team.status === 'approved' && (
                                        <>
                                            <div className="w-full bg-gray-800 h-1.5 rounded-full mb-3">
                                                <div className="bg-premium-gold h-1.5 rounded-full" style={{ width: `${(team.remainingPurse / team.initialPurse) * 100}%` }}></div>
                                            </div>

                                            {/* Players List */}
                                            <div className="bg-black/20 p-2 rounded">
                                                <p className="text-[10px] font-bold opacity-50 uppercase mb-2">Players ({team.players?.length})</p>
                                                <div className="space-y-1">
                                                    {team.players?.map(p => (
                                                        <div key={p._id} className="flex justify-between text-[10px] text-gray-400 border-b border-gray-800/50 pb-0.5">
                                                            <span>{p.name}</span>
                                                            <span className="text-white font-mono">₹{p.soldPrice}L</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {team.status === 'rejected' && (
                                        <p className="text-[10px] text-gray-500 italic">This team has been rejected.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
