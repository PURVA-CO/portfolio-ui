import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "../data/blogPosts";
import { fadeInUp, staggerContainer } from "../animations/variants";
import API from "../services/api";

// All unique tags from posts + "All"
//const allTags = ["All", ...new Set(blogPosts.map((p) => p.tag))];

const splitTags = (tagString) =>
  tagString
    ? tagString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

function BlogList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  //const allTags = ["All", ...new Set(blogPosts.map((p) => p.tag))];

  // ✅ Fetch published posts from API
  useEffect(() => {
    API.get("/blog")
      .then((res) => setBlogs(res.data))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Build tag list dynamically from fetched posts
  //  const allTags = ["All", ...new Set(blogs.map((p) => p.tag).filter(Boolean))];
  // ✅ Collect ALL individual tags from every post, deduplicated
  const allTags = ["All", ...new Set(blogs.flatMap((p) => splitTags(p.tag)))];

  // ✅ Derived state — filter posts from data, never store in state
  // const filtered =
  //   filter === "All" ? blogs : blogs.filter((p) => p.tag === filter);

  // ✅ Filter: post matches if ANY of its tags equals the selected filter
  const filtered =
    filter === "All"
      ? blogs
      : blogs.filter((p) => splitTags(p.tag).includes(filter));

  return (
    <div className="min-h-screen px-4 py-16 bg-gray-50 dark:bg-gray-950">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-400"
        >
          ← Back to Portfolio
        </button>
      </div>

      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto mb-12 text-center"
      >
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase"
        >
          Writing
        </motion.p>
        <motion.h1 variants={fadeInUp} className="text-4xl font-bold">
          📝 Dev Notes
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="max-w-xl mx-auto mt-3 text-gray-500 dark:text-gray-400"
        >
          Thoughts, learnings, and notes from my journey as a developer.
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={fadeInUp}
          className="w-16 h-1 mx-auto mt-5 bg-blue-400 rounded-full"
        />
      </motion.div>
      {/* ── Loading State ── */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-400 rounded-full border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && (
        <>
          {/* Tag Filter */}
          <div className="flex flex-wrap justify-center max-w-4xl gap-2 mx-auto mb-10">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`
              px-4 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 border
              ${
                filter === tag
                  ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20"
                  : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-blue-400"
              }
            `}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid max-w-4xl gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((post) => (
              <motion.article
                key={post.slug}
                variants={fadeInUp}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="p-6 transition-all duration-300 bg-white border border-gray-200 cursor-pointer group dark:bg-gray-900 dark:border-gray-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
              >
                {/* Emoji + Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{post.emoji}</span>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full
                               bg-blue-50 dark:bg-blue-900/30
                               text-blue-500 dark:text-blue-300"
                  >
                    {post.tag}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold leading-snug text-gray-800 transition-colors duration-200 dark:text-white group-hover:text-blue-400">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer — date + read time */}
                <div className="flex items-center justify-between pt-4 mt-5 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <span className="text-xs text-gray-400">
                    ⏱ {post.readTime}
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <p className="mb-4 text-5xl">📭</p>
              <p>
                No posts found for{" "}
                <span className="text-blue-400">"{filter}"</span>
              </p>
              <button
                onClick={() => setFilter("All")}
                className="px-5 py-2 mt-4 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                Show All Posts
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BlogList;
