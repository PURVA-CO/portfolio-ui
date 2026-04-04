import { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { MdDelete, MdMail, MdMarkEmailRead, MdReply } from "react-icons/md";

const STATUS_STYLES = {
  Unread: "bg-blue-500/20 text-blue-400",
  Read: "bg-gray-500/20 text-gray-400",
  Replied: "bg-green-500/20 text-green-400",
};

function ContactInbox() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);

  const fetchContacts = async () => {
    const res = await API.get("/contact");
    setContacts(res.data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const updateStatus = async (id, status) => {
    await API.patch(`/contact/${id}/status`, { status });
    toast.success(`Marked as ${status}`);
    fetchContacts();
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await API.delete(`/contact/${id}`);
    toast.success("Deleted!");
    setSelected(null);
    fetchContacts();
  };

  const unreadCount = contacts.filter((c) => c.status === "Unread").length;

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold">Contact Inbox</h2>
      <p className="mb-6 text-sm text-gray-400">
        {unreadCount > 0 ? (
          <span className="text-blue-400">
            {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
          </span>
        ) : (
          "All caught up!"
        )}
      </p>

      <div className="flex gap-6">
        {/* Message List */}
        <div className="w-1/2 space-y-2">
          {contacts.length === 0 && (
            <p className="text-sm text-gray-500">No messages yet.</p>
          )}
          {contacts.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c)}
              className={`bg-gray-900 rounded-xl p-4 cursor-pointer border transition
                ${
                  selected?.id === c.id
                    ? "border-blue-500"
                    : "border-gray-800 hover:border-gray-600"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-white">{c.name}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    STATUS_STYLES[c.status]
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">{c.email}</p>
              <p className="mt-1 text-xs text-gray-400 truncate">{c.message}</p>
              <p className="mt-1 text-xs text-gray-600">
                {new Date(c.receivedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Message Detail */}
        <div className="flex-1">
          {selected ? (
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selected.name}
                  </h3>
                  <p className="text-sm text-gray-400">{selected.email}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {new Date(selected.receivedAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    STATUS_STYLES[selected.status]
                  }`}
                >
                  {selected.status}
                </span>
              </div>

              <p className="pt-4 text-sm leading-relaxed text-gray-300 border-t border-gray-800">
                {selected.message}
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => updateStatus(selected.id, "Read")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs transition"
                >
                  <MdMarkEmailRead size={14} /> Mark Read
                </button>
                <button
                  onClick={() => updateStatus(selected.id, "Replied")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/30 hover:bg-green-600/50 text-green-400 rounded-lg text-xs transition"
                >
                  <MdReply size={14} /> Mark Replied
                </button>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-400 rounded-lg text-xs transition"
                >
                  <MdMail size={14} /> Reply via Mail
                </a>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 text-red-400 rounded-lg text-xs transition ml-auto"
                >
                  <MdDelete size={14} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-6 bg-gray-900 border border-gray-800 rounded-xl">
              <p className="text-sm text-gray-500">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactInbox;
