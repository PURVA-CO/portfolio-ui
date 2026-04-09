import ThemeToggle from "./ThemeToggle";
import { useContext } from "react";
import { AvailabilityContext } from "../context/AvailabilityContext"; // ✅ tune in
import { Link } from "react-router-dom";

function Navbar() {
  // ✅ One line to access global availability state
  // No props needed — Context handles it
  const { isAvailable } = useContext(AvailabilityContext);

  return (
    <nav className="bg-gray-900 dark:bg-gray-800">
      <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
        {/* LEFT SIDE (Logo) */}
        <h1 className="text-2xl font-bold text-blue-400">MyPortfolio</h1>

        {/* RIGHT SIDE (Menu + Toggle) */}
        <div className="flex items-center gap-6 text-gray-300">
          {/* <a href="#" className="hover:text-blue-400">
            Home
          </a> */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-blue-400"
          >
            Home
          </button>

          <a href="#projects" className="hover:text-blue-400">
            Projects
          </a>

          <a href="#contact" className="hover:text-blue-400">
            Contact
          </a>
          <Link to="/blog" className="hover:text-blue-400">
            Blog
          </Link>

          {/* ✅ HIRE ME BADGE */}
          {/* Shows green "Open to Work" or red "Not Available" */}
          {/* based on isAvailable from Context */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border
                          border-gray-700 bg-gray-800 dark:bg-gray-900"
          >
            {/* ✅ Pulsing dot — two overlapping circles trick */}
            <span className="relative flex h-2.5 w-2.5">
              {/* Outer ring — animate-ping scales out and fades */}
              <span
                className={`animate-ping absolute inline-flex h-full w-full 
                            rounded-full opacity-75
                            ${isAvailable ? "bg-green-400" : "bg-red-400"}`}
              />

              {/* Inner solid dot — always visible */}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full
                            ${isAvailable ? "bg-green-500" : "bg-red-500"}`}
              />
            </span>

            {/* Status Text */}
            <span
              className={`text-xs font-semibold tracking-wide
                          ${isAvailable ? "text-green-400" : "text-red-400"}`}
            >
              {isAvailable ? "Open to Work" : "Not Available"}
            </span>
          </div>

          {/* 👉 ADD HERE */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
