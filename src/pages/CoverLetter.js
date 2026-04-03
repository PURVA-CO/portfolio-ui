import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "../animations/variants";

const DEFAULT_FORM = {
  name: "Purva Mehta",
  role: "Full Stack Developer",
  skills: "React, ASP.NET Core, C#, SQL Server, Tailwind CSS, JavaScript",
  experience: "3+ years building scalable web applications",
  jobDescription: "",
  tone: "professional",
};

const TONE_OPTIONS = [
  {
    value: "professional",
    label: "💼 Professional",
    desc: "Formal and polished",
  },
  {
    value: "enthusiastic",
    label: "🚀 Enthusiastic",
    desc: "Energetic and passionate",
  },
  {
    value: "concise",
    label: "⚡ Concise",
    desc: "Short and straight to point",
  },
];

const Label = ({ children, required }) => (
  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
    {children}
    {required && <span className="ml-1 text-red-400">*</span>}
  </label>
);

const inputCls = `
  w-full px-4 py-2.5 rounded-xl text-sm
  bg-gray-50 dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  transition-all duration-200
`;

// ─────────────────────────────────────────────────────────────
// ✅ SHARED STREAM READER UTILITY
// Reads an SSE stream chunk by chunk with buffer support
// onChunk callback fires with each new text piece
// ─────────────────────────────────────────────────────────────
async function readStream(response, onChunk) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // keep incomplete last line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data);
        if (
          parsed.type === "content_block_delta" &&
          parsed.delta?.type === "text_delta"
        ) {
          onChunk(parsed.delta.text); // ✅ fire callback with each word
        }
      } catch {}
    }
  }
}

