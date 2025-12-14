// lib/aiPriorityEngine.js

// Rule-based "AI" priority engine with persisted explainability.
// English + Dutch keyword support.
// Output is deterministic and auditable (reasons + score + model version).

const MODEL_VERSION = "rules_v1";

/**
 * @typedef {"Critical"|"High"|"Medium"|"Low"} Priority
 */

/**
 * A single matched reason that can be stored in DB (Json) safely.
 * @typedef {Object} PriorityReason
 * @property {string} ruleId
 * @property {Priority} category
 * @property {string} keyword
 * @property {number} weight
 * @property {string} rationale
 */

/**
 * Detailed suggestion contract (persistable).
 * @typedef {Object} PrioritySuggestion
 * @property {string} modelVersion
 * @property {Priority} priority
 * @property {number} score
 * @property {PriorityReason[]} reasons
 * @property {string} summary
 */

// Basic tokenizer: lowercase, split on non-letters/numbers, keep short tokens out.
function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9áéíóúàèìòùäëïöüœçß]+/i)
    .filter(Boolean);
}

// Phrase match (for multi-word patterns) - still deterministic.
function includesPhrase(haystack, phrase) {
  if (!phrase) return false;
  return haystack.includes(phrase.toLowerCase());
}

// Token match (prevents prod matching product)
function hasToken(tokens, token) {
  return tokens.includes(token.toLowerCase());
}

const RULES = [
  // --- CRITICAL ---
  {
    ruleId: "CRIT_OUTAGE",
    category: "Critical",
    weight: 100,
    keywords: ["outage", "server down", "crash", "systeem plat", "valt uit"],
    rationale: "Service availability risk detected (outage/crash).",
  },
  {
    ruleId: "CRIT_PRODUCTION",
    category: "Critical",
    weight: 95,
    // IMPORTANT: "prod" must be a token, not substring.
    tokenKeywords: ["prod"],
    keywords: ["production", "live omgeving", "kritiek", "critical"],
    rationale: "Production-impact keyword detected.",
  },

  // --- HIGH ---
  {
    ruleId: "HIGH_BUG_ERROR",
    category: "High",
    weight: 70,
    keywords: [
      "bug",
      "error",
      "fout",
      "werkt niet",
      "faalt",
      "broken",
      "fix",
      "fixen",
    ],
    rationale: "Bug/error keyword detected.",
  },
  {
    ruleId: "HIGH_AUTH_SECURITY",
    category: "High",
    weight: 75,
    keywords: [
      "login",
      "log in",
      "inloggen",
      "auth",
      "security",
      "beveiliging",
      "wachtwoord",
      "token",
    ],
    rationale: "Auth/security keyword detected.",
  },
  {
    ruleId: "HIGH_PAYMENTS",
    category: "High",
    weight: 80,
    keywords: [
      "payment",
      "betaling",
      "betalingen",
      "checkout",
      "ideal",
      "afrekenen",
    ],
    rationale: "Payments/checkout keyword detected.",
  },
  {
    ruleId: "HIGH_URGENCY",
    category: "High",
    weight: 60,
    keywords: [
      "urgent",
      "dringend",
      "met spoed",
      "asap",
      "vandaag nog",
      "nu oplossen",
    ],
    rationale: "Urgency keyword detected.",
  },

  // --- MEDIUM ---
  {
    ruleId: "MED_UI_UX",
    category: "Medium",
    weight: 40,
    keywords: [
      "refactor",
      "cleanup",
      "opschonen",
      "design",
      "ontwerp",
      "layout",
      "ui",
      "ux",
      "styling",
    ],
    rationale: "UI/UX/refactor keyword detected.",
  },
  {
    ruleId: "MED_PERFORMANCE",
    category: "Medium",
    weight: 45,
    keywords: ["performant", "performance", "snelheid"],
    rationale: "Performance keyword detected.",
  },

  // --- LOW ---
  {
    ruleId: "LOW_RESEARCH",
    category: "Low",
    weight: 20,
    keywords: [
      "idea",
      "idee",
      "onderzoek",
      "research",
      "explore",
      "verkennen",
      "experiment",
      "proberen",
      "leren",
      "learn",
    ],
    rationale: "Research/learning keyword detected.",
  },
];

const SEVERITY_ORDER = ["Critical", "High", "Medium", "Low"];

function pickBestCategory(matchedReasons) {
  for (const cat of SEVERITY_ORDER) {
    if (matchedReasons.some((r) => r.category === cat)) return cat;
  }
  return "Medium";
}

/**
 * Detailed explainable result (persistable).
 * @param {string} title
 * @returns {PrioritySuggestion}
 */
export function suggestPriorityDetailed(title) {
  const raw = (title ?? "").trim();
  if (!raw) {
    return {
      modelVersion: MODEL_VERSION,
      priority: "Medium",
      score: 0,
      reasons: [],
      summary: "No title provided; defaulted to Medium.",
    };
  }

  const text = raw.toLowerCase();
  const tokens = tokenize(raw);

  /** @type {PriorityReason[]} */
  const reasons = [];

  for (const rule of RULES) {
    // Token-only keywords (safer matching)
    if (rule.tokenKeywords?.length) {
      for (const tk of rule.tokenKeywords) {
        if (hasToken(tokens, tk)) {
          reasons.push({
            ruleId: rule.ruleId,
            category: rule.category,
            keyword: tk,
            weight: rule.weight,
            rationale: rule.rationale,
          });
          break;
        }
      }
    }

    // Phrase/substring keywords (multi word)
    if (rule.keywords?.length) {
      for (const kw of rule.keywords) {
        if (kw.includes(" ")) {
          if (includesPhrase(text, kw)) {
            reasons.push({
              ruleId: rule.ruleId,
              category: rule.category,
              keyword: kw,
              weight: rule.weight,
              rationale: rule.rationale,
            });
            break;
          }
        } else {
          // single word: prefer token match when possible to reduce false positives
          if (hasToken(tokens, kw) || text.includes(kw)) {
            reasons.push({
              ruleId: rule.ruleId,
              category: rule.category,
              keyword: kw,
              weight: rule.weight,
              rationale: rule.rationale,
            });
            break;
          }
        }
      }
    }
  }

  const priority = pickBestCategory(reasons);

  const score = Math.min(
    100,
    reasons
      .filter((r) => r.category === priority)
      .reduce((sum, r) => sum + (Number.isFinite(r.weight) ? r.weight : 0), 0)
  );

  const topReasons = reasons
    .filter((r) => r.category === priority)
    .slice(0, 3)
    .map((r) => r.keyword);

  const summary =
    reasons.length === 0
      ? "No matching rules; defaulted to Medium."
      : `Priority set to ${priority} based on: ${topReasons.join(", ")}.`;

  return {
    modelVersion: MODEL_VERSION,
    priority,
    score,
    reasons,
    summary,
  };
}

/**
 * Backwards compatible: only returns Priority string.
 * @param {string} title
 * @returns {Priority}
 */
export function suggestPriorityForTitle(title) {
  return suggestPriorityDetailed(title).priority;
}
