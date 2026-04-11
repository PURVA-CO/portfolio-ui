// import ThemeToggle from "./ThemeToggle";
// import { useState, useContext } from "react";
// import { AvailabilityContext } from "../context/AvailabilityContext"; // ✅ tune in
// import { Link } from "react-router-dom";

// function Navbar() {
//   // ✅ One line to access global availability state
//   // No props needed — Context handles it
//   const { isAvailable } = useContext(AvailabilityContext);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <nav className="sticky top-0 z-50 bg-gray-900 dark:bg-gray-800">
//       <div className="max-w-6xl px-4 py-4 mx-auto">

//       </div>
//       <div className="flex items-center justify-between">
//         {/* LEFT SIDE (Logo) */}
//         <Link to="/" className="text-2xl font-bold text-blue-400">MyPortfolio</Link>

//         {/* RIGHT SIDE (Menu + Toggle) */}
//         <div className="items-center hidden gap-6 text-gray-300 md:flex">
//           {/* <a href="#" className="hover:text-blue-400">
//             Home
//           </a> */}
//           <button
//             onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//             className="hover:text-blue-400"
//           >
//             Home
//           </button>

//           <a href="#projects" className="hover:text-blue-400">
//             Projects
//           </a>

//           <a href="#contact" className="hover:text-blue-400">
//             Contact
//           </a>
//           <Link to="/blog" className="hover:text-blue-400">
//             Blog
//           </Link>

//           {/* ✅ HIRE ME BADGE */}
//           {/* Shows green "Open to Work" or red "Not Available" */}
//           {/* based on isAvailable from Context */}
//           <div
//             className="flex items-center gap-2 px-3 py-1.5 rounded-full border
//                           border-gray-700 bg-gray-800 dark:bg-gray-900"
//           >
//             {/* ✅ Pulsing dot — two overlapping circles trick */}
//             <span className="relative flex h-2.5 w-2.5">
//               {/* Outer ring — animate-ping scales out and fades */}
//               <span
//                 className={`animate-ping absolute inline-flex h-full w-full
//                             rounded-full opacity-75
//                             ${isAvailable ? "bg-green-400" : "bg-red-400"}`}
//               />

//               {/* Inner solid dot — always visible */}
//               <span
//                 className={`relative inline-flex h-2.5 w-2.5 rounded-full
//                             ${isAvailable ? "bg-green-500" : "bg-red-500"}`}
//               />
//             </span>

//             {/* Status Text */}
//             <span
//               className={`text-xs font-semibold tracking-wide
//                           ${isAvailable ? "text-green-400" : "text-red-400"}`}
//             >
//               {isAvailable ? "Open to Work" : "Not Available"}
//             </span>
//           </div>

//           {/* 👉 ADD HERE */}
//           <ThemeToggle />
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { useState, useContext } from "react";
import ThemeToggle from "./ThemeToggle";
import { AvailabilityContext } from "../context/AvailabilityContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { isAvailable } = useContext(AvailabilityContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 shadow-md dark:bg-gray-800">
      <div className="max-w-6xl px-4 py-4 mx-auto">
        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-400">
            PM Dev Studio
          </Link>

          {/* ── DESKTOP NAV (md and above) ── */}
          <div className="items-center hidden gap-6 text-gray-300 md:flex">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="transition-colors duration-200 hover:text-blue-400"
            >
              Home
            </button>
            <a
              href="#projects"
              className="transition-colors duration-200 hover:text-blue-400"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="transition-colors duration-200 hover:text-blue-400"
            >
              Contact
            </a>
            <Link
              to="/blog"
              className="transition-colors duration-200 hover:text-blue-400"
            >
              Blog
            </Link>
            <Link
              to="/cover-letter"
              className="transition-colors duration-200 hover:text-blue-400"
            >
              Cover Letter
            </Link>

            {/* Availability Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700 bg-gray-800 dark:bg-gray-900">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isAvailable ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </span>
              <span
                className={`text-xs font-semibold tracking-wide ${
                  isAvailable ? "text-green-400" : "text-red-400"
                }`}
              >
                {isAvailable ? "Open to Work" : "Not Available"}
              </span>
            </div>

            <ThemeToggle />
          </div>

          {/* ── MOBILE RIGHT: ThemeToggle + Hamburger ── */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="p-1 text-gray-300 transition-colors hover:text-blue-400"
              aria-label="Toggle navigation menu"
            >
              {/* Animated 3-line → X */}
              <div className="flex flex-col justify-between w-6 h-5">
                <span
                  className={`block h-0.5 w-full bg-current rounded transition-all duration-300 origin-center ${
                    menuOpen ? "rotate-45 translate-y-2.5" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current rounded transition-all duration-300 ${
                    menuOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-current rounded transition-all duration-300 origin-center ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ── MOBILE DROPDOWN MENU ── */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${menuOpen ? "max-h-80 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
        >
          <div className="border-t border-gray-700 pt-3 pb-2 flex flex-col gap-0.5">
            {[
              {
                label: "🏠 Home",
                action: () => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  closeMenu();
                },
                type: "button",
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-left px-3 py-2.5 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}

            {[
              { label: "🚀 Projects", href: "#projects" },
              { label: "📬 Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="px-3 py-2.5 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}

            {[
              { label: "📝 Blog", to: "/blog" },
              { label: "✉️ Cover Letter", to: "/cover-letter" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={closeMenu}
                className="px-3 py-2.5 text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Availability status in mobile menu */}
            <div className="flex items-center gap-2 px-3 py-2 mt-1 border-t border-gray-800">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isAvailable ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </span>
              <span
                className={`text-xs font-semibold ${
                  isAvailable ? "text-green-400" : "text-red-400"
                }`}
              >
                {isAvailable ? "Open to Work" : "Not Available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
