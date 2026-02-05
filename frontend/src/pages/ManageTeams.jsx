import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import API_URL from '../config';

const ManageTeams = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        initialPurse: 8000,
        status: 'approved'
    });

    const formatPrice = (value) => {
        if (!value && value !== 0) return '₹0 L';
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

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this team?')) {
            try {
                await axios.delete(`${API_URL}/api/admin/teams/${id}`);
                fetchTeams();
            } catch (err) {
                alert('Error deleting team');
            }
        }
    };

    const handleEdit = (team) => {
        setEditingTeam(team);
        setFormData({
            name: team.name,
            initialPurse: team.initialPurse,
            status: team.status
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTeam) {
                await axios.put(`${API_URL}/api/admin/teams/${editingTeam._id}`, formData);
            } else {
                await axios.post(`${API_URL}/api/admin/teams`, formData);
            }
            setShowModal(false);
            setEditingTeam(null);
            setFormData({ name: '', initialPurse: 8000, status: 'approved' });
            fetchTeams();
        } catch (err) {
            alert(err.response?.data?.error || 'Error saving team');
        }
    };

    return (
        <div className="min-h-screen bg-premium-dark p-8 text-white">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-premium-gold italic uppercase tracking-widest">Manage Teams</h1>
                <button onClick={() => navigate('/admin')} className="text-sm text-gray-400 hover:text-white">Back to Dashboard</button>
            </div>

            <button
                onClick={() => { setEditingTeam(null); setFormData({ name: '', initialPurse: 8000, status: 'approved' }); setShowModal(true); }}
                className="btn-gold mb-6 py-2 px-4 text-xs"
            >
                + Add New Team
            </button>

            <div className="overflow-x-auto premium-card p-0">
                <table className="w-full text-left">
                    <thead className="bg-black/50 text-premium-gold uppercase text-xs">
                        <tr>
                            <th className="p-4">Team Name</th>
                            <th className="p-4">Captain</th>
                            <th className="p-4">Players</th>
                            <th className="p-4">Purse (Rem/Init)</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                        {teams.map(team => (
                            <tr key={team._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold">{team.name}</td>
                                <td className="p-4">{team.captain ? team.captain.username : <span className="opacity-50 italic">None</span>}</td>
                                <td className="p-4">{team.players ? team.players.length : 0}</td>
                                <td className="p-4 font-mono">{formatPrice(team.remainingPurse)} / {formatPrice(team.initialPurse)}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${team.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                        team.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                        }`}>{team.status}</span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleEdit(team)} className="text-yellow-500 hover:text-yellow-400">Edit</button>
                                    <button onClick={() => handleDelete(team._id)} className="text-red-500 hover:text-red-400">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="premium-card w-full max-w-md relative animate-float">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                        <h2 className="text-xl font-bold mb-4 text-premium-gold">{editingTeam ? 'Edit Team' : 'Add New Team'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-400 mb-1">Team Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" />
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-gray-400 mb-1">Initial Purse (Lakhs)</label>
                                <input type="number" required value={formData.initialPurse} onChange={e => setFormData({ ...formData, initialPurse: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white" />
                            </div>

                            <div>
                                <label className="block text-xs uppercase text-gray-400 mb-1">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white">
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full btn-gold py-2 mt-4">{editingTeam ? 'Update Team' : 'Create Team'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTeams;
