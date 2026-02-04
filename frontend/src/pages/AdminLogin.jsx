import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(username, password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                setError('Access Denied: Not an Admin Account');
                // Optional: Logout if role mismatch
            }
        } catch (err) {
            setError('Invalid Admin Credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden p-4">
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card w-full max-w-md relative z-10 p-8 border border-red-900/30 backdrop-blur-xl bg-black/30"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white italic mb-2">ADMIN <span className="text-red-500">CONTROL</span></h1>
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Username</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-red-500 outline-none text-white focus:bg-black/60"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Password</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-red-500 outline-none text-white focus:bg-black/60"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold tracking-wide mt-2 shadow-lg shadow-red-900/20 transition-all">
                        ACCESS DASHBOARD
                    </button>

                    <div className="text-center mt-6 space-y-2">
                        <Link to="/admin-register" className="block text-sm text-gray-500 hover:text-red-400 transition-colors">
                            First time Admin? <span className="underline">Create Account</span>
                        </Link>
                        <Link to="/" className="block text-xs text-gray-600 hover:text-white transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
