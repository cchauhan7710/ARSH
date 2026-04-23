import { useState } from "react";
import LogoutButton from "../components/LogoutButton";
import CreateTicket from "../components/CreateTicket";  // ⬅ Import here

export default function Dashboard() {

  const [tickets, setTickets] = useState([]);

  const addTicket = (ticket) =>
    setTickets([...tickets, { ...ticket, id: Date.now(), status: "Pending" }]);

  return (
    <div className="p-10 min-h-screen bg-gray-100">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700">User Dashboard</h1>
        <LogoutButton />
      </div>

      {/* 🔥 Ticket creation only for employee */}
      <CreateTicket addTicket={addTicket} />

    </div>
  );
}
