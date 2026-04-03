import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "../data/blogPosts";
import { fadeInUp, staggerContainer } from "../animations/variants";

// ─────────────────────────────────────────────────────────────
// ✅ MINI MARKDOWN RENDERER
// Parses plain text content into styled JSX
// Handles: ## headings, - bullet items, plain paragraphs
// No library needed — simple and fully in our control
// ─────────────────────────────────────────────────────────────
const renderContent = (content) => {
  // Split by double newline → array of blocks
  const blocks = content.trim().split("\n\n").filter(Boolean);

  return blocks.map((block, i) => {
    const trimmed = block.trim();

    // ── ## Heading ──────────────────────────────────────────
    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="pb-2 mt-8 mb-3 text-xl font-bold text-gray-800 border-b border-gray-100 dark:text-white dark:border-gray-800"
        >
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    // ── - Bullet List ────────────────────────────────────────
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").filter((line) => line.startsWith("- "));

      return (
        <ul key={i} className="my-3 space-y-2">
          {items.map((item, j) => (
            <li
              key={j}
              className="flex gap-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
            >
              <span className="mt-1 text-blue-400 shrink-0">▸</span>
              {item.replace("- ", "")}
            </li>
          ))}
        </ul>
      );
    }

    // ── Plain Paragraph ──────────────────────────────────────
    return (
      <p
        key={i}
        className="my-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
      >
        {trimmed}
      </p>
    );
  });
};

// ─────────────────────────────────────────────────────────────
// ✅ MAIN BLOG POST PAGE
// ─────────────────────────────────────────────────────────────
function BlogPost() {
  const { slug } = useParams(); // ✅ reads :slug from the URL
  const navigate = useNavigate();

  // Find post matching the slug
  const post = blogPosts.find((p) => p.slug === slug);

  // ✅ Guard clause — always handle "not found"
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50 dark:bg-gray-950">
        <p className="mb-4 text-6xl">📭</p>
        <h2 className="mb-2 text-2xl font-bold">Post Not Found</h2>
        <p className="mb-6 text-gray-500">
          The post <span className="text-blue-400">"{slug}"</span> doesn't
          exist.
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="px-5 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          ← Back to Blog
        </button>
      </div>
    );
  }

  // Also find prev/next posts for navigation
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = blogPosts[currentIndex + 1] || null;
  const nextPost = blogPosts[currentIndex - 1] || null;

  return (
    <div className="min-h-screen px-4 py-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-1 mb-10 text-sm text-gray-500 transition-colors duration-200 hover:text-blue-400"
        >
          ← Back to Blog
        </button>

        {/* Post Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Emoji */}
          <motion.div variants={fadeInUp} className="mb-5 text-5xl">
            {post.emoji}
          </motion.div>

          {/* Tag + Meta */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-3 mb-4"
          >
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full
                             bg-blue-50 dark:bg-blue-900/30
                             text-blue-500 dark:text-blue-300"
            >
              {post.tag}
            </span>
            <span className="text-xs text-gray-400">{post.date}</span>
            <span className="text-xs text-gray-400">⏱ {post.readTime}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl font-bold leading-snug text-gray-900 dark:text-white"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            variants={fadeInUp}
            className="pl-4 mt-4 italic leading-relaxed text-gray-500 border-l-4 border-blue-400 dark:text-gray-400"
          >
            {post.excerpt}
          </motion.p>

          {/* Divider */}
          <motion.div
            variants={fadeInUp}
            className="my-8 border-t border-gray-200 dark:border-gray-800"
          />
        </motion.div>

        {/* ✅ Post Content — rendered by mini markdown parser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {renderContent(post.content)}
        </motion.div>

        {/* ── Prev / Next Navigation ── */}
        <div className="grid grid-cols-2 gap-4 pt-8 mt-16 border-t border-gray-200 dark:border-gray-800">
          {/* Previous post (older) */}
          {prevPost ? (
            <button
              onClick={() => navigate(`/blog/${prevPost.slug}`)}
              className="p-4 text-left transition-all duration-200 border border-gray-200 rounded-xl dark:border-gray-800 hover:border-blue-400 group"
            >
              <p className="mb-1 text-xs text-gray-400">← Older</p>
              <p className="text-sm font-semibold text-gray-700 transition-colors duration-200 dark:text-gray-300 group-hover:text-blue-400">
                {prevPost.title}
              </p>
            </button>
          ) : (
            <div />
          )}

          {/* Next post (newer) */}
          {nextPost ? (
            <button
              onClick={() => navigate(`/blog/${nextPost.slug}`)}
              className="col-start-2 p-4 text-right transition-all duration-200 border border-gray-200 rounded-xl dark:border-gray-800 hover:border-blue-400 group"
            >
              <p className="mb-1 text-xs text-gray-400">Newer →</p>
              <p className="text-sm font-semibold text-gray-700 transition-colors duration-200 dark:text-gray-300 group-hover:text-blue-400">
                {nextPost.title}
              </p>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogPost;
