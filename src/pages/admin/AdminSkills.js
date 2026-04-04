import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { MdAdd, MdDelete, MdEdit, MdClose } from "react-icons/md";

const emptyForm = { name: "", proficiencyLevel: 80, category: "" };

function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchSkills = async () => {
    const res = await API.get("/skills");
    setSkills(res.data);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };
  const openEdit = (s) => {
    setForm({
      name: s.name,
      proficiencyLevel: s.proficiencyLevel,
      category: s.category || "",
    });
    setEditingId(s.id);
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        proficiencyLevel: Number(form.proficiencyLevel),
      };
      if (editingId) {
        await API.put(`/skills/${editingId}`, payload);
        toast.success("Skill updated!");
      } else {
        await API.post("/skills", payload);
        toast.success("Skill added!");
      }
      setShowModal(false);
      fetchSkills();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    await API.delete(`/skills/${id}`);
    toast.success("Deleted!");
    fetchSkills();
  };

  // Group skills by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Skills</h2>
          <p className="text-sm text-gray-400">
            Manage skills with proficiency levels
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <MdAdd size={18} /> Add Skill
        </button>
      </div>

      {/* Grouped Skills */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="mb-3 text-xs tracking-wider text-gray-400 uppercase">
            {category}
          </h3>
          <div className="overflow-hidden bg-gray-900 rounded-xl">
            {items.map((skill, i) => (
              <div
                key={skill.id}
                className={`flex items-center gap-4 px-4 py-3 ${
                  i < items.length - 1 ? "border-b border-gray-800" : ""
                }`}
              >
                <div className="w-32 text-sm font-medium text-white shrink-0">
                  {skill.name}
                </div>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden bg-gray-800 rounded-full">
                    <div
                      className="h-full transition-all duration-500 bg-blue-500 rounded-full"
                      style={{ width: `${skill.proficiencyLevel}%` }}
                    />
                  </div>
                </div>
                <span className="w-10 text-xs text-right text-gray-400 shrink-0">
                  {skill.proficiencyLevel}%
                </span>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(skill)}
                    className="text-gray-400 transition hover:text-blue-400"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="text-gray-400 transition hover:text-red-400"
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <p className="text-sm text-gray-500">No skills added yet.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm p-6 bg-gray-900 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Skill" : "Add Skill"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <MdClose size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Skill name (e.g. React)"
                required
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
              />
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category (e.g. Frontend)"
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
              />
              <div>
                <label className="block mb-1 text-xs text-gray-400">
                  Proficiency: {form.proficiencyLevel}%
                </label>
                <input
                  type="range"
                  name="proficiencyLevel"
                  min="10"
                  max="100"
                  step="5"
                  value={form.proficiencyLevel}
                  onChange={handleChange}
                  className="w-full accent-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition text-sm"
              >
                {editingId ? "Update" : "Add Skill"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSkills;
