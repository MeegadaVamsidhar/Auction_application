import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// import Login from './pages/Login'; // Deprecated
import AuctionArena from './pages/AuctionArena';
import PlayerRegistration from './pages/PlayerRegistration';
import AdminDashboard from './pages/AdminDashboard';
import CaptainDashboard from './pages/CaptainDashboard';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import PlayerLogin from './pages/PlayerLogin';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import CaptainLogin from './pages/CaptainLogin';
import CaptainRegister from './pages/CaptainRegister';
import Register from './pages/Register';
import PlayerStatus from './pages/PlayerStatus';
import TeamRegistration from './pages/TeamRegistration';
import ManagePlayers from './pages/ManagePlayers';
import ManageTeams from './pages/ManageTeams';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />

                    {/* Player Routes */}
                    <Route path="/player-login" element={<PlayerLogin />} />
                    <Route path="/player-registration" element={<PlayerRegistration />} />
                    <Route path="/player" element={<PlayerStatus />} />

                    {/* Admin Routes */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin-register" element={<AdminRegister />} />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute roles={['admin']}>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/players"
                        element={
                            <PrivateRoute roles={['admin']}>
                                <ManagePlayers />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/teams"
                        element={
                            <PrivateRoute roles={['admin']}>
                                <ManageTeams />
                            </PrivateRoute>
                        }
                    />

                    {/* Captain Routes */}
                    <Route path="/captain-login" element={<CaptainLogin />} />
                    <Route path="/captain-register" element={<CaptainRegister />} />
                    <Route path="/team-registration" element={<TeamRegistration />} />
                    <Route path="/register" element={<Register />} /> {/* Old generic register kept for fallback if needed */}
                    <Route
                        path="/captain"
                        element={
                            <PrivateRoute roles={['captain']}>
                                <CaptainDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Live Auction */}
                    <Route path="/live" element={<AuctionArena />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
