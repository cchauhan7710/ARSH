import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import headAdminRoutes from "./routes/headAdminRoutes.js";
import contactRoute from "./routes/contact.js";
import chatbotRoutes from "./routes/chatbotRoutes.js"; // ✅ IMPORTED
import externalTicketApi from "./routes/externalTicketApi.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// 🧭 Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/headadmin", headAdminRoutes);
app.use("/api", contactRoute);
app.use("/api", chatbotRoutes);   // ⭐⭐⭐ FIX: ADD CHATBOT ROUTES
app.use("/uploads", express.static("uploads")); // for images


//API For ticket creation from another platform 

app.use("/api", externalTicketApi);



// 🚀 Start Server
app.listen(process.env.PORT, () =>
  console.log(`✅ Server running on port ${process.env.PORT}`)
);
console.log("✅ LOADED API KEY:", process.env.EXTERNAL_API_KEY);
console.log("✅ EXTERNAL API KEY:", process.env.EXTERNAL_API_KEY);
