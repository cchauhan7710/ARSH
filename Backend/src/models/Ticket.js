import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, default: "Medium" },
    status: { type: String, default: "Pending" },

    // ✅ Ticket creator (User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅✅✅ REQUIRED FOR ADMIN → TECH ASSIGNMENT
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    solutionComment: {
  type: String,
  default: "",
},

  },
  { timestamps: true }
);

export default mongoose.model("Ticket", TicketSchema);
