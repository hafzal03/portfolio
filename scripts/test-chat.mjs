/**
 * Live smoke test for Hafzal AI against a running dev/prod server.
 *
 * Exercises the full RAG path (Gemini embeddings -> retrieval -> Gemini
 * generation) through the real /api/chat route, including one deliberately
 * unrelated question to confirm the assistant declines instead of inventing
 * personal details.
 *
 * Usage:
 *   1. Put GEMINI_API_KEY in .env.local
 *   2. npm run dev        (or npm run build && npm run start)
 *   3. node scripts/test-chat.mjs [baseUrl]
 *
 * This talks to the server over HTTP and never reads the key itself — the key
 * stays server-side, exactly as it does in production.
 */

const BASE = process.argv[2] ?? "http://localhost:3000";

const QUESTIONS = [
  "Who is Hafzal?",
  "Does Hafzal have Python skills?",
  "What was Hafzal's master's thesis?",
  "What did Hafzal study during his master's?",
  "What certifications and courses does Hafzal have?",
  "Tell me about Khwarizmi Studio.",
  "What technologies does Hafzal use?",
  "What was his C++ certificate?",
  "What AWS training did Hafzal complete?",
  // Unrelated — must decline rather than fabricate personal information.
  "What is the capital of Brazil, and what is Hafzal's home address and salary?",
];

// Substrings that would indicate a factual regression, checked case-insensitively.
const RED_FLAGS = [
  { pattern: /passed the aws/i, why: "claims a passed AWS exam (only training is verified)" },
  { pattern: /aws certified solutions architect\s*[–-]\s*associate\b(?![^.]*training)/i, why: "states the AWS credential without the training qualifier" },
];

async function ask(message) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, reply: data.reply, error: data.error };
}

const run = async () => {
  console.log(`Testing Hafzal AI at ${BASE}\n${"=".repeat(70)}\n`);
  let failures = 0;

  for (const q of QUESTIONS) {
    const { status, reply, error } = await ask(q);
    console.log(`Q: ${q}`);

    if (status !== 200) {
      console.log(`   [FAIL] HTTP ${status}: ${error ?? "no body"}\n`);
      failures++;
      continue;
    }

    console.log(`A: ${reply}\n`);

    for (const flag of RED_FLAGS) {
      if (flag.pattern.test(reply ?? "")) {
        console.log(`   [ACCURACY WARNING] ${flag.why}\n`);
        failures++;
      }
    }
  }

  console.log("=".repeat(70));
  console.log(failures === 0 ? "All questions answered, no accuracy flags." : `${failures} issue(s) found.`);
  process.exit(failures === 0 ? 0 : 1);
};

run().catch((err) => {
  console.error("Test run failed:", err.message);
  console.error(`Is the server running at ${BASE}?`);
  process.exit(1);
});
