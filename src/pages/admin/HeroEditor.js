import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

function HeroEditor() {
  const [form, setForm] = useState({
    id: 0,
    name: "",
    tagline: "",
    subTagline: "",
    isVisible: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/hero")
      .then((res) => setForm(res.data))
      .catch(() => {}); // empty on first load is fine
  }, []);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put("/hero", form);
      toast.success("Hero section updated!");
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-2 text-2xl font-bold">Hero Editor</h2>
      <p className="mb-8 text-sm text-gray-400">
        Edit what visitors see in your hero section
      </p>

      {/* Live Preview */}
      <div className="p-6 mb-6 text-center bg-gray-900 border border-gray-700 rounded-xl">
        <p className="mb-3 text-xs tracking-wider text-gray-500 uppercase">
          Live Preview
        </p>
        <h1 className="text-3xl font-bold text-white">
          Hi, I'm{" "}
          <span className="text-blue-400">{form.name || "Your Name"}</span>
        </h1>
        <p className="mt-2 text-gray-400">
          {form.tagline || "Your tagline..."}
        </p>
        <p className="mt-1 text-sm text-gray-500">{form.subTagline}</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-4 bg-gray-900 rounded-xl"
      >
        <div>
          <label className="block mb-1 text-sm text-gray-400">Your Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Purva Mehta"
            required
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-400">Tagline</label>
          <input
            type="text"
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            placeholder="Full Stack Developer"
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm text-gray-400">
            Sub Tagline
          </label>
          <textarea
            name="subTagline"
            value={form.subTagline}
            onChange={handleChange}
            rows={3}
            placeholder="I build scalable web applications..."
            className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm resize-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isVisible"
            id="isVisible"
            checked={form.isVisible}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-500"
          />
          <label htmlFor="isVisible" className="text-sm text-gray-300">
            Portfolio is visible to public
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default HeroEditor;
