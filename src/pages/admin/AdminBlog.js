import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdPublish,
  MdUnpublished,
} from "react-icons/md";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tag: "",
  emoji: "✍️",
  readTime: "",
  isPublished: false,
  publishedAt: new Date().toISOString().split("T")[0],
};

function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "published" | "draft"

  const fetchBlogs = async () => {
    const res = await API.get("/blog/all");
    setBlogs(res.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (blog) => {
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      tag: blog.tag,
      emoji: blog.emoji,
      readTime: blog.readTime,
      isPublished: blog.isPublished,
      publishedAt:
        blog.publishedAt?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
    });
    setEditingId(blog.id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Auto-generate slug from title while typing
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const autoSlug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setForm({ ...form, title, slug: autoSlug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        publishedAt: new Date(form.publishedAt).toISOString(),
      };
      if (editingId) {
        await API.put(`/blog/${editingId}`, payload);
        toast.success("Blog post updated!");
      } else {
        await API.post("/blog", payload);
        toast.success("Blog post created!");
      }
      setShowModal(false);
      fetchBlogs();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post permanently?")) return;
    await API.delete(`/blog/${id}`);
    toast.success("Post deleted!");
    fetchBlogs();
  };

  const handleTogglePublish = async (id, currentStatus) => {
    await API.patch(`/blog/${id}/toggle`);
    toast.success(currentStatus ? "Post unpublished" : "Post published! 🎉");
    fetchBlogs();
  };

  // Filter by tab
  const filtered = blogs.filter((b) => {
    if (activeTab === "published") return b.isPublished;
    if (activeTab === "draft") return !b.isPublished;
    return true;
  });

  const publishedCount = blogs.filter((b) => b.isPublished).length;
  const draftCount = blogs.filter((b) => !b.isPublished).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <p className="text-sm text-gray-400">
            {publishedCount} published · {draftCount} draft
            {draftCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <MdAdd size={18} /> New Post
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: "all", label: `All (${blogs.length})` },
          { key: "published", label: `Published (${publishedCount})` },
          { key: "draft", label: `Drafts (${draftCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
              ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Blog Table */}
      <div className="overflow-hidden bg-gray-900 rounded-xl">
        {filtered.length === 0 ? (
          <p className="py-12 text-sm text-center text-gray-500">
            No posts here yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 bg-gray-800 border-b border-gray-700">
                <th className="px-4 py-3 text-left">Post</th>
                <th className="px-4 py-3 text-left">Tag</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog) => (
                <tr
                  key={blog.id}
                  className="transition border-b border-gray-800 hover:bg-gray-800"
                >
                  {/* Title + Emoji */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{blog.emoji}</span>
                      <div>
                        <p className="font-medium text-white">{blog.title}</p>
                        <p className="text-xs text-gray-500">{blog.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Tag */}
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs text-blue-400 rounded-full bg-blue-500/20">
                      {blog.tag}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium
                      ${
                        blog.isPublished
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Publish / Unpublish toggle */}
                      <button
                        onClick={() =>
                          handleTogglePublish(blog.id, blog.isPublished)
                        }
                        title={blog.isPublished ? "Unpublish" : "Publish"}
                        className={`transition ${
                          blog.isPublished
                            ? "text-gray-400 hover:text-yellow-400"
                            : "text-gray-400 hover:text-green-400"
                        }`}
                      >
                        {blog.isPublished ? (
                          <MdUnpublished size={18} />
                        ) : (
                          <MdPublish size={18} />
                        )}
                      </button>

                      <button
                        onClick={() => openEdit(blog)}
                        className="text-gray-400 transition hover:text-blue-400"
                      >
                        <MdEdit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-gray-400 transition hover:text-red-400"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Post" : "New Blog Post"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* Row: Emoji + Title */}
              <div className="flex gap-3">
                <input
                  type="text"
                  name="emoji"
                  value={form.emoji}
                  onChange={handleChange}
                  placeholder="✍️"
                  maxLength={4}
                  className="w-16 px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-center text-xl"
                />
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleTitleChange}
                  placeholder="Post Title"
                  required
                  className="flex-1 px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              {/* Slug (auto-filled, editable) */}
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  Slug (URL) — auto-generated
                </label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="my-post-title"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm font-mono"
                />
              </div>

              {/* Row: Tag + Read Time + Date */}
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  placeholder="Tag (e.g. React)"
                  className="px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                />
                <input
                  type="text"
                  name="readTime"
                  value={form.readTime}
                  onChange={handleChange}
                  placeholder="5 min read"
                  className="px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                />
                <input
                  type="date"
                  name="publishedAt"
                  value={form.publishedAt}
                  onChange={handleChange}
                  className="px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              {/* Excerpt */}
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Short description (shown in blog list)"
                required
                rows={2}
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm resize-none"
              />

              {/* Content */}
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  Content — supports ## headings and - bullet lists
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder={`## Introduction\n\nYour content here...\n\n## Section 2\n\n- Point one\n- Point two`}
                  required
                  rows={10}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm font-mono resize-none"
                />
              </div>

              {/* Publish toggle */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  name="isPublished"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-500"
                />
                <label htmlFor="isPublished" className="text-sm text-gray-300">
                  Publish immediately (visible to visitors)
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition text-sm"
              >
                {editingId ? "Update Post" : "Create Post"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBlog;
