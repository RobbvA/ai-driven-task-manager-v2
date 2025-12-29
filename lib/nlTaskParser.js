// lib/nlTaskParser.js
// Deterministic EN-only Natural Language Task Parser (no LLM).
//
// Supported:
// - Dates: today, tomorrow, weekdays, "next <weekday>", "in N days/weeks", ISO (YYYY-MM-DD)
// - Times: 14:00, 1400, 2pm, 2:30pm
// - Priority: critical/blocker/p0, urgent/asap/important/p1/high prio, low prio/low/someday
//
// Design goals:
// - deterministic output
// - explainability (reasons[])
// - fail-soft (missing signals => warnings, no crashes)
// - stable testing via injected `now`

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toISODate(date) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(now, days) {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d;
}

function addWeeks(now, weeks) {
  return addDays(now, weeks * 7);
}

function normalizeInput(input) {
  return (input || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function stripRegexes(base, regexes) {
  let out = base;
  for (const re of regexes) {
    out = out.replace(re, " ");
  }
  out = out.replace(/\s+/g, " ").trim();
  return out;
}

function nextWeekdayDate(now, weekdayIndex, forceNext = true) {
  const base = startOfDay(now);
  const current = base.getDay();

  let diff = (weekdayIndex - current + 7) % 7;
  if (diff === 0 && forceNext) diff = 7;

  base.setDate(base.getDate() + diff);
  return base;
}

function parsePriority(text) {
  const rules = [
    {
      id: "prio_critical",
      re: /\b(critical|blocker|p0)\b/g,
      priority: "Critical",
      rationale: "Detected critical priority keyword",
      weight: 40,
    },
    {
      id: "prio_high",
      re: /\b(urgent|asap|important|p1|high\s*prio|high\s*priority)\b/g,
      priority: "High",
      rationale: "Detected high priority keyword",
      weight: 30,
    },
    {
      id: "prio_low",
      re: /\b(low\s*prio|low\s*priority|low|someday|whenever)\b/g,
      priority: "Low",
      rationale: "Detected low priority keyword",
      weight: -10,
    },
  ];

  for (const r of rules) {
    if (r.re.test(text)) {
      r.re.lastIndex = 0;
      return {
        priority: r.priority,
        reasons: [{ ruleId: r.id, rationale: r.rationale, weight: r.weight }],
        strip: [r.re],
      };
    }
    r.re.lastIndex = 0;
  }

  return { priority: null, reasons: [], strip: [] };
}

function parseISODate(text) {
  const re = /\b(\d{4})-(\d{2})-(\d{2})\b/g;
  const m = re.exec(text);
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);

  if (mo < 1 || mo > 12) return null;
  if (d < 1 || d > 31) return null;
  if (y < 1970 || y > 2100) return null;

  return {
    dueDate: `${m[1]}-${m[2]}-${m[3]}`,
    reason: {
      ruleId: "date_iso",
      rationale: "Detected explicit ISO date",
      weight: 15,
    },
    strip: [re],
  };
}

function parseRelativeDate(text, now) {
  if (/\btoday\b/.test(text)) {
    return {
      dueDate: toISODate(now),
      reason: {
        ruleId: "date_today",
        rationale: "Detected 'today'",
        weight: 10,
      },
      strip: [/\btoday\b/g],
    };
  }

  if (/\btomorrow\b/.test(text)) {
    return {
      dueDate: toISODate(addDays(now, 1)),
      reason: {
        ruleId: "date_tomorrow",
        rationale: "Detected 'tomorrow'",
        weight: 10,
      },
      strip: [/\btomorrow\b/g],
    };
  }

  const re = /\bin\s+(\d{1,2})\s+(day|days|week|weeks)\b/g;
  const m = re.exec(text);
  if (!m) return null;

  const n = Number(m[1]);
  const unit = m[2];

  if (!Number.isFinite(n) || n < 1) return null;

  const target = unit.startsWith("week") ? addWeeks(now, n) : addDays(now, n);

  return {
    dueDate: toISODate(target),
    reason: {
      ruleId: "date_in_n",
      rationale: `Detected relative date: in ${n} ${unit}`,
      weight: 10,
    },
    strip: [re],
  };
}

function parseWeekday(text, now) {
  const weekdays = [
    { name: "sunday", idx: 0 },
    { name: "monday", idx: 1 },
    { name: "tuesday", idx: 2 },
    { name: "wednesday", idx: 3 },
    { name: "thursday", idx: 4 },
    { name: "friday", idx: 5 },
    { name: "saturday", idx: 6 },
  ];

  for (const w of weekdays) {
    const reNext = new RegExp(`\\bnext\\s+${w.name}\\b`, "gi");
    if (reNext.test(text)) {
      reNext.lastIndex = 0;
      const d = nextWeekdayDate(now, w.idx, true);
      return {
        dueDate: toISODate(d),
        reason: {
          ruleId: "date_next_weekday",
          rationale: `Detected 'next ${w.name}'`,
          weight: 12,
        },
        strip: [reNext],
      };
    }
    reNext.lastIndex = 0;
  }

  for (const w of weekdays) {
    const re = new RegExp(`\\b${w.name}\\b`, "gi");
    if (re.test(text)) {
      re.lastIndex = 0;
      const d = nextWeekdayDate(now, w.idx, true);
      return {
        dueDate: toISODate(d),
        reason: {
          ruleId: "date_weekday",
          rationale: `Detected weekday '${w.name}'`,
          weight: 10,
        },
        strip: [re],
      };
    }
    re.lastIndex = 0;
  }

  return null;
}

function parseTime(text) {
  let re = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;
  let m = re.exec(text);
  if (m) {
    return {
      dueTime: `${String(m[1]).padStart(2, "0")}:${m[2]}`,
      reason: {
        ruleId: "time_hhmm",
        rationale: "Detected time (HH:MM)",
        weight: 5,
      },
      strip: [re],
    };
  }

  re = /\b(\d{3,4})\b/g;
  m = re.exec(text);
  if (m) {
    const s = m[1];
    const hh = s.length === 3 ? Number(s[0]) : Number(s.slice(0, 2));
    const mm = s.length === 3 ? Number(s.slice(1)) : Number(s.slice(2));
    if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
      return {
        dueTime: `${pad2(hh)}:${pad2(mm)}`,
        reason: {
          ruleId: "time_hhmm_compact",
          rationale: "Detected time (HHMM)",
          weight: 5,
        },
        strip: [re],
      };
    }
  }

  re = /\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(am|pm)\b/g;
  m = re.exec(text);
  if (m) {
    let hh = Number(m[1]);
    const mm = Number(m[2] ?? "0");
    const ap = m[3];
    if (ap === "pm" && hh !== 12) hh += 12;
    if (ap === "am" && hh === 12) hh = 0;

    return {
      dueTime: `${pad2(hh)}:${pad2(mm)}`,
      reason: {
        ruleId: "time_ampm",
        rationale: "Detected time (AM/PM)",
        weight: 5,
      },
      strip: [re],
    };
  }

  return null;
}

