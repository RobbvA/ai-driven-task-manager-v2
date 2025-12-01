// lib/aiPriorityEngine.js

// "AI" priority engine (rule-based for now).
// Works with both English and Dutch keywords,
// so later you can swap this for a real LLM call without changing the UI.
export function suggestPriorityForTitle(title) {
  if (!title) return "Medium";

  const text = title.toLowerCase();

  // --- CRITICAL (prod kapot, systeem ligt plat) ---
  if (
    text.includes("prod") ||
    text.includes("production") ||
    text.includes("productie") ||
    text.includes("live omgeving") ||
    text.includes("systeem plat") ||
    text.includes("valt uit") ||
    text.includes("crash") ||
    text.includes("server down") ||
    text.includes("outage") ||
    text.includes("critical") ||
    text.includes("kritiek")
  ) {
    return "Critical";
  }

  // --- HIGH (bugs / errors / auth / payments / security) ---

  // Bugs & errors (EN + NL)
  if (
    text.includes("bug") ||
    text.includes("error") ||
    text.includes("fout") ||
    text.includes("fix") ||
    text.includes("fixen") ||
    text.includes("werkt niet") ||
    text.includes("faalt") ||
    text.includes("broken")
  ) {
    return "High";
  }

  // Auth / login / security
  if (
    text.includes("login") ||
    text.includes("log in") ||
    text.includes("inloggen") ||
    text.includes("auth") ||
    text.includes("security") ||
    text.includes("beveiliging") ||
    text.includes("wachtwoord") ||
    text.includes("token")
  ) {
    return "High";
  }

  // Payments / checkout
  if (
    text.includes("payment") ||
    text.includes("betaling") ||
    text.includes("betalingen") ||
    text.includes("checkout") ||
    text.includes("ideal") ||
    text.includes("afrekenen")
  ) {
    return "High";
  }

  // Urgentie woorden
  if (
    text.includes("urgent") ||
    text.includes("dringend") ||
    text.includes("met spoed") ||
    text.includes("asap") ||
    text.includes("vandaag nog") ||
    text.includes("nu oplossen")
  ) {
    return "High";
  }

  // --- MEDIUM (UX / UI / refactor / performance) ---

  if (
    text.includes("refactor") ||
    text.includes("cleanup") ||
    text.includes("opschonen") ||
    text.includes("design") ||
    text.includes("ontwerp") ||
    text.includes("layout") ||
    text.includes("ui") ||
    text.includes("ux") ||
    text.includes("styling") ||
    text.includes("performant") ||
    text.includes("performance") ||
    text.includes("snelheid")
  ) {
    return "Medium";
  }

  // --- LOW (ideeën / research / nice-to-have) ---

  if (
    text.includes("idea") ||
    text.includes("idee") ||
    text.includes("onderzoek") ||
    text.includes("research") ||
    text.includes("explore") ||
    text.includes("verkennen") ||
    text.includes("experiment") ||
    text.includes("proberen") ||
    text.includes("leren") ||
    text.includes("learn")
  ) {
    return "Low";
  }

  // Default als er niets matched
  return "Medium";
}
