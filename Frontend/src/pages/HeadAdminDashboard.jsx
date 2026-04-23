import LogoutButton from "../components/LogoutButton";
import {
  LayoutDashboard,
  UsersRound,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  SunMedium,
  Moon,
  Ticket,
} from "lucide-react";

import axios from "axios";
import { useEffect, useState } from "react";
import Chatbot from "../components/Chatbot";

export default function HeadAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
  name: "",
  email: "",
  role: "admin",
  password: "", // ✅ MUST EXIST
});


  const [createdCredentials, setCreatedCredentials] = useState({
    email: "",
    password: "",
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/users`, getAuthConfig());
      setUsers(res.data);
    } catch {
      console.log("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/tickets/all`, getAuthConfig());
      setTickets(res.data);
    } catch {
      console.log("Failed to load tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTickets();
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

  const promoteToAdmin = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/admin/users/promote-admin/${id}`, {}, getAuthConfig());
      fetchUsers();
    } catch {
      alert("Failed to promote");
    }
  };

  const promoteToTechnician = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/admin/users/promote/${id}`, {}, getAuthConfig());
      fetchUsers();
    } catch {
      alert("Failed to promote");
    }
  };

 const createAdmin = async () => {
  try {
    const res = await axios.post(
      `${API_BASE}/api/headadmin/create-user`,
      {
        name: newAdmin.name,
        email: newAdmin.email,
        role: "admin",
        password: newAdmin.password, // ✅ ✅ ✅ THIS WAS MISSING
      },
      getAuthConfig()
    );

    setCreatedCredentials({
      email: newAdmin.email,
      password: newAdmin.password, // ✅ Show the same password you typed
    });

    setShowCreateModal(false);
    setShowSuccessModal(true);

    // ✅ RESET FORM
    setNewAdmin({
      name: "",
      email: "",
      role: "admin",
      password: "",
    });

    fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to create admin");
  }
};


  const headAdminName = localStorage.getItem("name") || "Head Admin";
  const technicians = users.filter((u) => u.role === "technician");

  return (
    <div
      className="min-h-screen flex transition-all duration-700 text-gray-900 dark:text-gray-100
      bg-gradient-to-br from-[#e8f2ff] via-[#f4f9ff] to-[#e3eeff]
      dark:from-[#080b11] dark:via-[#0b0e14] dark:to-[#070a0f] relative overflow-hidden"
    ><Chatbot />
      {/* Background Glow */}
      <div className="absolute top-[-15%] left-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 dark:bg-blue-500/10 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-500/10 dark:bg-indigo-500/10 blur-[140px] rounded-full"></div>

      {/* SIDEBAR */}
      <aside
        className="w-64 h-screen flex flex-col justify-between p-6
        backdrop-blur-2xl bg-white/20 dark:bg-white/10
        border-r border-white/40 dark:border-white/10
        shadow-[0_8px_35px_rgba(0,0,0,0.1)] relative z-20 rounded-r-3xl"
      >
        <div>
          <h2
            className="text-3xl font-extrabold mb-10
            bg-gradient-to-r from-blue-600 to-indigo-600 
            dark:from-blue-300 dark:to-indigo-300
            bg-clip-text text-transparent"
          >
            Head Admin
          </h2>

          <nav className="space-y-3">
            <SidebarItem label="Overview" icon={<LayoutDashboard size={18} />} active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />

            <SidebarItem label="All Users" icon={<UsersRound size={18} />} active={activeTab === "users"} onClick={() => setActiveTab("users")} />

            <SidebarItem label="Admins" icon={<ShieldCheck size={18} />} active={activeTab === "admins"} onClick={() => setActiveTab("admins")} />

            <SidebarItem label="Technicians" icon={<Wrench size={18} />} active={activeTab === "technicians"} onClick={() => setActiveTab("technicians")} />

            <SidebarItem label="Tickets" icon={<Ticket size={18} />} active={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} />
          </nav>
        </div>

        <LogoutButton />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-12 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <h1
            className="text-4xl font-extrabold
            bg-gradient-to-r from-blue-600 to-indigo-600 
            dark:from-blue-300 dark:to-indigo-300 
            bg-clip-text text-transparent"
          >
            Welcome, {headAdminName}
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 rounded-2xl text-white font-semibold
              bg-gradient-to-br from-blue-600 to-indigo-600
              shadow-lg shadow-blue-500/30
              hover:shadow-blue-500/50 hover:scale-[1.03] active:scale-95 transition-all"
            >
              + Create Admin
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="p-3 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/10
              border border-white/50 dark:border-white/10
              hover:scale-105 active:scale-95 transition shadow-md"
            >
              {dark ? <SunMedium size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </div>

        {/* TABS */}
        {activeTab === "overview" && <Overview users={users} technicians={technicians} tickets={tickets} />}

        {activeTab === "users" && (
          <UserTable
            title="All Users"
            loading={loadingUsers}
            data={users}
            deleteUser={deleteUser}
            promoteToAdmin={promoteToAdmin}
            promoteToTechnician={promoteToTechnician}
          />
        )}

        {activeTab === "admins" && (
          <UserTable title="Admins" loading={loadingUsers} data={users.filter((u) => u.role === "admin")} deleteUser={deleteUser} />
        )}

        {activeTab === "technicians" && (
          <UserTable title="Technicians" loading={loadingUsers} data={technicians} promoteToAdmin={promoteToAdmin} />
        )}

        {activeTab === "tickets" && <TicketsTable title="Tickets" loading={loadingTickets} data={tickets} />}

        {/* MODALS */}
        {showCreateModal && <CreateAdminModal setShowCreateModal={setShowCreateModal} setNewAdmin={setNewAdmin} createAdmin={createAdmin} />}

        {showSuccessModal && <SuccessPopup createdCredentials={createdCredentials} setShowSuccessModal={setShowSuccessModal} />}
      </main>

      <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
        <Chatbot />
      </div>

    </div>
  );
}

/* ==================== SIDEBAR ITEM ==================== */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`px-4 py-3 rounded-2xl cursor-pointer flex items-center gap-3 font-medium
      transition-all backdrop-blur-xl border border-white/20 dark:border-white/10
      ${active
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl scale-[1.03]"
          : "bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 hover:scale-[1.02]"
        }`}
    >
      {icon}
      {label}
    </div>
  );
}