function computeConfidence({
  hasPriority,
  hasDate,
  hasTime,
  warnings,
  errors,
}) {
  if (errors.length > 0) return "low";
  const score = (hasPriority ? 1 : 0) + (hasDate ? 1 : 0) + (hasTime ? 0.5 : 0);
  if (score >= 2) return warnings.length ? "medium" : "high";
  if (score >= 1) return "medium";
  return "low";
}

export function parseNlTask(inputText, now = new Date()) {
  const raw = String(inputText ?? "");
  const normalized = normalizeInput(raw);

  const reasons = [];
  const warnings = [];
  const errors = [];
  const strip = [];

  if (!normalized) {
    return {
      title: "",
      dueDate: null,
      dueTime: null,
      priority: null,
      prioritySource: "ai",
      reasons,
      confidence: "low",
      warnings,
      errors,
      normalized,
    };
  }

  const pr = parsePriority(normalized);
  if (pr.priority) {
    reasons.push(...pr.reasons);
    strip.push(...pr.strip);
  }

  let dueDate = null;
  const iso = parseISODate(normalized);
  if (iso?.dueDate) {
    dueDate = iso.dueDate;
    reasons.push(iso.reason);
    strip.push(...iso.strip);
  } else {
    const rel = parseRelativeDate(normalized, now);
    if (rel?.dueDate) {
      dueDate = rel.dueDate;
      reasons.push(rel.reason);
      strip.push(...rel.strip);
    } else {
      const wd = parseWeekday(normalized, now);
      if (wd?.dueDate) {
        dueDate = wd.dueDate;
        reasons.push(wd.reason);
        strip.push(...wd.strip);
      }
    }
  }

  let dueTime = null;
  const tm = parseTime(normalized);
  if (tm?.dueTime) {
    dueTime = tm.dueTime;
    reasons.push(tm.reason);
    strip.push(...tm.strip);
  }

  let titleCandidate = stripRegexes(normalized, strip)
    .replace(/\b(at|on|by)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!titleCandidate) {
    titleCandidate = raw.trim();
    warnings.push(
      "Title was fully consumed by parsed tokens; using raw input as title."
    );
  }

  if (!dueDate) warnings.push("No due date detected.");
  if (!pr.priority)
    warnings.push(
      "No priority keyword detected; leaving priority as Auto unless you override."
    );
  if (!dueTime) warnings.push("No time detected.");

  if (dueDate) {
    const today = startOfDay(now);
    const parsed = startOfDay(new Date(dueDate));
    if (parsed < today)
      warnings.push("Detected a due date in the past. Please confirm.");
  }

  const confidence = computeConfidence({
    hasPriority: Boolean(pr.priority),
    hasDate: Boolean(dueDate),
    hasTime: Boolean(dueTime),
    warnings,
    errors,
  });

  return {
    title: titleCandidate,
    dueDate,
    dueTime,
    priority: pr.priority,
    prioritySource: "ai",
    reasons,
    confidence,
    warnings,
    errors,
    normalized,
  };
}
