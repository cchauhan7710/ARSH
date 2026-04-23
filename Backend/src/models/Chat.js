import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [
    {
      sender: { type: String, enum: ["user", "bot"], required: true },
      text: { type: String },
      image: { type: String },
      timestamp: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

export default mongoose.model("Chat", ChatSchema);
