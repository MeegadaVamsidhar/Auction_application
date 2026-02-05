const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String }, // Optional now, we use mobile for logic
    mobile: { type: String, required: true, unique: true },
    email: { type: String }, // Email optional? User said only phone number needed for captain. But commonly we need email. I'll keep it but maybe not required if user insists. User said "captain should register with phone number". I'll keep email required for now unless told otherwise.
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "captain"], required: true },
    isApproved: { type: Boolean, default: false },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }, // Only for captains
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
