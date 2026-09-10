/**
 * Report rows from the last Launch Gate run.
 *
 * Reads qa-evidence/last-run.json (Playwright's JSON reporter) and prints
 * Markdown table rows — `| ID | Title | Result | Project | Note |` — for
 * every test that carries an `@<ID>` tag, grouped by section tag, with
 * totals at the end. Results:
 *   expected   → PASS        unexpected → FAIL        flaky → FLAKY
 *   skipped    → MANUAL when the test carries a "manual" annotation,
 *                otherwise N/A (with the skip reason)
 * The Note is the first line of the error message with anything that
 * looks like a key, token, password, code or bypass value redacted, so
 * the rows are safe to paste into the plain-English report. The JSON file
 * itself stays on the machine that ran the tests.
 *
 *   node tests/e2e/tools/report-rows.mjs [qa-evidence/last-run.json]
 */

import { existsSync, readFileSync } from "node:fs";

const file = process.argv[2] ?? "qa-evidence/last-run.json";
if (!existsSync(file)) {
  console.error(`No run record at ${file} — run the suite first.`);
  process.exit(1);
}

const report = JSON.parse(readFileSync(file, "utf8"));

const ID_RE = /^[A-Z]{2}-\d{3}[a-z]?$/;
const SECTIONS = [
  "pages",
  "accounts",
  "forms",
  "payments",
  "protection",
  "integrations",
  "manual",
];
const SECTION_OF_PREFIX = {
  PG: "pages",
  AC: "accounts",
  FM: "forms",
  PY: "payments",
  PR: "protection",
  IN: "integrations",
  MN: "manual",
};

// Mirrors tests/e2e/harness/secret-shapes.ts plus the query/assignment
// forms an error message can carry.
const REDACTIONS = [
  [/\b(sk|rk)_(live|test)_[A-Za-z0-9]{8,}/g, "[redacted:stripe-key]"],
  [/\bwhsec_[A-Za-z0-9]{8,}/g, "[redacted:webhook-secret]"],
  [/\bsb_(secret|publishable)_[A-Za-z0-9_-]{8,}/g, "[redacted:supabase-key]"],
  [
    /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g,
    "[redacted:jwt]",
  ],
  [/\b[0-9a-f]{32}-us\d+\b/g, "[redacted:mailchimp-key]"],
  [/\bpostgres(ql)?:\/\/\S+/gi, "[redacted:postgres-url]"],
  [/\bBearer\s+[A-Za-z0-9._-]{8,}/g, "Bearer [redacted]"],
  [/\bcs_(test|live)_[A-Za-z0-9]{8,}/g, "[redacted:checkout-session]"],
  [
    /(\b(?:code|token_hash|token|access_token|refresh_token|session_id|x-vercel-protection-bypass)=)[^&\s"']+/gi,
    "$1[redacted]",
  ],
  [
    /\b(password|passwd|secret|token|api[_-]?key|access[_-]?code|bypass)\b(\s*[:=]\s*|\s+is\s+)["']?[^\s"',;)]{4,}/gi,
    "$1$2[redacted]",
  ],
  [/[A-Za-z0-9+/=]{40,}/g, "[redacted:long-token]"],
];

function redact(text) {
  let out = text;
  for (const [re, replacement] of REDACTIONS) {
    out = out.replace(re, replacement);
  }
  return out;
}

function stripAnsi(text) {
  return text.replace(/\[[0-9;]*m/g, "");
}

function firstLine(text) {
  return (
    stripAnsi(String(text ?? ""))
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 0) ?? ""
  );
}

function cell(text) {
  return String(text ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\s+/g, " ")
    .trim();
}

function tagsOf(spec) {
  return (spec.tags ?? []).map((t) => String(t).replace(/^@/, ""));
}

const rows = [];
let harnessFailures = 0;

function walk(suite) {
  for (const spec of suite.specs ?? []) {
    const tags = tagsOf(spec);
    const id = tags.find((t) => ID_RE.test(t));
    if (!id) {
      for (const t of spec.tests ?? []) {
        if (t.status === "unexpected") harnessFailures += 1;
      }
      continue;
    }
    const section =
      tags.find((t) => SECTIONS.includes(t)) ??
      SECTION_OF_PREFIX[id.slice(0, 2)] ??
      "other";
    for (const t of spec.tests ?? []) {
      const annotations = t.annotations ?? [];
      const manual = annotations.find((a) => a.type === "manual");
      const skip = annotations.find(
        (a) => a.type === "skip" || a.type === "fixme",
      );
      let result;
      let note = "";
      switch (t.status) {
        case "expected":
          result = "PASS";
          break;
        case "unexpected":
          result = "FAIL";
          break;
        case "flaky":
          result = "FLAKY";
          break;
        case "skipped":
          if (manual) {
            result = "MANUAL";
            note = "evidence required — " + firstLine(manual.description);
          } else {
            result = "N/A";
            note = firstLine(skip?.description ?? "skipped");
          }
          break;
        default:
          result = String(t.status ?? "unknown").toUpperCase();
      }
      if (result === "FAIL" || result === "FLAKY") {
        const failing = (t.results ?? []).find(
          (r) => r.error || (r.errors ?? []).length,
        );
        const err =
          failing?.error?.message ?? failing?.errors?.[0]?.message ?? "";
        note = firstLine(err);
        if (failing?.status === "timedOut" && !note) note = "timed out";
      }
      const noteAnnotation = annotations.find((a) => a.type === "note");
      if (noteAnnotation && !note) note = firstLine(noteAnnotation.description);
      rows.push({
        section,
        id,
        title: spec.title,
        result,
        project: t.projectName ?? "",
        note: redact(note),
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child);
}

for (const suite of report.suites ?? []) walk(suite);

function idKey(id) {
  const m = /^([A-Z]{2})-(\d{3})([a-z]?)$/.exec(id);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : id;
}
rows.sort(
  (a, b) =>
    SECTIONS.indexOf(a.section) - SECTIONS.indexOf(b.section) ||
    idKey(a.id).localeCompare(idKey(b.id)) ||
    a.project.localeCompare(b.project),
);

const totals = { PASS: 0, FAIL: 0, FLAKY: 0, MANUAL: 0, "N/A": 0 };
let current = null;
for (const row of rows) {
  if (row.section !== current) {
    current = row.section;
    console.log(`\n### ${current}\n`);
    console.log("| ID | Title | Result | Project | Note |");
    console.log("| --- | --- | --- | --- | --- |");
  }
  console.log(
    `| ${cell(row.id)} | ${cell(row.title)} | ${cell(row.result)} | ${cell(row.project)} | ${cell(row.note)} |`,
  );
  totals[row.result] = (totals[row.result] ?? 0) + 1;
}

console.log("");
console.log(
  `Totals: ${rows.length} rows — PASS ${totals.PASS}, FAIL ${totals.FAIL}, FLAKY ${totals.FLAKY}, MANUAL ${totals.MANUAL}, N/A ${totals["N/A"]}` +
    (harnessFailures ? `; harness/setup failures ${harnessFailures}` : ""),
);
if (report.stats) {
  const s = report.stats;
  console.log(
    `Playwright stats: expected ${s.expected}, unexpected ${s.unexpected}, flaky ${s.flaky}, skipped ${s.skipped}; started ${s.startTime}; duration ${Math.round((s.duration ?? 0) / 1000)} s`,
  );
}
