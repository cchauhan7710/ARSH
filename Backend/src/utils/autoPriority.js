export function detectPriority(text) {
  const msg = text.toLowerCase();

  const HIGH = [
    "transformer",
    "relay",
    "scada",
    "substation",
    "power outage",
    "server down",
    "unauthorized",
    "hack",
    "earth fault",
    "oil leakage",
    "fire",
    "grid",
    "frequency",
    "ct pt",
    "feeder overload",
    "database down"
  ];

  const MEDIUM = [
    "wifi",
    "internet",
    "vpn",
    "meter",
    "ups",
    "backup",
    "billing",
    "login failed",
    "antivirus",
    "slow network",
    "fiber"
  ];

  const LOW = [
    "printer",
    "mouse",
    "keyboard",
    "monitor",
    "email",
    "software",
    "system slow",
    "display",
    "biometric"
  ];

  if (HIGH.some(keyword => msg.includes(keyword))) return "High";
  if (MEDIUM.some(keyword => msg.includes(keyword))) return "Medium";
  if (LOW.some(keyword => msg.includes(keyword))) return "Low";

  return "Medium"; // ✅ Default fallback
}
