import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CaptainRegister = () => {
    const [formData, setFormData] = useState({
        mobile: '',
        email: '',
        password: '',
        teamName: '',
        role: 'captain'
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            alert('Captain Account and Team Created! Please Login.');
            navigate('/captain-login');
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden p-4">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card w-full max-w-md relative z-10 p-8 border border-blue-500/30 backdrop-blur-md"
            >
                <h1 className="text-3xl font-black text-white mb-2 text-center italic">TEAM <span className="text-blue-500">REGISTRATION</span></h1>
                <p className="text-center text-gray-400 mb-8 text-sm text-balance">Register your team and captain credentials for the league</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Mobile Number (Login ID)</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. 9876543210"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-blue-500 outline-none text-white focus:bg-black/60 font-mono"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-blue-500 outline-none text-white focus:bg-black/60"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Team Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Royal Strikers"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-blue-500 outline-none text-white focus:bg-black/60 font-black italic"
                            value={formData.teamName}
                            onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-blue-500 outline-none text-white focus:bg-black/60"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold tracking-wide mt-2 shadow-lg shadow-blue-900/20">
                        CREATE CAPTAIN
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/captain-login" className="text-sm text-gray-500 hover:text-white transition-colors">
                        Already have an account? <span className="text-blue-400">Login here</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default CaptainRegister;
