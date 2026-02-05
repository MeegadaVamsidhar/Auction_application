import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const CaptainLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Passing mobile as the first argument, which auth context might expect as 'username' or 'identifier'
      const user = await login(mobile, password);
      if (user.role === "captain") {
        navigate("/captain");
      } else {
        setError("Access Denied: Not a Captain Account");
      }
    } catch (err) {
      setError("Invalid Captain Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-premium-dark relative overflow-hidden p-4">
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card w-full max-w-md relative z-10 p-8 border border-blue-900/30 backdrop-blur-xl bg-black/30"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white italic mb-2">
            CAPTAIN <span className="text-blue-500">ACCESS</span>
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            Team Management Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-blue-500 outline-none text-white focus:bg-black/60 font-mono"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">
              Password
            </label>
            <input
              type="password"
              className="w-full p-4 bg-black/40 border border-premium-border rounded-lg focus:border-blue-500 outline-none text-white focus:bg-black/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold tracking-wide mt-2 shadow-lg shadow-blue-900/20 transition-all"
          >
            LOGIN TO SQUAD
          </button>

          <div className="text-center mt-6 space-y-2">
            <Link
              to="/captain-register"
              className="block text-sm text-gray-500 hover:text-white transition-colors"
            >
              Need a Captain Account?{" "}
              <span className="text-blue-400">Register</span>
            </Link>
            <Link
              to="/"
              className="block text-xs text-gray-600 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CaptainLogin;
