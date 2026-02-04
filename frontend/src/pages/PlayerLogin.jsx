import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import API_URL from '../config';

const PlayerLogin = () => {
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError('');
            // Verify if player exists
            const res = await axios.post(`${API_URL}/api/players/login`, { mobile });
            if (res.data && res.data.player) {
                // Store player info in local storage
                localStorage.setItem('currentPlayer', JSON.stringify(res.data.player));
                navigate('/player');
            }
        } catch (err) {
            setError('Invalid Mobile Number.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden p-4">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-premium-gold/10 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card w-full max-w-md relative z-10 p-8 border border-premium-border/50 backdrop-blur-xl bg-black/30"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white italic mb-2">PLAYER <span className="text-premium-gold">STATUS</span></h1>
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Enter mobile number to view status</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Mobile Number</label>
                        <input
                            type="tel"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-premium-gold outline-none text-white focus:bg-black/60 font-mono"
                            placeholder="Enter registered mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full btn-gold py-4 text-lg font-bold tracking-wide mt-2">
                        CHECK STATUS
                    </button>

                    <div className="text-center mt-6 space-y-2">
                        <Link to="/player-registration" className="block text-sm text-gray-500 hover:text-premium-gold transition-colors">
                            New Player? <span className="underline">Register Here</span>
                        </Link>
                        <Link to="/" className="block text-xs text-gray-600 hover:text-white transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div >
    );
};

export default PlayerLogin;
