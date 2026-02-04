import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import API_URL from '../config';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'admin'
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/auth/register`, formData);
            alert('Admin Account Created! Please check your email for approval confirmation.');
            navigate('/admin-login');
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden p-4">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card w-full max-w-md relative z-10 p-8 border border-red-500/30 backdrop-blur-md"
            >
                <h1 className="text-3xl font-black text-white mb-2 text-center italic">ADMIN <span className="text-red-500">REGISTRATION</span></h1>
                <p className="text-center text-gray-400 mb-8 text-sm">Create New Admin Access</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-red-500 outline-none text-white focus:bg-black/60"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-red-500 outline-none text-white focus:bg-black/60"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-red-500 outline-none text-white focus:bg-black/60"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold tracking-wide mt-2 shadow-lg shadow-red-900/20">
                        CREATE ADMIN
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/admin-login" className="text-sm text-gray-500 hover:text-white transition-colors">
                        Already have an account? <span className="text-red-400">Login here</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminRegister;
