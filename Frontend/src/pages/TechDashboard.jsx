import LogoutButton from "../components/LogoutButton";
import { useState, useEffect } from "react";

import {
  Clock3,
  CheckCircle2,
  Wrench,
  Plus,
  SunMedium,
  Moon,
  ClipboardList,
  FileText,
  Activity,
} from "lucide-react";

import axios from "axios";

export default function TechDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" });
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  // ✅✅✅ NEW STATE (FOR CLOSE COMMENT)
  const [activeCloseId, setActiveCloseId] = useState(null);
  const [closeComment, setCloseComment] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const getAuth = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API}/api/tickets/assigned/my`, getAuth());
      setTickets(res.data);
    } catch (err) {
      console.log("❌ Unable to fetch tickets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // ✅✅✅ UPDATED: CLOSE WITH MESSAGE
  const closeWithMessage = async (id) => {
    try {
      const res = await axios.put(
        `${API}/api/tickets/${id}/status`,
        {
          status: "Resolved",
          comment: closeComment, // ✅ SENT TO BACKEND + EMAIL
        },
        getAuth()
      );

      const updated = res.data;

      setTickets((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: updated.status } : t))
      );

      setActiveCloseId(null);
      setCloseComment("");
    } catch (err) {
      console.log("❌ Failed to close ticket with message", err);
    }
  };

  const technicianName = localStorage.getItem("name") || "Technician";

  return (
    <div className="min-h-screen flex text-gray-800 dark:text-gray-100 transition-all duration-700
      bg-gradient-to-b from-[#f9fbff] via-white to-[#f5f9ff]
      dark:from-gray-950 dark:via-black dark:to-gray-950 relative overflow-hidden">

      {/* ===== SIDEBAR ===== */}
      <aside className="relative z-10 w-64 flex flex-col justify-between p-6 
        bg-white/70 dark:bg-white/10 backdrop-blur-2xl 
        border-r border-gray-200/70 dark:border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.08)]">

        <div>
          <h2 className="text-2xl font-extrabold mb-10 bg-gradient-to-r from-blue-700 to-indigo-700 
            dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
            Technician Panel
          </h2>

          <nav className="space-y-2">
            <SidebarItem
              icon={<ClipboardList size={18} />}
              label="Assigned Tickets"
              active={activeTab === "assigned"}
              onClick={() => setActiveTab("assigned")}
            />
          </nav>
        </div>

        <LogoutButton />
      </aside>

      {/* ===== MAIN ===== */}
      <main className="flex-1 p-10 relative z-10">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <h1 className="text-4xl font-extrabold mb-1 bg-gradient-to-r from-blue-700 to-indigo-700 
            dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
            Welcome, {technicianName}
          </h1>

          <button
            onClick={() => setDark(!dark)}
            className="mt-5 sm:mt-0 p-3 rounded-full bg-white/80 dark:bg-white/10 
              border border-gray-300 dark:border-white/10 hover:bg-blue-50 
              dark:hover:bg-white/20 shadow-md transition-all duration-300">
            {dark ? <SunMedium size={22} /> : <Moon size={22} />}
          </button>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <TechCard
            title="Active Jobs"
            value={tickets.filter((t) => t.status === "In Progress").length}
            icon={<Wrench />}
          />

          <TechCard
            title="Resolved Issues"
            value={tickets.filter((t) => t.status === "Resolved").length}
            icon={<CheckCircle2 />}
          />
        </div>

        {/* ===== ASSIGNED TICKETS TABLE ===== */}
        {activeTab === "assigned" && (
          <div className="bg-white/80 dark:bg-gray-900/80 p-8 rounded-3xl shadow-md border 
            border-gray-200 dark:border-gray-700">

            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-700 to-indigo-600 
              dark:from-blue-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Assigned Tickets
            </h2>

            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            ) : tickets.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No tickets found.</p>
            ) : (
              <table className="min-w-full text-sm border-collapse table-fixed">

                <tbody>
                  {tickets.map((t) => (
                    <tr key={t._id} className="border-b dark:border-gray-700">

                      <td className="py-3 px-4 truncate">{t.title}</td>

                      <td className="px-4">
                        <Badge color={t.priority === "High" ? "red" : t.priority === "Medium" ? "orange" : "gray"}>
                          {t.priority}
                        </Badge>
                      </td>

                      <td className="px-4">
                        <Badge color={t.status === "Resolved" ? "green" : t.status === "Pending" ? "yellow" : "blue"}>
                          {t.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 flex flex-col items-center gap-2">

                 {t.status === "Resolved" ? (
  <span className="px-3 py-1 text-green-700 font-semibold">
    Solved
  </span>
) : (
  <button
    onClick={() => setActiveCloseId(t._id)}
    className="px-3 py-1 bg-green-600 hover:bg-green-700 
      text-white rounded-lg"
  >
    Close
  </button>
)}


                        {activeCloseId === t._id && (
                          <div className="w-full">
                            <textarea
                              value={closeComment}
                              onChange={(e) => setCloseComment(e.target.value)}
                              placeholder="Enter solution message for user..."
                              className="w-full p-2 border dark:bg-gray-800 dark:border-gray-700"
                              rows={2}
                            />

                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => closeWithMessage(t._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded">
                                Submit
                              </button>

                              <button
                                onClick={() => {
                                  setActiveCloseId(null);
                                  setCloseComment("");
                                }}
                                className="bg-gray-500 text-white px-3 py-1 rounded">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

/* ===== SUB COMPONENTS ===== */

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`px-3 py-2 rounded-lg cursor-pointer font-medium flex items-center gap-3 transition-all duration-300 
      ${active
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
        : "hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-white"}`}>
      {icon}
      {label}
    </div>
  );
}

function TechCard({ title, value, icon }) {
  return (
    <div className="bg-white/80 dark:bg-white/10 backdrop-blur-2xl p-6 rounded-2xl 
      border border-gray-200/70 dark:border-white/10 shadow-md">

      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl text-xl">
          {icon}
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function Badge({ color, children }) {
  const colors = {
    green: "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300",
    yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
    red: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-300",
    gray: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };
  return <span className={`px-3 py-1 text-sm rounded-lg font-medium ${colors[color]}`}>{children}</span>;
}
