import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: [
      "headadmin",
      "admin",
      "employee",
      "technician", // ✅ Technician Group Owner
      "agent"       // ✅ New Real Worker Role
    ],
    default: "employee"
  },

  // ✅ Technician Specialization (ONLY for role = technician)
  technicianType: {
    type: String,
    enum: ["software", "hardware", "network"],
    default: null
  },

  // ✅ Agent belongs to which Technician
  parentTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // ✅ Load balancing
  activeTickets: {
    type: Number,
    default: 0
  },

  // ✅ Agent Leave System
  onLeave: {
    type: Boolean,
    default: false
  },

  otp: {
    type: String,
    default: null
  },

  otpExpires: {
    type: Number,
    default: null
  },

  verified: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);
