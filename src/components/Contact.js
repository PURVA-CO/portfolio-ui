import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await API.post("/contact", form);

      toast.success("Message sent successfully!");

      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong. Please try again!"); // ✅ User gets feedback
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 text-center">
      <h2 className="mb-6 text-3xl font-bold">Contact Me</h2>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 rounded"
          required
        />

        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending.." : "Send Message"}
        </button>
      </form>
    </section>
  );
}

export default Contact;
