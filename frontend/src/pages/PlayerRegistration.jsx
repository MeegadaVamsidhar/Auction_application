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
        year: '',
        role: ''
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
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">FULL NAME *</label>
                            <input type="text" required className="w-full p-3 bg-black/50 border border-premium-border rounded focus:border-premium-gold outline-none"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">YEAR *</label>
                            <select required className="w-full p-3 bg-black/50 border border-premium-border rounded focus:border-premium-gold outline-none"
                                value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })}>
                                <option value="">Select Year</option>
                                <option value="1ST YEAR">1ST YEAR</option>
                                <option value="2ND YEAR">2ND YEAR</option>
                                <option value="3RD YEAR">3RD YEAR</option>
                                <option value="4TH YEAR">4TH YEAR</option>
                                <option value="MTECH">MTECH</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">ROLE *</label>
                            <select required className="w-full p-3 bg-black/50 border border-premium-border rounded focus:border-premium-gold outline-none"
                                value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="">Select Role</option>
                                <option value="BATSMAN">BATSMAN</option>
                                <option value="BOWLING">BOWLING</option>
                                <option value="BOWLING ALLROUNDER">BOWLING ALLROUNDER</option>
                                <option value="BATTING ALLROUNDER">BATTING ALLROUNDER</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">Phone Number *</label>
                            <input type="tel" required className="w-full p-3 bg-black/50 border border-premium-border rounded text-premium-gold font-mono focus:border-premium-gold outline-none"
                                value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} placeholder="Enter your mobile number" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold opacity-60 mb-2">PREVIOUS TEAM ( If any) *</label>
                            <textarea required className="w-full p-3 bg-black/50 border border-premium-border rounded focus:border-premium-gold outline-none min-h-[100px]"
                                value={formData.previousTeams} onChange={e => setFormData({ ...formData, previousTeams: e.target.value })}
                                placeholder="List previous teams or write 'N/A'" />
                        </div>
                    </div>

                    <div className="pt-4">
                        <p className="text-[10px] text-gray-500 mb-4">* All fields are required as per GULTI 2K26 registration.</p>
                        <button type="submit" className="w-full btn-gold py-4 text-xl font-black italic shadow-lg shadow-premium-gold/20 hover:scale-[1.02] transition-transform">
                            SUBMIT REGISTRATION
                        </button>
                    </div>
                </form>
            </motion.div>
        </div >
    );
};

export default PlayerRegistration;
