import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { MdUpload, MdDelete, MdCheckCircle } from "react-icons/md";

function ResumeManager() {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchResumes = async () => {
    const res = await API.get("/resume");
    setResumes(res.data);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded!");
      fetchResumes();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id) => {
    await API.patch(`/resume/${id}/set-active`);
    toast.success("Active resume updated!");
    fetchResumes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    await API.delete(`/resume/${id}`);
    toast.success("Deleted!");
    fetchResumes();
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-2 text-2xl font-bold">Resume Manager</h2>
      <p className="mb-6 text-sm text-gray-400">
        Upload PDF versions and set which one visitors download
      </p>

      {/* Upload Box */}
      <label className="flex flex-col items-center justify-center w-full h-32 mb-6 transition bg-gray-900 border-2 border-gray-700 border-dashed cursor-pointer rounded-xl hover:border-blue-500">
        <MdUpload size={28} className="mb-1 text-gray-400" />
        <p className="text-sm text-gray-400">
          {uploading ? "Uploading..." : "Click to upload PDF"}
        </p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {/* Resume List */}
      <div className="space-y-3">
        {resumes.length === 0 && (
          <p className="text-sm text-gray-500">No resumes uploaded yet.</p>
        )}
        {resumes.map((r) => (
          <div
            key={r.id}
            className={`flex items-center justify-between bg-gray-900 rounded-xl px-4 py-3 border transition
              ${r.isActive ? "border-green-500" : "border-gray-800"}`}
          >
            <div className="flex items-center gap-3">
              {r.isActive && (
                <MdCheckCircle size={18} className="text-green-400 shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium text-white">{r.fileName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(r.uploadedAt).toLocaleDateString()}
                  {r.isActive && (
                    <span className="ml-2 text-green-400">● Active</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!r.isActive && (
                <button
                  onClick={() => handleSetActive(r.id)}
                  className="text-xs px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 rounded-lg transition"
                >
                  Set Active
                </button>
              )}
              <button
                onClick={() => handleDelete(r.id)}
                className="text-gray-400 transition hover:text-red-400"
              >
                <MdDelete size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeManager;
