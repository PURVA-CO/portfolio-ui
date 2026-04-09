import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE =
  process.env.REACT_APP_API_URL?.replace("/api", "") ||
  "https://localhost:7000";

function AIExplainerModal({ project, onClose }) {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    explainProject();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const explainProject = async () => {
    setLoading(true);
    setError(null);
    setExplanation("");

    try {
      const prompt = `You are a friendly tech explainer helping non-technical 
recruiters understand developer portfolio projects.

Explain this project in simple, engaging language across 3 short paragraphs:
- Project name: ${project.title}
- Description: ${project.description}
- Tech stack: ${project.techStack || "Modern web technologies"}

Rules:
- Zero jargon. If you must use a tech term, explain it in plain English immediately.
- Paragraph 1: What the project DOES (for a normal person).
- Paragraph 2: What technologies were used and WHY they matter (simply).
- Paragraph 3: What skills this demonstrates about the developer.
- Enthusiastic but professional tone.
- Maximum 160 words total.
- Do NOT use bullet points. Flowing paragraphs only.`;

      // ✅ Call YOUR .NET proxy — not Anthropic directly
      // Change this URL to match your .NET API port
      // const response = await fetch("https://localhost:7000/api/ai/explain", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ prompt }),
      // });

      const response = await fetch(`${API_BASE}/api/ai/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("API error response:", errText);
        throw new Error(`API error: ${response.status}`);
      }

      // ─────────────────────────────────────────────────────
      // ✅ ROBUST STREAM PARSER
      // Problem: chunks can arrive split mid-line
      // Solution: keep a buffer, only parse complete lines
      // ─────────────────────────────────────────────────────
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      let buffer = ""; // ✅ accumulates incomplete chunks

      setLoading(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode bytes → string and ADD to buffer
        // stream: true tells decoder more chunks may come
        buffer += decoder.decode(value, { stream: true });

        // ✅ Only process COMPLETE lines (ending with \n)
        // Split on newlines, keep the last piece in buffer
        // (it might be an incomplete line)
        const lines = buffer.split("\n");

        // ✅ Last element might be incomplete — put it back in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();

          // Debug: log every line so you can see what's arriving
          // Remove this console.log once everything works
          if (trimmed) console.log("SSE line:", trimmed);

          // Skip empty lines and non-data lines
          if (!trimmed.startsWith("data:")) continue;

          const data = trimmed.slice(5).trim(); // remove "data: " prefix

          if (data === "[DONE]") {
            console.log("Stream complete ✅");
            break;
          }

          try {
            const parsed = JSON.parse(data);

            // ✅ Handle all delta types from Anthropic's SSE format
            if (
              parsed.type === "content_block_delta" &&
              parsed.delta?.type === "text_delta"
            ) {
              result += parsed.delta.text;
              setExplanation(result);
            }
          } catch (parseErr) {
            // Log parse failures so we can debug them
            console.warn("Could not parse SSE line:", data, parseErr);
          }
        }
      }

      // ✅ Flush any remaining buffer content
      if (buffer.trim()) {
        console.log("Remaining buffer:", buffer);
      }

      // ✅ Fallback: if stream gave nothing, try non-streaming
      if (!result) {
        console.warn("Stream produced no text — trying non-streaming fallback");
        await explainProjectFallback(prompt);
      }
    } catch (err) {
      console.error("AI Explainer error:", err);
      setError("Couldn't generate explanation. Check console for details.");
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // ✅ FALLBACK — Non-streaming version
  // If streaming has issues, this gets the full response at once
  // Add a separate endpoint in .NET: POST /api/ai/explain-simple
  // ─────────────────────────────────────────────────────────
  const explainProjectFallback = async (prompt) => {
    try {
      // const response = await fetch(
      //   "https://localhost:7000/api/ai/explain-simple",
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ prompt }),
      //   }
      // );

      const response = await fetch(`${API_BASE}/api/ai/explain-simple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok)
        throw new Error(`Fallback API error: ${response.status}`);

      const data = await response.json();

      // Anthropic non-stream response shape:
      // { content: [{ type: "text", text: "..." }] }
      const text = data?.content?.[0]?.text || "";

      if (text) {
        setExplanation(text);
      } else {
        console.error("Fallback response shape:", data);
        setError("Received empty response from AI.");
      }
    } catch (err) {
      console.error("Fallback also failed:", err);
      setError("Both streaming and fallback failed. Check .NET API logs.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg overflow-hidden bg-white border border-gray-200 shadow-2xl dark:bg-gray-900 rounded-2xl dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">✨</span>
                <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                  AI Explainer
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {project.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="mt-1 text-xl text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[180px]">
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
                <span className="text-sm">Claude is thinking...</span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="py-4 text-center">
                <p className="mb-2 text-sm text-red-400">{error}</p>
                <p className="mb-4 text-xs text-gray-400">
                  Open DevTools → Console for detailed logs
                </p>
                <button
                  onClick={explainProject}
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Streamed Text */}
            {!loading && !error && explanation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300"
              >
                {explanation
                  .split("\n\n")
                  .map((para, i) =>
                    para.trim() ? <p key={i}>{para.trim()}</p> : null
                  )}
                {/* Blinking cursor */}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 align-middle"
                />
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              ⚡ Powered by Claude AI
            </p>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm text-gray-500 dark:text-gray-400
                         border border-gray-200 dark:border-gray-700 rounded-lg
                         hover:border-blue-400 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default AIExplainerModal;
