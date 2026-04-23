import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import axios from "axios";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/contact`, form);

      setStatus("Message sent! We'll contact you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("❌ Failed to send message. Try again later.");
    }
  };

  return (
    <section
      className="relative min-h-screen py-28 px-6 flex items-center justify-center
                 bg-gradient-to-b from-[#f9fbff] via-white to-[#f5f9ff]
                 dark:from-gray-950 dark:via-black dark:to-gray-950
                 text-gray-800 dark:text-gray-200 transition-all duration-700 overflow-hidden"
    >

      {/* ✨ Background Gradient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[40rem] h-[40rem] top-[-10%] left-[-10%] 
                        bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute w-[35rem] h-[35rem] bottom-[-15%] right-[-10%] 
                        bg-pink-500/10 dark:bg-pink-600/10 blur-[140px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        
        {/* ===== Heading ===== */}
        <div className="text-center mb-14">
          <h1
            className="text-5xl sm:text-6xl font-extrabold 
                       bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-500
                       dark:from-blue-300 dark:via-indigo-300 dark:to-pink-300
                       bg-clip-text text-transparent"
          >
            Contact Us
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            Have questions? We're here to help you anytime.
          </p>
        </div>

        {/* ===== Contact Card ===== */}
        <div
          className="backdrop-blur-2xl bg-white/30 dark:bg-white/10 
                     border border-white/40 dark:border-white/10
                     shadow-xl rounded-3xl p-10 sm:p-14
                     transition-all duration-700 hover:shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-12">

            {/* ================= LEFT SIDE — Contact Info ================= */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Reach out to us for support, partnerships, or general queries.  
                  We respond quickly!
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="text-blue-600 dark:text-blue-300" size={26} />
                  <p className="text-gray-700 dark:text-gray-300 text-lg">support@samadhan.com</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Phone className="text-blue-600 dark:text-blue-300" size={26} />
                  <p className="text-gray-700 dark:text-gray-300 text-lg">+91 98765 43210</p>
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="text-blue-600 dark:text-blue-300" size={26} />
                  <p className="text-gray-700 dark:text-gray-300 text-lg">Ludhiana, Punjab (IN)</p>
                </div>
              </div>
            </div>

            {/* ================= RIGHT SIDE — Contact Form ================= */}
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Name */}
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-gray-600 dark:text-gray-400">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className="px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 
                             border border-gray-300 dark:border-white/10
                             focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-gray-600 dark:text-gray-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 
                             border border-gray-300 dark:border-white/10
                             focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-gray-600 dark:text-gray-400">Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write your message..."
                  className="px-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 
                             border border-gray-300 dark:border-white/10
                             focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 text-lg font-semibold rounded-xl 
                           bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                           shadow-lg hover:shadow-blue-500/30 
                           hover:scale-[1.03] active:scale-95
                           transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                           flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send Message
              </button>

              {/* Status Message */}
              {status && (
                <p className="text-center mt-2 text-blue-600 dark:text-blue-300 font-medium">
                  {status}
                </p>
              )}

            </form>

          </div>
        </div>

      </div>
    </section>
  );
}
