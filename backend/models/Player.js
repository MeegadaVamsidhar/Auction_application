const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dept: { type: String, default: "N/A" },
    year: { type: String, required: true },
    role: {
      type: String,
      enum: ["BATSMAN", "BOWLING", "BOWLING ALLROUNDER", "BATTING ALLROUNDER"],
      required: true,
    },
    battingStyle: { type: String },
    bowlingStyle: { type: String },
    image: { type: String }, // URL to image
    contact: { type: String }, // Can serve as secondary contact
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    previousTeams: { type: String },
    basePrice: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sold", "unsold"],
      default: "pending",
    },
    soldPrice: { type: Number },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    stats: {
      matches: { type: Number, default: 0 },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
    },
    bidHistory: [
      {
        team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
        amount: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Player", playerSchema);
