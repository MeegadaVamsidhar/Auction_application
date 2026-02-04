import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import API_URL from '../config';

const PlayerRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        previousTeams: '',
        dept: '',
        year: '',
        role: 'Batsman',
        battingStyle: 'Right-hand',
        bowlingStyle: 'N/A',
        contact: '',
        stats: {
            matches: 0,
            runs: 0,
            wickets: 0
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/players/register`, formData);
            alert('Registration submitted successfully! Good luck for the auction.');
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-premium-dark p-4 md:p-8 flex justify-center items-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-premium-gold/5 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card w-full max-w-2xl p-8 relative z-10 border border-premium-border/50 bg-black/40 backdrop-blur-md"
            >
                <h2 className="text-3xl font-black italic text-premium-gold mb-6 border-b border-premium-border pb-4">PLAYER REGISTRATION</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">Full Name</label>
                            <input type="text" required className="w-full p-3 bg-black/50 border border-premium-border rounded"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">Mobile Number (Login ID)</label>
                            <input type="tel" required className="w-full p-3 bg-black/50 border border-premium-border rounded text-premium-gold font-mono"
                                value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} placeholder="e.g. 9876543210" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">Previous Teams Played For</label>
                            <input type="text" className="w-full p-3 bg-black/50 border border-premium-border rounded"
                                value={formData.previousTeams} onChange={e => setFormData({ ...formData, previousTeams: e.target.value })} placeholder="e.g. Team A, Team B" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">Department</label>
                            <input type="text" required className="w-full p-3 bg-black/50 border border-premium-border rounded"
                                value={formData.dept} onChange={e => setFormData({ ...formData, dept: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">Year</label>
                            <select className="w-full p-3 bg-black/50 border border-premium-border rounded"
                                value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                                <option value="">Select Year</option>
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">Role</label>
                            <select className="w-full p-3 bg-black/50 border border-premium-border rounded"
                                value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option>Batsman</option>
                                <option>Bowler</option>
                                <option>All Rounder</option>
                                <option>Wicket-keeper</option>
                            </select>
                        </div>
                    </div>

                    {/* Section 2: Cricketing Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Batting Style</label>
                            <select className="w-full p-3 bg-black/50 border border-premium-border rounded focus:border-premium-gold outline-none text-white"
                                value={formData.battingStyle}
                                onChange={e => setFormData({ ...formData, battingStyle: e.target.value })}>
                                <option>Right-hand</option><option>Left-hand</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Bowling Style</label>
                            <input
                                type="text"
                                placeholder="e.g. Right-arm Fast"
                                className="w-full p-3 bg-black/50 border border-premium-border rounded focus:border-premium-gold outline-none text-white"
                                value={formData.bowlingStyle}
                                onChange={e => setFormData({ ...formData, bowlingStyle: e.target.value })}
                            />
                        </div>
                    </div>


                    {/* Section 3: Stats */}
                    <div>
                        <h3 className="text-premium-gold font-bold uppercase tracking-wider mb-4 border-b border-gray-800 pb-2">Previous Stats (Optional)</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Matches</label>
                                <input type="number" className="w-full p-3 bg-black/50 border border-premium-border rounded focus:border-premium-gold outline-none text-white"
                                    onChange={e => setFormData({ ...formData, stats: { ...formData.stats, matches: e.target.value } })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Runs</label>
                                <input type="number" className="w-full p-3 bg-black/50 border border-premium-border rounded focus:border-premium-gold outline-none text-white"
                                    onChange={e => setFormData({ ...formData, stats: { ...formData.stats, runs: e.target.value } })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Wickets</label>
                                <input type="number" className="w-full p-3 bg-black/50 border border-premium-border rounded focus:border-premium-gold outline-none text-white"
                                    onChange={e => setFormData({ ...formData, stats: { ...formData.stats, wickets: e.target.value } })} />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full btn-gold py-4 text-xl font-black italic shadow-lg shadow-premium-gold/20 hover:scale-[1.02] transition-transform">
                        SUBMIT REGISTRATION
                    </button>
                </form>
            </motion.div>
        </div >
    );
};

export default PlayerRegistration;
