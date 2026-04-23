import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X, Send, Sun, Moon, Bot } from "lucide-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! How can I help you with your technical issue today?" },
  ]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  const chatEndRef = useRef(null);

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("jwt") ||
    "";

  const API = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/chat`;

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages, botTyping]);

  // ✅ SEND MESSAGE
  const sendMessage = async (textValue) => {
    const text = textValue ?? input;
    if (!text.trim()) return;

    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setBotTyping(true);

    try {
      const res = await axios.post(
        API,
        { message: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ ✅ ✅ AUTO OPEN PDF IN NEW TAB (NO BLACK SCREEN)
      if (res.data.openInNewTab === true) {
        window.open(
          "http://localhost:5173/Password%20Reset%20Manual.pdf",
          "_blank",
          "noopener,noreferrer"
        );
      }

      setTimeout(() => {
        setBotTyping(false);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.reply },
        ]);
      }, 300);
    } catch (err) {
      setBotTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Server error or session expired." },
      ]);
    }
  };

  const handleSuggestion = (text) => {
    sendMessage(text);
  };

  return (
    <>
      {/* ✅ Floating Button */}
      <div
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 bg-blue-600 hover:bg-blue-700 
        rounded-full flex items-center justify-center shadow-2xl cursor-pointer 
        transition hover:scale-110"
        onClick={() => setOpen(!open)}
      >
        <Bot className="text-white" size={28} />
      </div>

      {/* ✅ Chat Window */}
      {open && (
        <div
          className={`fixed bottom-24 right-6 z-[9999] w-[360px] h-[520px] rounded-2xl 
          shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl
          transition animate-scale-in
          ${darkMode ? "bg-gray-900 text-white border border-gray-800" : "bg-white text-black border border-gray-200"}`}
        >
          {/* ✅ Header */}
          <div
            className={`px-4 py-4 flex justify-between items-center
            ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"}`}
          >
            <div className="flex items-center gap-2 font-semibold">
              <Bot size={22} /> Smart IT Helpdesk
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <X size={22} className="cursor-pointer" onClick={() => setOpen(false)} />
            </div>
          </div>

          {/* ✅ ✅ ✅ MESSAGES WITH SAFE PDF OPENING */}
          <div
            className={`flex-1 p-4 overflow-y-auto space-y-3
            ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-md
                  ${m.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : darkMode
                    ? "bg-gray-800 text-white border border-gray-700 rounded-bl-none"
                    : "bg-white text-black border rounded-bl-none"}`}
                >
                  {m.text.split("\n").map((line, idx) => {
                    const isLink = line.includes("http");

                    return (
                      <p key={idx} className="mb-1 leading-relaxed break-words">
                        {isLink ? (
                          <a
                            href={line.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(
                                "http://localhost:5173/Password%20Reset%20Manual.pdf",
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                            className="text-blue-600 underline hover:text-blue-800 font-medium"
                          >
                            📄 Open Password Reset Manual
                          </a>
                        ) : (
                          line
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}

            {botTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl text-sm shadow bg-gray-200 dark:bg-gray-800">
                  Typing...
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ✅ Suggestions */}
          <div className="px-3 py-2 flex gap-2 flex-wrap border-t bg-gray-100 dark:bg-gray-800">
            <button
              onClick={() => handleSuggestion("create ticket")}
              className="text-xs px-3 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              🎫 Create Ticket
            </button>

            <button
              onClick={() => handleSuggestion("wifi not working")}
              className="text-xs px-3 py-1 rounded-full bg-gray-300 dark:bg-gray-700"
            >
              📡 WiFi Issue
            </button>

            <button
              onClick={() => handleSuggestion("login problem")}
              className="text-xs px-3 py-1 rounded-full bg-gray-300 dark:bg-gray-700"
            >
              🔐 Login Issue
            </button>
          </div>

          {/* ✅ Input */}
          <div className={`p-3 flex gap-2 items-center border-t ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your issue..."
              className={`flex-1 px-4 py-2 rounded-full outline-none text-sm
              ${darkMode
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-gray-100 text-black placeholder-gray-500"}`}
            />
            <button onClick={() => sendMessage()} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ✅ Animation */}
      <style>{`
        .animate-scale-in {
          animation: scaleIn 0.25s ease-out;
        }
        @keyframes scaleIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
