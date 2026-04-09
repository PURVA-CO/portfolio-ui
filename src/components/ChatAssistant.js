import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


const API_BASE = process.env.REACT_APP_API_URL?.replace("/api", "")
    || "https://localhost:7000";

// ─────────────────────────────────────────────────────────────
// ✅ SYSTEM PROMPT — Claude's identity and knowledge
// This is invisible to visitors but shapes every single reply
// Update this with YOUR real information
// ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an AI assistant representing Purva Mehta's developer portfolio.
You speak in first person AS Purva — use "I", "my", "I've built" etc.

ABOUT PURVA:
- Full Stack Developer with 3+ years of professional experience
- Core skills: React, JavaScript, TypeScript, ASP.NET Core, C#, SQL Server, Tailwind CSS
- Built 12+ projects ranging from small tools to full enterprise applications
- 500+ GitHub commits, active open source contributor
- Education: B.Sc Computer Science (graduated with distinction)
- Location: Ahmedabad, Gujarat, India
- Availability: Open to work — actively looking for new opportunities
- Contact: purva@email.com | github.com/purvamehta | linkedin.com/in/purvamehta

PERSONALITY & RESPONSE RULES:
- Friendly, confident, and slightly enthusiastic — like a real person, not a robot
- Always give specific, concrete answers — never vague ones
- Keep ALL replies under 80 words — shorter is better in chat
- Use plain language — no unnecessary jargon
- If asked about salary expectations, say you prefer to discuss directly
- If asked something you genuinely don't know, say: "Great question — reach me at purva@email.com for that!"
- Never make up projects or experience that isn't listed above
- If someone seems interested in hiring, encourage them to use the Contact section`;

// ─────────────────────────────────────────────────────────────
// Initial greeting message — first thing visitor sees
// ─────────────────────────────────────────────────────────────
const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Hi! 👋 I'm Purva's AI assistant. Ask me anything — skills, projects, experience, or availability!",
};

// Quick suggestion chips — shown before user types anything
const SUGGESTIONS = [
  "What are your strongest skills?",
  "Are you open to work?",
  "Tell me about your best project",
  "What's your experience level?",
];

// ─────────────────────────────────────────────────────────────
// ✅ SHARED STREAM READER — same pattern as CoverLetter
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
    buffer = lines.pop() || "";

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
          onChunk(parsed.delta.text);
        }
      } catch {}
    }
  }
}

// ─────────────────────────────────────────────────────────────
// ✅ MAIN CHAT ASSISTANT COMPONENT
// ─────────────────────────────────────────────────────────────
function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ Auto-scroll to latest message whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasUnread(false);
    }
  }, [isOpen]);

  // ─────────────────────────────────────────────────────────
  // ✅ SEND MESSAGE — the core chat function
  // ─────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput(""); // clear input immediately

    // Add user message to history
    const userMessage = { role: "user", content: userText };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setLoading(true);

    // ✅ Add empty assistant message — we'll stream into it
    const assistantMessage = { role: "assistant", content: "" };
    setMessages([...newHistory, assistantMessage]);

    try {
      // ✅ Send FULL history + system prompt to .NET proxy
      // Claude reads entire history = understands context of conversation
      // const response = await fetch("https://localhost:7000/api/ai/chat", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     systemPrompt: SYSTEM_PROMPT,
      //     // ✅ Only send role + content — no extra fields
      //     messages: newHistory.map((m) => ({
      //       role: m.role,
      //       content: m.content,
      //     })),
      //   }),
      // });

      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: SYSTEM_PROMPT,
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error(`Chat API error: ${response.status}`);

      let result = "";
      setLoading(false);

      // ✅ Stream into the last message (assistantMessage)
      // We update only the last element of the array each chunk
      await readStream(response, (chunk) => {
        result += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: result,
          };
          return updated;
        });
      });
    } catch (err) {
      console.error("Chat error:", err);
      setLoading(false);
      // Replace empty assistant message with error
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again! 🔄",
        };
        return updated;
      });
    }
  };

  // Handle Enter key in input
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Clear chat history
  const handleClear = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
  };

  return (
    <>
      {/* ══ FLOATING BUTTON ════════════════════════════════ */}
      {/* Always visible bottom-right — opens/closes chat    */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-50 flex items-center justify-center text-2xl text-white transition-colors duration-200 bg-blue-500 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 shadow-blue-500/30 hover:bg-blue-600"
        aria-label="Open AI Chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              💬
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread notification dot */}
        {hasUnread && !isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
        )}
      </motion.button>

      {/* ══ CHAT PANEL ═════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50
                       w-[340px] sm:w-[380px]
                       bg-white dark:bg-gray-900
                       rounded-2xl shadow-2xl shadow-black/20
                       border border-gray-200 dark:border-gray-700
                       flex flex-col overflow-hidden"
            style={{ maxHeight: "520px" }}
          >
            {/* ── Chat Header ── */}
            <div className="flex items-center justify-between px-4 py-3 text-white bg-blue-500">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex items-center justify-center w-8 h-8 text-sm font-bold bg-blue-400 rounded-full">
                  PM
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">
                    Purva's AI Assistant
                  </p>
                  <p className="text-xs text-blue-100 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Always online
                  </p>
                </div>
              </div>

              {/* Clear button */}
              <button
                onClick={handleClear}
                className="px-2 py-1 text-xs text-blue-100 transition-colors rounded hover:text-white hover:bg-blue-600"
                title="Clear conversation"
              >
                Clear
              </button>
            </div>

            {/* ── Messages ── */}
            <div
              className="flex-1 p-4 space-y-3 overflow-y-auto"
              style={{ maxHeight: "320px" }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                    max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                    ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                    }
                  `}
                  >
                    {/* ✅ Empty content = Claude is thinking */}
                    {msg.content === "" ? (
                      <div className="flex gap-1 items-center py-0.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gray-400"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{
                              duration: 0.7,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {/* ✅ Invisible anchor — scrollIntoView snaps here */}
              <div ref={bottomRef} />
            </div>

            {/* ── Suggestion Chips (shown when only initial message) ── */}
            {messages.length === 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-2.5 py-1.5 rounded-full
                               bg-blue-50 dark:bg-blue-900/30
                               text-blue-500 dark:text-blue-300
                               hover:bg-blue-100 dark:hover:bg-blue-900/50
                               border border-blue-200 dark:border-blue-800
                               transition-colors duration-150"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input Row ── */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 dark:border-gray-800">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 px-3 py-2 text-sm transition-all duration-200 bg-gray-100 border border-transparent rounded-xl dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 disabled:opacity-50"
              />

              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className={`
                  w-9 h-9 rounded-xl flex items-center justify-center
                  transition-all duration-200 shrink-0
                  ${
                    input.trim() && !loading
                      ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white rounded-full border-t-transparent"
                  />
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 pb-2 text-center">
              <p className="text-xs text-gray-300 dark:text-gray-600">
                ⚡ Powered by Claude AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatAssistant;
