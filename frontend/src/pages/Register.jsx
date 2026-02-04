import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import API_URL from '../config';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'captain' // Default role
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, formData);
            alert(response.data.message || 'Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden p-4">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-premium-gold/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card w-full max-w-md relative z-10 p-8 border border-premium-border/50 backdrop-blur-md"
            >
                <h1 className="text-4xl font-black text-white mb-2 text-center italic tracking-tighter">
                    JOIN THE <span className="text-premium-gold">AUCTION</span>
                </h1>
                <p className="text-center text-gray-400 mb-8 text-sm">Create your account to participate</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Username</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-premium-gold outline-none text-white transition-all focus:bg-black/60"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-premium-gold outline-none text-white transition-all focus:bg-black/60"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Password</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-premium-gold outline-none text-white transition-all focus:bg-black/60"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Role</label>
                        <select
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-premium-gold outline-none text-white transition-all focus:bg-black/60 appearance-none"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="captain">Team Captain</option>
                            <option value="admin">Auction Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full btn-gold py-4 text-lg mt-4 shadow-lg shadow-premium-gold/20 hover:shadow-premium-gold/40">
                        REGISTER ACCOUNT
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-premium-gold hover:underline">Login here</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
