import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function ThemeToggle() {
  const { dark, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 transition border rounded hover:bg-gray-700"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

export default ThemeToggle;