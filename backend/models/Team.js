const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String },
    initialPurse: { type: Number, required: true },
    remainingPurse: { type: Number, required: true },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    maxPlayers: { type: Number, default: 15 },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
