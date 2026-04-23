import fs from "fs";
import path from "path";

const kbPath = path.join(process.cwd(), "data", "powergrid_kb.json");

let KB = [];

try {
  const raw = fs.readFileSync(kbPath, "utf-8");
  KB = JSON.parse(raw);
  console.log("✅ PowerGrid KB Loaded:", KB.length, "records");
} catch (err) {
  console.error("❌ KB Load Failed:", err.message);
}

/* ================================
   ✅ SMART KB MATCHER
================================ */
export function matchFromKB(userText) {
  const text = userText.toLowerCase();

  for (const entry of KB) {
    if (
      entry.question.toLowerCase().includes(text) ||
      entry.tags.some(tag => text.includes(tag.toLowerCase()))
    ) {
      return entry;
    }
  }

  return null;
}
