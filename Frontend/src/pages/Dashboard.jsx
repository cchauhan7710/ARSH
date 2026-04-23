import LogoutButton from "../components/LogoutButton";
import Chatbot from "../components/Chatbot";

import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  UserRound,
  CheckCircle2,
  Clock3,
  SunMedium,
  Moon,
  FilePlus2
} from "lucide-react";

import axios from "axios";

import { useEffect, useState } from "react";
export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [activePage, setActivePage] = useState("dashboard");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" });
  // ✅ EMAIL TICKET STATES
const [sendEmail, setSendEmail] = useState(false);

const [emailOptions, setEmailOptions] = useState({
  title: true,
  description: true,
  priority: true,
  ticketId: true,
});

// const fetchFreeTechnicians = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await axios.get(
//       "http://localhost:5000/api/tickets/technicians/free", // ✅ FIXED URL
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     setFreeTechnicians(res.data);
//     console.log("✅ Free Technicians:", res.data); // optional debug
//   } catch (err) {
//     console.log("❌ Failed to fetch free technicians", err);
//   }
// };



  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data);
    } catch {
      console.log("❌ Failed to load tickets");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

const createTicket = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/tickets`,
      form, // ✅ only title, description, priority
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setShowForm(false);
    setForm({ title: "", description: "", priority: "Medium" });
    fetchTickets();
  } catch (err) {
    console.log("❌ Ticket creation failed", err);
  }
};

  const employeeName = localStorage.getItem("name") || "Employee";
  const employeeRole = localStorage.getItem("role") || "Employee";

  return (
    <div className="min-h-screen flex transition-all duration-700 text-gray-900 dark:text-gray-100
      bg-gradient-to-br from-[#e9edf3] via-[#f7f9fb] to-[#e6ebf3]
      dark:from-[#0b0e13] dark:via-[#0e1016] dark:to-[#0a0c10] relative overflow-hidden">

      {/* Ambient VisionOS Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] 
        bg-blue-500/10 dark:bg-blue-500/5 blur-[130px] rounded-full"></div>

      <div className="absolute bottom-[-15%] left-[-10%] w-[35rem] h-[35rem] 
        bg-indigo-500/10 dark:bg-indigo-500/5 blur-[140px] rounded-full"></div>

      {/* ================= SIDEBAR ================= */}
      <aside className="relative z-20 w-64 h-screen flex flex-col justify-between p-6
        backdrop-blur-2xl bg-white/20 dark:bg-white/10
        border-r border-white/30 dark:border-white/10
        shadow-[0_8px_30px_rgba(0,0,0,0.1)]">

        <div>
          <h2 className="text-3xl font-extrabold mb-12 
            bg-gradient-to-r from-blue-700 to-indigo-600 
            dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
            SAMADHAN
          </h2>

          <nav className="space-y-3">
            <SidebarItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={activePage === "dashboard"} 
              onClick={() => setActivePage("dashboard")} 
            />

            <SidebarItem 
              icon={<Ticket size={18} />} 
              label="My Tickets" 
              active={activePage === "tickets"} 
              onClick={() => setActivePage("tickets")} 
            />

            <SidebarItem 
  icon={<PlusCircle size={18} />} 
  label="Create Ticket" 
  onClick={() => {
    setShowForm(true);
    // fetchFreeTechnicians(); // ✅ LOAD FREE TECHS WHEN MODAL OPENS
  }} 
/>


            <SidebarItem 
              icon={<UserRound size={18} />} 
              label="Profile" 
              active={activePage === "profile"} 
              onClick={() => setActivePage("profile")} 
            />
          </nav>
        </div>

        <LogoutButton />
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-12 relative z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <h1 className="text-4xl font-extrabold mb-1 
            bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-300 dark:to-indigo-300 
            bg-clip-text text-transparent">

            {activePage === "dashboard" ? `Welcome, ${employeeName}` : ""}
            {activePage === "tickets" ? "My Tickets" : ""}
            {activePage === "profile" ? "My Profile" : ""}
          </h1>

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-3 rounded-2xl bg-white/40 dark:bg-white/10 
              border border-white/40 dark:border-white/10 
              shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            {dark ? <SunMedium size={22} /> : <Moon size={22} />}
          </button>
        </div>

        {/* ========== DASHBOARD OVERVIEW ========== */}
        {activePage === "dashboard" && (
          <div>

            {/* Glass Cards */}
            <div className="grid sm:grid-cols-3 gap-8 mb-12">
              <GlassCard 
                title="Total Tickets" 
                value={tickets.length} 
                icon={<Ticket />} 
              />
              <GlassCard 
                title="Resolved" 
                value={tickets.filter(t => t.status === "Resolved").length} 
                icon={<CheckCircle2 />} 
              />
              <GlassCard 
                title="Pending" 
                value={tickets.filter(t => t.status === "Pending").length} 
                icon={<Clock3 />} 
              />
            </div>

            {/* Recent Tickets Panel */}
            <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 
                p-8 rounded-3xl border border-white/30 dark:border-white/10 shadow-xl
                transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">

              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 
                bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-300 dark:to-indigo-300 
                bg-clip-text text-transparent">
                <Ticket /> Recent Tickets
              </h3>

              {tickets.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No tickets available.</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl backdrop-blur-xl">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-white/30 dark:bg-white/5 border-b border-white/20">
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        
                        <th className="px-4 py-3 text-left">Priority</th>
                        <th className="px-4 py-3 text-right">Created</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tickets.slice(0, 5).map((t, i) => (
                        <tr key={t._id}
                          className={`border-b border-white/10 transition-all
                            ${i % 2 === 0 ? "bg-white/10 dark:bg-white/5" : ""}
                            hover:bg-white/20 dark:hover:bg-white/10`}>

                          <td className="px-4 py-3 font-medium">{t.title}</td>

                          <td className="px-4 py-3">
                            <StatusBadge status={t.status} />
                          </td>

                          <td className="px-4 py-3">
                            <PriorityBadge priority={t.priority} />
                          </td>

                          <td className="px-4 py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                            {new Date(t.createdAt).toLocaleString()}
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========== MY TICKETS PAGE ========== */}
        {activePage === "tickets" && (
          <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 
            p-10 rounded-3xl border border-white/30 dark:border-white/10 shadow-xl">

            {tickets.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No tickets found.</p>
            ) : (
              tickets.map((t) => <TicketCard key={t._id} t={t} />)
            )}

          </div>
        )}

        {/* ========== PROFILE PAGE ========== */}
        {activePage === "profile" && (
          <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 
            p-10 rounded-3xl border border-white/30 dark:border-white/10 shadow-xl space-y-3 text-lg">

            <p><b>Name:</b> {employeeName}</p>
            <p><b>Email:</b> {localStorage.getItem("email") || "Not Provided"}</p>
            <p><b>Role:</b> {employeeRole}</p>

          </div>
        )}

      </main>

      {/* ================= CREATE TICKET MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex justify-center items-center z-50 animate-fadeIn">
          <div className="w-[420px] p-8 rounded-3xl shadow-2xl animate-scaleIn
            backdrop-blur-3xl bg-white/20 dark:bg-white/10
            border border-white/30 dark:border-white/10">

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2
              bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              <FilePlus2 /> Create Ticket
            </h2>

           <form onSubmit={createTicket} className="space-y-4">

  <input
    type="text"
    required
    placeholder="Issue Title"
    className="w-full p-3 rounded-xl border bg-white/30"
    value={form.title}
    onChange={(e) => setForm({ ...form, title: e.target.value })}
  />

  <textarea
    required
    rows="3"
    placeholder="Describe your issue..."
    className="w-full p-3 rounded-xl border bg-white/30"
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
  ></textarea>
<select
  className="w-full p-3 rounded-xl border bg-white/30"
  value={form.priority}
  onChange={(e) => setForm({ ...form, priority: e.target.value })}
>
  <option>High</option>
  <option>Medium</option>
  <option>Low</option>
</select>


  {/* ✅ EMAIL CHECKBOX */}
 <label className="flex items-center gap-3 mt-3 text-sm font-medium">
 <input
  type="checkbox"
  checked={sendEmail}
  onChange={() => {
    setSendEmail(!sendEmail);
    // fetchFreeTechnicians(); // ✅ AUTO LOAD FREE TECHS
  }}
/>

  Send ticket details to technician via Email
</label>

{sendEmail && (
  <div className="space-y-3 mt-3 p-3 rounded-xl bg-white/20 border">

    {/* ✅ SUGGESTED TECHNICIANS DROPDOWN */}
 {/* <select
      className="w-full p-3 rounded-xl border bg-white/30"
      value={technicianEmail}
      onChange={(e) => setTechnicianEmail(e.target.value)}
      required
    >
      <option value="">Select Free Technician</option>

      {freeTechnicians.map((tech) => (
        <option key={tech._id} value={tech.email}>
          {tech.name} — {tech.activeTickets} Active Tickets
        </option>
      ))}
    </select>    */}

    {/* ✅ CHECKBOX OPTIONS */}
    <div className="text-sm space-y-1 mt-2">
      <label>
        <input
          type="checkbox"
          checked={emailOptions.title}
          onChange={() =>
            setEmailOptions({ ...emailOptions, title: !emailOptions.title })
          }
        /> Include Title
      </label>

      <label>
        <input
          type="checkbox"
          checked={emailOptions.description}
          onChange={() =>
            setEmailOptions({ ...emailOptions, description: !emailOptions.description })
          }
        /> Include Description
      </label>

      <label>
        <input
          type="checkbox"
          checked={emailOptions.priority}
          onChange={() =>
            setEmailOptions({ ...emailOptions, priority: !emailOptions.priority })
          }
        /> Include Priority
      </label>

      <label>
        <input
          type="checkbox"
          checked={emailOptions.ticketId}
          onChange={() =>
            setEmailOptions({ ...emailOptions, ticketId: !emailOptions.ticketId })
          }
        /> Include Ticket ID
      </label>

    </div>
  </div>
)}



  {/* ✅ BUTTONS */}
  <div className="flex gap-3 pt-3">
    <button
      type="submit"
      className="flex-1 py-3 rounded-xl text-white font-semibold
      bg-gradient-to-br from-blue-600 to-indigo-600"
    >
      Submit
    </button>

    <button
      type="button"
      onClick={() => setShowForm(false)}
      className="flex-1 py-3 rounded-xl bg-gray-500 text-white"
    >
      Cancel
    </button>
  </div>

</form>


          </div>
        </div>
      )}
      <Chatbot />
    </div>
  );
}

/* ========== SIDE BAR BUTTON ========== */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 flex items-center gap-3 rounded-2xl cursor-pointer font-medium transition-all
        ${active
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-[1.03]"
          : "hover:bg-white/30 dark:hover:bg-white/10 hover:scale-[1.02]"
        }`}
    >
      {icon} {label}
    </div>
  );
}

