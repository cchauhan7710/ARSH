export function detectCategory(text) {
  const t = text.toLowerCase();

  if (t.includes("wifi") || t.includes("internet") || t.includes("vpn") || t.includes("switch") || t.includes("network"))
    return "Network";

  if (t.includes("password") || t.includes("login") || t.includes("unauthorized") || t.includes("hack"))
    return "Security";

  if (t.includes("email") || t.includes("software") || t.includes("system") || t.includes("application"))
    return "IT";

  if (t.includes("printer") || t.includes("keyboard") || t.includes("mouse") || t.includes("monitor"))
    return "Hardware";

  if (t.includes("server") || t.includes("database") || t.includes("backup"))
    return "Server";

  if (t.includes("scada") || t.includes("rtu") || t.includes("control room"))
    return "SCADA";

  if (t.includes("relay") || t.includes("transformer") || t.includes("feeder"))
    return "Electrical";

  if (t.includes("meter") || t.includes("billing") || t.includes("amr"))
    return "Metering";

  if (t.includes("substation") || t.includes("grid") || t.includes("power outage"))
    return "Grid";

  return "General"; // ✅ Default fallback
}
