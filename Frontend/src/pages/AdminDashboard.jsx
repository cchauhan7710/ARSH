import LogoutButton from "../components/LogoutButton";
import {
  LayoutDashboard,
  UsersRound,
  Wrench,
  CheckCircle2,
  Clock3,
  SunMedium,
  Moon,
  Ticket,
} from "lucide-react";

import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);

  // ✅ NEW: For manual ticket assigning
  const [techniciansList, setTechniciansList] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "employee", password: "" });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdUserInfo, setCreatedUserInfo] = useState({ email: "", password: "" });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/users`, getAuthConfig());
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/tickets/all`, getAuthConfig());
      setTickets(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingTickets(false);
    }
  };

  // ✅ NEW: Fetch technicians for manual dropdown
  const fetchTechnicians = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/admin/technicians`,
        getAuthConfig()
      );
      setTechniciansList(res.data);
    } catch (err) {
      console.log("Failed to fetch technicians", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTickets();
    fetchTechnicians(); // ✅ added
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/admin/users/${id}`, getAuthConfig());
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  const createUser = async () => {
    try {
      await axios.post(`${API_BASE}/api/admin/create-user`, newUser, getAuthConfig());
      // ✅ Backend no longer returns random password, so we use the one admin set
      setCreatedUserInfo({
        email: newUser.email,
        password: newUser.password,
      });
      setShowSuccessPopup(true);
      fetchUsers();
      setShowCreateModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  // ✅ NEW: Manual ticket assigning
  const assignTicketManually = async (ticketId, technicianId) => {
    if (!technicianId) return;
    try {
      setAssignLoading(true);
      await axios.patch(
        `${API_BASE}/api/admin/tickets/assign/${ticketId}`,
        { technicianId },
        getAuthConfig()
      );
      fetchTickets();
      fetchTechnicians();
      alert("✅ Ticket Assigned Successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Manual Assignment Failed");
    } finally {
      setAssignLoading(false);
    }
  };

  const technicians = users.filter((u) => u.role === "technician");
  const adminName = localStorage.getItem("name") || "Admin";

  return (
    <div className="min-h-screen flex transition-all duration-700 text-gray-900 dark:text-gray-100
      bg-gradient-to-br from-[#e9edf3] via-[#f7f9fb] to-[#e6ebf3]
      dark:from-[#0b0e13] dark:via-[#0e1016] dark:to-[#0a0c10] relative overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-white/10 
        dark:bg-white/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[35rem] h-[35rem] bg-blue-500/10 
        dark:bg-blue-500/5 blur-[140px] rounded-full"></div>

      {/* ========== SIDEBAR ========== */}
      <aside className="relative z-20 w-64 h-screen flex flex-col justify-between p-6

        backdrop-blur-2xl bg-white/20 dark:bg-[#ffffff0a]
        border-r border-white/30 dark:border-white/10
        shadow-[0_8px_30px_rgb(0,0,0,0.08)]">

        <div>
          <h2 className="text-3xl font-extrabold mb-12 
            bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-300 dark:to-indigo-300
            bg-clip-text text-transparent">
            Admin Panel
          </h2>

          <nav className="space-y-3">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
            <SidebarItem icon={<UsersRound size={18} />} label="Users" active={activeTab === "users"} onClick={() => setActiveTab("users")} />
            <SidebarItem icon={<Wrench size={18} />} label="Technicians" active={activeTab === "technicians"} onClick={() => setActiveTab("technicians")} />
            <SidebarItem icon={<Ticket size={18} />} label="Tickets" active={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} />
          </nav>
        </div>

        <LogoutButton />
      </aside>

      {/* ========== MAIN AREA ========== */}
      <main className="flex-1 p-12 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <h1 className="text-4xl font-extrabold 
            bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-300 dark:to-indigo-300
            bg-clip-text text-transparent">
            Welcome, {adminName}
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 rounded-2xl text-white font-semibold
              bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20
              hover:shadow-blue-500/40 hover:scale-[1.03] active:scale-95 transition-all">
              + Create User
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="p-3 rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-white/10
              border border-white/40 dark:border-white/10
              hover:scale-105 active:scale-95 transition-all shadow-md">
              {dark ? <SunMedium size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </div>

        {/* TABS */}
        {activeTab === "overview" && (
          <Overview users={users} technicians={technicians} tickets={tickets} loadingTickets={loadingTickets} />
        )}
        {activeTab === "users" && (
          <DataTable title="Users" loading={loadingUsers} data={users} deleteUser={deleteUser} />
        )}
        {activeTab === "technicians" && (
          <DataTable title="Technicians" loading={loadingUsers} data={technicians} />
        )}
        {activeTab === "tickets" && (
          <TicketsTable
            title="Tickets"
            loading={loadingTickets}
            data={tickets}
            technicians={techniciansList}
            assignTicketManually={assignTicketManually}
            assignLoading={assignLoading}
          />
        )}

        {/* MODALS */}
        {showCreateModal && (
          <CreateUserModal
            setShowCreateModal={setShowCreateModal}
            setNewUser={setNewUser}
            createUser={createUser}
          />
        )}

        {showSuccessPopup && (
          <SuccessPopup
            createdUserInfo={createdUserInfo}
            setShowSuccessPopup={setShowSuccessPopup}
          />
        )}
      </main>
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */
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

/* ================= OVERVIEW SECTION ================= */
function Overview({ users, technicians, tickets, loadingTickets }) {
  return (
    <>
      {/* CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <AdminCard title="Total Users" value={users.length} icon={<UsersRound />} />
        <AdminCard title="Technicians" value={technicians.length} icon={<Wrench />} />
        <AdminCard title="Pending Tickets" value={tickets.filter(t => t.status === "Pending").length} icon={<Clock3 />} />
        <AdminCard title="Resolved Tickets" value={tickets.filter(t => t.status === "Resolved").length} icon={<CheckCircle2 />} />
      </div>

      {/* RECENT TICKETS */}
      <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 
        p-8 rounded-3xl border border-white/30 dark:border-white/10 shadow-xl
        transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">

        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 
          bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-300 dark:to-indigo-300 
          bg-clip-text text-transparent">
          <Ticket /> Recent Tickets
        </h3>

        {loadingTickets ? (
          <p>Loading...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets.</p>
        ) : (
          <Table data={tickets.slice(0, 5)} />
        )}
      </div>
    </>
  );
}

/* ================= ADMIN CARD ================= */
function AdminCard({ title, value, icon }) {
  return (
    <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 px-7 py-6 rounded-3xl 
      border border-white/30 dark:border-white/10 shadow-lg 
      hover:shadow-2xl hover:scale-[1.03] transition-all">
      <div className="flex items-center gap-5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl shadow-md shadow-blue-500/30">
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

/* ================= TABLE FOR USERS + TECHNICIANS ================= */
function DataTable({ title, loading, data, deleteUser }) {
  return (
    <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/9 
      p-8 rounded-3xl border border-white/30 dark:border-white/10 shadow-xl">

      <h2 className="text-2xl font-bold mb-6 
        bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-300 dark:to-indigo-300 
        bg-clip-text text-transparent">
        {title}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No data.</p>
      ) : (
       <div className="overflow-x-auto rounded-2xl">
  <table className="min-w-full text-sm table-fixed">
    <thead>
      <tr className="bg-white/30 dark:bg-white/5 border-b border-white/20">
        <th className="px-4 py-3 text-left w-1/3">Name</th>
        <th className="px-4 py-3 text-left w-1/3">Email</th>
        <th className="px-4 py-3 text-left w-1/3">Role</th>
      </tr>
    </thead>

    <tbody>
      {data.map((u, i) => (
        <tr
          key={u._id}
          className={`border-b border-white/10 transition-all
            ${i % 2 === 0 ? "bg-white/10 dark:bg-white/5" : ""}
            hover:bg-white/20 dark:hover:bg-white/10`}
        >
          <td className="px-4 py-3 truncate">{u.name}</td>
          <td className="px-4 py-3 truncate">{u.email}</td>

          <td className="px-4 py-3">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-medium
                ${
                  u.role === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : u.role === "technician"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {u.role}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      )}
    </div>
  );
}

/* ================= TICKETS TABLE (WITH MANUAL ASSIGN) ================= */
function TicketsTable({ title, loading, data, technicians, assignTicketManually, assignLoading }) {
  return (
    <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 
      p-8 rounded-3xl border border-white/30 dark:border-white/10 shadow-xl">

      <h2 className="text-2xl font-bold mb-6
        bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-300 dark:to-indigo-300 
        bg-clip-text text-transparent">
        {title}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No tickets.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-white/30 dark:bg-white/5 border-b border-white/20">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">Assign Technician</th>
                <th className="px-4 py-3 text-right">Created</th>
              </tr>
            </thead>

            <tbody>
              {data.map((t, i) => (
                <tr key={t._id}
                  className={`border-b border-white/10 transition-all
                    ${i % 2 === 0 ? "bg-white/10 dark:bg-white/5" : ""}
                    hover:bg-white/20 dark:hover:bg-white/10`}>

                  <td className="px-4 py-3">{t.title}</td>

                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-xl text-xs font-medium
                      ${t.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : t.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                      }`}>
                      {t.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-xl text-xs font-medium
                      ${t.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : t.priority === "Medium"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-200 text-gray-700"
                      }`}>
                      {t.priority}
                    </span>
                  </td>

                  {/* ✅ Manual assign dropdown */}
                  <td className="px-4 py-3">
                    <select
                      className="px-3 py-1 rounded-lg bg-white/40 dark:bg-white/10"
                      defaultValue=""
                      onChange={(e) =>
                        assignTicketManually(t._id, e.target.value)
                      }
                      disabled={assignLoading}
                    >
                      <option value="" disabled>Select Tech</option>
                      {technicians.map((tech) => (
                        <option key={tech._id} value={tech._id}>
                          {tech.name} ({tech.activeTickets || 0})
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-3 text-right font-mono">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================= GENERIC SIMPLE TABLE ================= */
function Table({ data }) {
  return (
    <div className="overflow-x-auto rounded-2xl">
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
          {data.map((t, i) => (
            <tr key={t._id}
              className={`border-b border-white/10 transition-all
                ${i % 2 === 0 ? "bg-white/10 dark:bg-white/5" : ""}
                hover:bg-white/20 dark:hover:bg-white/10`}>

              <td className="px-4 py-3">{t.title}</td>

              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-medium
                  ${t.status === "Resolved"
                    ? "bg-green-100 text-green-700"
                    : t.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                  }`}>
                  {t.status}
                </span>
              </td>

              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-medium
                  ${t.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : t.priority === "Medium"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-200 text-gray-700"
                  }`}>
                  {t.priority}
                </span>
              </td>

              <td className="px-4 py-3 text-right font-mono">
                {new Date(t.createdAt).toLocaleString()}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= CREATE USER MODAL ================= */
function CreateUserModal({ setShowCreateModal, setNewUser, createUser }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn">
      <div className="w-96 p-8 rounded-3xl backdrop-blur-2xl bg-white/20 dark:bg-white/10
        border border-white/30 dark:border-white/10 shadow-2xl animate-scaleIn">

        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create New User
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-white/5 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 mb-4 rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-white/5 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
        />

        {/* ✅ Password field */}
        <input
          type="password"
          placeholder="Set Password"
          className="w-full p-3 mb-4 rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-white/5 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
        />

        <select
          className="w-full p-3 mb-6 rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-white/5"
          onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
        >
          <option value="employee">Employee</option>
          <option value="technician">Technician</option>
        </select>

        <button
          onClick={createUser}
          className="w-full py-3 rounded-xl text-white bg-gradient-to-br from-blue-600 to-indigo-600 hover:scale-[1.03] active:scale-95 transition">
          Create User
        </button>

        <button
          onClick={() => setShowCreateModal(false)}
          className="w-full py-2 mt-4 text-gray-700 dark:text-gray-300 hover:underline">
          Cancel
        </button>
      </div>

    </div>
  );
}

/* ================= SUCCESS POPUP ================= */
function SuccessPopup({ createdUserInfo, setShowSuccessPopup }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn">
      <div className="w-96 p-8 rounded-3xl backdrop-blur-2xl bg-white/20 dark:bg-white/10
        border border-white/30 dark:border-white/10 shadow-2xl animate-scaleIn">

        <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
          User Created 🎉
        </h2>

        <p className="mb-2 text-gray-800 dark:text-gray-200">
          <b>Email:</b> {createdUserInfo.email}
        </p>

        <p className="mb-4 text-gray-800 dark:text-gray-200">
          <b>Password:</b> {createdUserInfo.password}
        </p>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `Email: ${createdUserInfo.email}\nPassword: ${createdUserInfo.password}`
            );
            alert("Copied!");
          }}
          className="w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition">
          Copy Credentials
        </button>

        <button
          onClick={() => setShowSuccessPopup(false)}
          className="w-full py-2 mt-3 text-gray-700 dark:text-gray-300 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
}

/* ================= ANIMATIONS ================= */
const style = document.createElement("style");
style.innerHTML = `
  .animate-fadeIn {
    animation: fadeIn 0.25s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-scaleIn {
    animation: scaleIn 0.25s ease-out;
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.88); filter: blur(6px); }
    to { opacity: 1; transform: scale(1); filter: blur(0); }
  }
`;
document.head.appendChild(style);
