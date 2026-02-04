import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden p-4">
            {/* Background Elements */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-premium-gold/5 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card w-full max-w-md relative z-10 p-8 border border-premium-border/50 backdrop-blur-xl bg-black/30"
            >
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2">
                        AUCTION <span className="text-premium-gold">ARENA</span>
                    </h1>
                    <p className="text-gray-400 text-sm tracking-widest uppercase">Official Log In</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Username</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-premium-gold outline-none text-white transition-all focus:bg-black/60"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Password</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-premium-gold outline-none text-white transition-all focus:bg-black/60"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full btn-gold py-4 text-lg font-bold tracking-wide mt-2 shadow-lg shadow-premium-gold/20 hover:shadow-premium-gold/40 hover:-translate-y-1 transition-all">
                        ENTER ARENA
                    </button>

                    <div className="text-center mt-6">
                        <Link to="/register" className="text-sm text-gray-500 hover:text-white transition-colors">
                            Don't have an account? <span className="text-premium-gold">Register here</span>
                        </Link>
                        <div className="mt-4">
                            <Link to="/player-registration" className="text-xs text-gray-500 hover:text-premium-gold transition-colors">
                                Are you a player? <span className="underline">Register for the Auction Pool</span>
                            </Link>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
