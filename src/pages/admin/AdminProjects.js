import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { MdEdit, MdDelete, MdAdd, MdClose } from "react-icons/md";

const emptyForm = {
  title: "",
  description: "",
  imageUrl: "",
  projectUrl: "",
  githubUrl: "",
  techStack: "",
};

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      projectUrl: project.projectUrl,
      githubUrl: project.githubUrl || "",
      techStack: project.techStack || "",
    });
    setEditingId(project.id);
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/projects/${editingId}`, form);
        toast.success("Project updated!");
      } else {
        await API.post("/projects", form);
        toast.success("Project added!");
      }
      setShowModal(false);
      fetchProjects();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await API.delete(`/projects/${id}`);
    toast.success("Deleted!");
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-gray-400">
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <MdAdd size={18} /> Add Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="overflow-hidden bg-gray-900 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 bg-gray-800 border-b border-gray-700">
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Tech</th>
              <th className="px-4 py-3 text-left">Clicks</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                className="transition border-b border-gray-800 hover:bg-gray-800"
              >
                <td className="px-4 py-3 font-medium text-white">{p.title}</td>
                <td className="px-4 py-3 text-gray-400">{p.techStack}</td>
                <td className="px-4 py-3 text-blue-400">{p.clickCount}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEdit(p)}
                    className="mr-3 text-gray-400 transition hover:text-blue-400"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-gray-400 transition hover:text-red-400"
                  >
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg p-6 bg-gray-900 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Project" : "Add Project"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <MdClose size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { name: "title", placeholder: "Project Title", required: true },
                {
                  name: "imageUrl",
                  placeholder: "Image Filename (e.g. project.png)",
                },
                { name: "projectUrl", placeholder: "Live URL" },
                { name: "githubUrl", placeholder: "GitHub URL" },
                { name: "techStack", placeholder: "Tech Stack (e.g. React)" },
              ].map((field) => (
                <input
                  key={field.name}
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                />
              ))}
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                required
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition text-sm"
              >
                {editingId ? "Update Project" : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProjects;