/* ==================== OVERVIEW ==================== */
function Overview({ users, technicians, tickets }) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <AdminCard title="Total Users" value={users.length} icon={<UsersRound />} />
        <AdminCard title="Admins" value={users.filter((u) => u.role === "admin").length} icon={<ShieldCheck />} />
        <AdminCard title="Technicians" value={technicians.length} icon={<Wrench />} />
        <AdminCard title="Pending Tickets" value={tickets.filter((t) => t.status === "Pending").length} icon={<Clock3 />} />
        <AdminCard title="Resolved Tickets" value={tickets.filter((t) => t.status === "Resolved").length} icon={<CheckCircle2 />} />
      </div>
    </div>
  );
}

/* ==================== ADMIN CARD ==================== */
function AdminCard({ title, value, icon }) {
  return (
    <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 p-6 rounded-3xl border border-white/30 dark:border-white/10 shadow-lg transition-all hover:shadow-2xl hover:scale-[1.03]">
      <div className="flex items-center gap-5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl shadow-md shadow-blue-500/40">
          {icon}
        </div>

        <div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{title}</p>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{value}</h2>
        </div>
      </div>
    </div>
  );
}

/* ==================== USER TABLE ==================== */
function UserTable({ title, loading, data, deleteUser, promoteToAdmin, promoteToTechnician }) {
  return (
    <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 p-10 rounded-3xl border border-white/30 dark:border-white/10 shadow-xl">
      <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
        {title}
      </h2>

      {loading ? (
        <p className="py-6 text-center text-gray-600 dark:text-gray-300">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl backdrop-blur-xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-white/30 dark:bg-white/5 border-b border-white/20 backdrop-blur-xl">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((u, idx) => (
                <tr
                  key={u._id}
                  className={`border-b border-white/10 transition-all ${idx % 2 === 0 ? "bg-white/10 dark:bg-white/5" : ""
                    } hover:bg-white/20 dark:hover:bg-white/10`}
                >
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-xl font-medium ${u.role === "admin"
                        ? "bg-blue-200 text-blue-800"
                        : u.role === "technician"
                          ? "bg-green-200 text-green-800"
                          : u.role === "headadmin"
                            ? "bg-indigo-200 text-indigo-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center flex-wrap gap-2">

                      {promoteToAdmin && u.role !== "admin" && u.role !== "headadmin" && (
                        <button
                          onClick={() => promoteToAdmin(u._id)}
                          className="min-w-[110px] px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 active:scale-95 transition-all"
                        >
                          Make Admin
                        </button>
                      )}

                      {promoteToTechnician && u.role !== "technician" && u.role !== "headadmin" && (
                        <button
                          onClick={() => promoteToTechnician(u._id)}
                          className="min-w-[120px] px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                          Make Technician
                        </button>
                      )}


                      {deleteUser && u.role !== "headadmin" && (
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="min-w-[90px] px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 active:scale-95 transition-all"
                        >
                          Delete
                        </button>
                      )}

                    </div>
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

/* ==================== TICKETS TABLE ==================== */
function TicketsTable({ title, loading, data }) {
  return (
    <div className="backdrop-blur-2xl bg-white/20 dark:bg-white/10 p-10 rounded-3xl border border-white/30 dark:border-white/10 shadow-xl">
      <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
        {title}
      </h2>

      {loading ? (
        <p className="py-6 text-center text-gray-600 dark:text-gray-300">Loading tickets...</p>
      ) : (
        <Table data={data} />
      )}
    </div>
  );
}

/* ==================== TABLE ==================== */
function Table({ data }) {
  return (
    <div className="overflow-x-auto rounded-2xl backdrop-blur-xl">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-white/30 dark:bg-white/5 border-b border-white/20 backdrop-blur-xl">
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Priority</th>
            <th className="px-4 py-3 text-right">Created</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t, idx) => (
            <tr
              key={t._id}
              className={`border-b border-white/10 transition-all ${idx % 2 === 0 ? "bg-white/10 dark:bg-white/5" : ""
                } hover:bg-white/20 dark:hover:bg-white/10`}
            >
              <td className="px-4 py-3">{t.title}</td>
              <td className="px-4 py-3">{t.status}</td>
              <td className="px-4 py-3">{t.priority}</td>
              <td className="px-4 py-3 text-right font-mono">{new Date(t.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==================== CREATE ADMIN MODAL ==================== */
function CreateAdminModal({ setShowCreateModal, setNewAdmin, createAdmin }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex justify-center items-center z-50 animate-fadeIn">
      <div
        className="w-96 p-8 rounded-3xl shadow-2xl
        backdrop-blur-3xl bg-white/20 dark:bg-white/10
        border border-white/30 dark:border-white/10
        animate-scaleIn"
      >
        <h2 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create Admin
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-xl focus:ring-2 focus:ring-blue-500 transition"
          onChange={(e) =>
            setNewAdmin((prev) => ({ ...prev, name: e.target.value }))
          }
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 mb-4 rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-xl focus:ring-2 focus:ring-blue-500 transition"
          onChange={(e) =>
            setNewAdmin((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        {/* ✅ ✅ ✅ MANUAL PASSWORD FIELD ADDED ✅ ✅ ✅ */}
        <input
          type="password"
          placeholder="Set Password"
          className="w-full p-3 mb-4 rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-white/5 backdrop-blur-xl focus:ring-2 focus:ring-blue-500 transition"
          onChange={(e) =>
            setNewAdmin((prev) => ({ ...prev, password: e.target.value }))
          }
        />

        <button
          onClick={createAdmin}
          className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/40 hover:scale-[1.03] active:scale-95 transition"
        >
          Create Admin
        </button>

        <button
          onClick={() => setShowCreateModal(false)}
          className="w-full py-2 mt-4 text-gray-700 dark:text-gray-300 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}


/* ==================== SUCCESS POPUP ==================== */
function SuccessPopup({ createdCredentials, setShowSuccessModal }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex justify-center items-center z-50 animate-fadeIn">
      <div
        className="w-96 p-8 rounded-3xl shadow-2xl
        backdrop-blur-3xl bg-white/20 dark:bg-white/10
        border border-white/30 dark:border-white/10
        animate-scaleIn"
      >
        <h2 className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">Admin Created 🎉</h2>

        <div className="bg-white/30 dark:bg-white/5 p-4 rounded-xl border border-white/20 mb-5 backdrop-blur-xl">
          <p className="text-gray-800 dark:text-gray-200 text-sm">
            <b>Email:</b> {createdCredentials.email}
          </p>
          <p className="text-gray-800 dark:text-gray-200 text-sm mt-2">
            <b>Password:</b> {createdCredentials.password}
          </p>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`
            );
            alert("Copied!");
          }}
          className="w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"
        >
          Copy Credentials
        </button>

        <button
          onClick={() => setShowSuccessModal(false)}
          className="w-full py-2 mt-3 text-gray-700 dark:text-gray-300 hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ==================== ANIMATIONS ==================== */
const style = document.createElement("style");
style.innerHTML = `
  .animate-fadeIn {
    animation: fadeIn 0.25s ease-out both;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-scaleIn {
    animation: scaleIn 0.25s ease-out both;
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.88); filter: blur(6px); }
    to { opacity: 1; transform: scale(1); filter: blur(0); }
  }
`;
document.head.appendChild(style);