function CoverLetter() {
  const navigate = useNavigate();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [generatedLetter, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const outputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (loading && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading]);

  const handleGenerate = async () => {
    if (!form.jobDescription.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    setLoading(true);
    setError(null);
    setGenerated("");
    setHasGenerated(false);

    try {
      const prompt = `You are writing a professional cover letter on behalf of ${form.name}.

ABOUT THE APPLICANT:
- Full name: ${form.name}
- Current role / title: ${form.role}
- Core technical skills: ${form.skills}
- Experience level: ${form.experience}

JOB THEY ARE APPLYING FOR:
${form.jobDescription}

TONE REQUESTED: ${form.tone}

WRITING INSTRUCTIONS:
1. Open with a strong, memorable first sentence. Never start with "I am writing to apply for" or "I am applying for".
2. Paragraph 1 (Hook + fit): Connect the applicant's background directly to this role. Be specific.
3. Paragraph 2 (Evidence): Highlight 2-3 specific skills from their profile that match the job. Be concrete.
4. Paragraph 3 (Closing): Show genuine enthusiasm. End with a confident call to action.
5. Tone must be: ${form.tone}. Sound like a real human, not an AI.
6. Exactly 3 paragraphs. Under 250 words total.
7. First person throughout ("I built...", "My work with...", "I've spent...").
8. Do NOT include: subject line, "Dear Hiring Manager", date, address, or signature.
9. Output ONLY the letter body — nothing else.`;

      // ✅ Calls YOUR .NET proxy — not Anthropic directly
      const response = await fetch(
        "https://localhost:7000/api/ai/cover-letter",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Cover letter API error:", errText);
        throw new Error(`API error: ${response.status}`);
      }

      let result = "";
      setLoading(false);

      // ✅ Use shared stream reader — fires onChunk for each word
      await readStream(response, (chunk) => {
        result += chunk;
        setGenerated(result);
      });

      setHasGenerated(true);
    } catch (err) {
      console.error("Cover letter error:", err);
      setError("Failed to generate. Check console for details.");
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard access denied. Please copy manually.");
    }
  };

  const wordCount = generatedLetter.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.ceil(wordCount / 200);
  const canGenerate = form.jobDescription.trim().length > 30;

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 mb-8 text-sm text-gray-500 transition-colors duration-200 hover:text-blue-400"
        >
          ← Back to Portfolio
        </button>

        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-12 text-center"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase"
          >
            AI Powered
          </motion.p>
          <motion.h1 variants={fadeInUp} className="text-4xl font-bold">
            ✉️ Cover Letter Generator
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="max-w-xl mx-auto mt-3 text-gray-500 dark:text-gray-400"
          >
            Paste a job description → get a personalized cover letter in your
            voice, instantly.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="w-16 h-1 mx-auto mt-5 bg-blue-400 rounded-full"
          />
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid items-start grid-cols-1 gap-8 lg:grid-cols-2">
          {/* ── LEFT: Form ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-5 bg-white border border-gray-200 shadow-sm dark:bg-gray-900 rounded-2xl dark:border-gray-800"
          >
            <motion.h2 variants={fadeInUp} className="text-lg font-bold">
              📝 Your Details
            </motion.h2>

            <motion.div variants={fadeInUp}>
              <Label>Your Full Name</Label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Purva Mehta"
                className={inputCls}
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Label>Your Current Role / Title</Label>
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Full Stack Developer"
                className={inputCls}
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Label>Your Key Skills</Label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, .NET Core, C#, SQL..."
                className={inputCls}
              />
              <p className="mt-1 text-xs text-gray-400">
                Comma separated — be specific
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Label>Experience Summary</Label>
              <input
                type="text"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="3+ years building web applications"
                className={inputCls}
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Label required>Job Description</Label>
              <textarea
                name="jobDescription"
                value={form.jobDescription}
                onChange={handleChange}
                rows={7}
                placeholder={
                  "Paste the full job description here...\n\nThe more detail you provide, the more tailored your letter will be."
                }
                className={`${inputCls} resize-none`}
              />
              <p className="mt-1 text-xs text-gray-400">
                {form.jobDescription.length} characters
                {form.jobDescription.length > 0 &&
                  form.jobDescription.length < 30 && (
                    <span className="ml-2 text-yellow-400">
                      — add more detail for better results
                    </span>
                  )}
              </p>
            </motion.div>

            {/* Tone */}
            <motion.div variants={fadeInUp}>
              <Label>Writing Tone</Label>
              <div className="space-y-2">
                {TONE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`
                    flex items-center gap-3 p-3 rounded-xl cursor-pointer border
                    transition-all duration-200
                    ${
                      form.tone === option.value
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={option.value}
                      checked={form.tone === option.value}
                      onChange={handleChange}
                      className="accent-blue-500"
                    />
                    <div>
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-gray-400">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Generate Button */}
            <motion.button
              variants={fadeInUp}
              onClick={handleGenerate}
              disabled={loading || !canGenerate}
              className={`
                w-full py-3 rounded-xl font-semibold text-sm
                flex items-center justify-center gap-2 transition-all duration-200
                ${
                  canGenerate && !loading
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                  <span>Generating...</span>
                </>
              ) : (
                <>✨ Generate Cover Letter</>
              )}
            </motion.button>

            {!canGenerate && (
              <p className="text-xs text-center text-gray-400">
                Paste a job description to unlock generation
              </p>
            )}
          </motion.div>

          {/* ── RIGHT: Sticky Output Panel ── */}
          <div
            ref={outputRef}
            className="overflow-hidden bg-white border border-gray-200 shadow-sm lg:sticky lg:top-24 lg:self-start dark:bg-gray-900 rounded-2xl dark:border-gray-800"
          >
            {/* Output Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span className="text-sm font-semibold">Generated Letter</span>
                {generatedLetter && (
                  <span className="ml-2 text-xs text-gray-400">
                    {wordCount} words · {readTime} min read
                  </span>
                )}
              </div>

              {hasGenerated && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                    ${
                      copied
                        ? "bg-green-500 text-white"
                        : "border border-gray-200 dark:border-gray-700 hover:border-blue-400 text-gray-600 dark:text-gray-400"
                    }
                  `}
                  >
                    {copied ? "✅ Copied!" : "📋 Copy"}
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="
                    px-3 py-1.5 rounded-lg text-xs font-medium
                    border border-gray-200 dark:border-gray-700
                    hover:border-blue-400 text-gray-600 dark:text-gray-400
                    transition-all duration-200"
                  >
                    🔄 Retry
                  </button>
                </div>
              )}
            </div>

            {/* Output Body */}
            <div className="p-6 min-h-[400px]">
              {/* Empty state */}
              {!loading && !generatedLetter && !error && (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-16 text-center text-gray-400">
                  <span className="text-5xl">✉️</span>
                  <p className="text-sm">
                    Fill in your details and paste a job description,
                    <br />
                    then click Generate.
                  </p>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm">
                    Claude is writing your letter...
                  </span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="py-8 text-center">
                  <p className="mb-2 text-sm text-red-400">{error}</p>
                  <p className="text-xs text-gray-400">
                    Open DevTools → Console for details
                  </p>
                </div>
              )}

              {/* ✅ Streaming output */}
              <AnimatePresence>
                {generatedLetter && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {generatedLetter
                      .split("\n\n")
                      .filter(Boolean)
                      .map((para, i) => (
                        <p
                          key={i}
                          className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                        >
                          {para.trim()}
                        </p>
                      ))}

                    {/* Blinking cursor while streaming */}
                    {!hasGenerated && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 align-middle"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Output Footer */}
            {hasGenerated && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400">⚡ Powered by Claude AI</p>
                <p className="text-xs text-gray-400">
                  Always review before sending
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverLetter;