/* ========== GLASS CARD ========== */
function GlassCard({ title, value, icon }) {
  return (
    <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 
      p-7 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg
      hover:shadow-2xl hover:scale-[1.03] transition-all">

      <div className="flex items-center gap-5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 
          text-white text-xl shadow-blue-500/40 shadow-md">
          {icon}
        </div>

        <div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
}

/* ========== STATUS BADGE ========== */
function StatusBadge({ status }) {
  const map = {
    Resolved: "bg-green-200 text-green-700",
    Pending: "bg-yellow-200 text-yellow-700",
    Open: "bg-blue-200 text-blue-700"
  };

  return (
    <span className={`px-3 py-1 rounded-xl text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

/* ========== PRIORITY BADGE ========== */
function PriorityBadge({ priority }) {
  const map = {
    High: "bg-red-200 text-red-700",
    Medium: "bg-orange-200 text-orange-700",
    Low: "bg-gray-200 text-gray-700"
  };

  return (
    <span className={`px-3 py-1 rounded-xl text-xs font-medium ${map[priority]}`}>
      {priority}
    </span>
  );
}

/* ========== TICKET CARD ========== */
function TicketCard({ t }) {
  return (
    <div className="p-6 mb-4 rounded-3xl backdrop-blur-xl bg-white/20 dark:bg-white/10 
      border border-white/20 dark:border-white/10 shadow-md hover:shadow-xl transition-all">

      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{t.title}</h3>
        <StatusBadge status={t.status} />
      </div>

      <p className="text-gray-600 dark:text-gray-400 mt-2">{t.description}</p>

      <div className="flex flex-wrap gap-6 text-sm mt-4 p-3 rounded-xl 
        bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-xl">

        <span><b>Priority:</b> {t.priority}</span>
        <span><b>ID:</b> {t._id}</span>
        <span><b>Assigned:</b> {t.assignedTo?.name || "Unassigned"}</span>

        <span className="font-mono">
          <b>Created:</b> {new Date(t.createdAt).toLocaleString()}
        </span>
      </div>

      {/* ✅ ✅ ✅ SOLUTION MESSAGE PREVIEW (ONLY IF RESOLVED) */}
      {t.status === "Resolved" && t.solutionComment && (
        <div className="mt-4 p-4 rounded-xl 
          bg-green-100 dark:bg-green-900/40 
          border border-green-300 dark:border-green-700">

          <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
            ✅ Solution from Technician:
          </p>

          <p className="text-sm text-green-800 dark:text-green-300">
            {t.solutionComment}
          </p>
        </div>
      )}

    </div>
  );
}


/* ========== VISIONOS ANIMATIONS ========== */
const style = document.createElement("style");
style.innerHTML = `
  .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.88); filter: blur(6px); }
    to { opacity: 1; transform: scale(1); filter: blur(0); }
  }
`;
document.head.appendChild(style);
