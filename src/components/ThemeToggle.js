import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function ThemeToggle() {
  const { dark, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      aria-label={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`
        relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-300 border
        ${
          dark
            ? "bg-gray-800 border-gray-600 text-yellow-300 hover:border-yellow-400"
            : "bg-gray-100 border-gray-300 text-gray-700 hover:border-blue-400"
        }
      `}
    >
      {/* ✅ Animated icon that switches based on current theme */}
      <span className="inline-block text-base transition-transform duration-300 hover:rotate-12">
        {dark ? "☀️" : "🌙"}
      </span>

      {/* ✅ Step 1 Fix — Label shows what you SWITCH TO, not what you're in */}
      {/* dark=true  → says "Light" (you'll switch to light)  */}
      {/* dark=false → says "Dark"  (you'll switch to dark)   */}
      <span>{dark ? "Light" : "Dark"}</span>

      {/* ✨ Sliding pill indicator */}
      <span
        className={`
          absolute left-1 top-1 w-5 h-5 rounded-full transition-all duration-300
          ${
            dark
              ? "translate-x-full bg-yellow-300"
              : "translate-x-0 bg-blue-400"
          }
          opacity-20
        `}
      />
    </button>
  );
}

export default ThemeToggle;
