import { useEffect, useState } from "react";
import API from "../../services/api";
import { MdWork, MdMail, MdCode, MdDescription } from "react-icons/md";

function StatCard({ icon, label, value, color }) {
  return (
    <div
      className={`bg-gray-900 rounded-xl p-6 flex items-center gap-4 border-l-4 ${color}`}
    >
      <div className="text-3xl text-gray-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    projects: null,
    contacts: null,
    skills: null,
    resumes: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, contacts, skills, resumes] = await Promise.all([
          API.get("/projects"),
          API.get("/contact"),
          API.get("/skills"),
          API.get("/resume"),
        ]);
        setStats({
          projects: projects.data.length,
          contacts: contacts.data.length,
          skills: skills.data.length,
          resumes: resumes.data.length,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Dashboard</h2>
      <p className="mb-8 text-gray-400">Overview of your portfolio data</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<MdWork />}
          label="Projects"
          value={stats.projects}
          color="border-blue-500"
        />
        <StatCard
          icon={<MdMail />}
          label="Messages"
          value={stats.contacts}
          color="border-green-500"
        />
        <StatCard
          icon={<MdCode />}
          label="Skills"
          value={stats.skills}
          color="border-purple-500"
        />
        <StatCard
          icon={<MdDescription />}
          label="Resume Versions"
          value={stats.resumes}
          color="border-yellow-500"
        />
      </div>

      {/* Top Clicked Projects */}
      <TopClickedProjects />
    </div>
  );
}

function TopClickedProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get("/projects").then((res) => {
      const sorted = [...res.data]
        .sort((a, b) => b.clickCount - a.clickCount)
        .slice(0, 5);
      setProjects(sorted);
    });
  }, []);

  return (
    <div className="p-6 bg-gray-900 rounded-xl">
      <h3 className="mb-4 text-lg font-semibold">🔥 Top Clicked Projects</h3>
      {projects.length === 0 ? (
        <p className="text-sm text-gray-500">No data yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="py-2 text-left">Project</th>
              <th className="py-2 text-left">Tech</th>
              <th className="py-2 text-right">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-800 hover:bg-gray-800"
              >
                <td className="py-2 text-white">{p.title}</td>
                <td className="py-2 text-gray-400">{p.techStack}</td>
                <td className="py-2 font-semibold text-right text-blue-400">
                  {p.clickCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
