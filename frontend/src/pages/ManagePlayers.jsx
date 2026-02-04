import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import API_URL from '../config';

const ManagePlayers = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        role: 'Batsman',
        dept: '',
        year: '',
        basePrice: 0,
        status: 'approved'
    });

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
        if (confirm('Are you sure you want to delete this player?')) {
            try {
                await axios.delete(`${API_URL}/api/admin/players/${id}`);
                fetchPlayers();
            } catch (err) {
                alert('Error deleting player');
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
            status: player.status
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPlayer) {
                await axios.put(`${API_URL}/api/admin/players/${editingPlayer._id}`, formData);
            } else {
                // For manual add, we use the register endpoint (or a new admin one)
                // Using register endpoint for now, dealing with status separately if needed
                // Note: The register endpoint might default to 'pending'.
                // If we want 'approved', we might need to modify the backend or send 'status' if allowed.
                // Looking at Player.js, status has a default but is not immutable.
                // However, the /players/register endpoint uses `new Player(req.body)`, so it SHOULD accept status if passed!
                await axios.post(`${API_URL}/api/admin/players/register`, formData);
            }
            setShowModal(false);
            setEditingPlayer(null);
            setFormData({ name: '', mobile: '', role: 'Batsman', dept: '', year: '', basePrice: 0, status: 'approved' });
            fetchPlayers();
        } catch (err) {
            alert(err.response?.data?.error || 'Error saving player');
        }
    };

    return (
        <div className="min-h-screen bg-premium-dark p-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-premium-gold italic uppercase tracking-widest">Manage Players</h1>
                <button onClick={() => navigate('/admin')} className="text-sm text-gray-400 hover:text-white">Back to Dashboard</button>
            </div>

            <button
                onClick={() => { setEditingPlayer(null); setFormData({ name: '', mobile: '', role: 'Batsman', dept: '', year: '', basePrice: 0, status: 'approved' }); setShowModal(true); }}
                className="btn-gold mb-6 py-2 px-4 text-xs"
            >
                + Add New Player
            </button>

            <div className="overflow-x-auto premium-card p-0">
                <table className="w-full text-left">
                    <thead className="bg-black/50 text-premium-gold uppercase text-xs">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Dept/Year</th>
                            <th className="p-4">Base Price</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                        {players.map(player => (
                            <tr key={player._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold">{player.name}</td>
                                <td className="p-4">{player.role}</td>
                                <td className="p-4">{player.dept} / {player.year}</td>
                                <td className="p-4 font-mono">₹{player.basePrice}L</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${player.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                        player.status === 'sold' ? 'bg-blue-500/10 text-blue-500' :
                                            'bg-red-500/10 text-red-500'
                                        }`}>{player.status}</span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleEdit(player)} className="text-yellow-500 hover:text-yellow-400">Edit</button>
                                    <button onClick={() => handleDelete(player._id)} className="text-red-500 hover:text-red-400">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="premium-card w-full max-w-lg relative animate-float">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                        <h2 className="text-xl font-bold mb-4 text-premium-gold">{editingPlayer ? 'Edit Player' : 'Add New Player'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-1">Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-1">Mobile</label>
                                    <input required type="text" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-1">Role</label>
                                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white">
                                        <option>Batsman</option>
                                        <option>Bowler</option>
                                        <option>All-rounder</option>
                                        <option>Wicket-keeper</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-1">Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white">
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="sold">Sold</option>
                                        <option value="unsold">Unsold</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-1">Department</label>
                                    <input required type="text" value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-400 mb-1">Year</label>
                                    <input required type="text" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-400 mb-1">Base Price (Lakhs)</label>
                                <input type="number" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" />
                            </div>
                            <button type="submit" className="w-full btn-gold py-2 mt-4">{editingPlayer ? 'Update Player' : 'Create Player'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePlayers;
