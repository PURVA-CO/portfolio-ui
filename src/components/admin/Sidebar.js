import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdDashboard,
  MdWork,
  MdPerson,
  MdMail,
  MdDescription,
  MdCode,
  MdLogout,
  MdArticle,
} from "react-icons/md";

const navItems = [
  { to: "/admin/dashboard",  label: "Dashboard",   icon: <MdDashboard size={20} /> },
  { to: "/admin/projects",   label: "Projects",    icon: <MdWork size={20} /> },
  { to: "/admin/hero",       label: "Hero Editor", icon: <MdPerson size={20} /> },
  { to: "/admin/contacts",   label: "Inbox",       icon: <MdMail size={20} /> },
  { to: "/admin/resume",     label: "Resume",      icon: <MdDescription size={20} /> },
  { to: "/admin/skills",     label: "Skills",      icon: <MdCode size={20} /> },
  { to: "/admin/blog",      label: "Blog",        icon: <MdArticle size={20} /> }, // ✅ NEW
];

function Sidebar() {
  const { logout, adminUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen text-white bg-gray-900">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">⚡ Admin Panel</h1>
        <p className="mt-1 text-xs text-gray-400">Welcome, {adminUser}</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <MdLogout size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;