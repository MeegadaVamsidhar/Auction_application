import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TeamRegistration = () => {
    const [teamName, setTeamName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/captain-login');
            return;
        }
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'captain') {
            navigate('/');
            return;
        }
        setUser(parsedUser);
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/auth/create-team', {
                userId: user.id || user._id,
                teamName
            });

            alert('Team registered successfully! Waiting for admin approval.');

            // Refresh user data
            const statusRes = await axios.get(`http://localhost:5000/api/auth/captain-status/${user.id || user._id}`);
            if (statusRes.data.hasTeam && statusRes.data.team) {
                user.team = statusRes.data.team._id;
                localStorage.setItem('user', JSON.stringify(user));
            }

            navigate('/captain');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to register team');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden p-4">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card w-full max-w-md relative z-10 p-8 border border-blue-500/30 backdrop-blur-md"
            >
                <h1 className="text-3xl font-black text-white mb-2 text-center italic">
                    REGISTER YOUR <span className="text-blue-500">TEAM</span>
                </h1>
                <p className="text-center text-gray-400 mb-2 text-sm">
                    Welcome, <span className="text-white font-bold">{user.username}</span>
                </p>
                <p className="text-center text-gray-500 mb-8 text-xs">
                    Create your team to participate in the auction
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">
                            Team Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Royal Strikers"
                            className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-blue-500 outline-none text-white focus:bg-black/60 font-black italic"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-600/30 rounded p-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="bg-blue-900/20 border border-blue-600/30 rounded p-4">
                        <p className="text-blue-300 text-xs">
                            ℹ️ Your team will be pending admin approval after registration. You'll be able to access the dashboard once approved.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold tracking-wide mt-2 shadow-lg shadow-blue-900/20"
                    >
                        {loading ? 'CREATING TEAM...' : 'CREATE TEAM'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/captain')}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default TeamRegistration;
