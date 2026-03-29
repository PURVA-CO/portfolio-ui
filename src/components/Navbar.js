import ThemeToggle from "./ThemeToggle";

function Navbar() {
  return (
    <nav className="bg-gray-900 dark:bg-gray-800">
      <div className="flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">

        {/* LEFT SIDE (Logo) */}
        <h1 className="text-2xl font-bold text-blue-400">
          MyPortfolio
        </h1>

        {/* RIGHT SIDE (Menu + Toggle) */}
        <div className="flex items-center gap-6 text-gray-300">

          <a href="#" className="hover:text-blue-400">
            Home
          </a>

          <a href="#projects" className="hover:text-blue-400">
            Projects
          </a>

          <a href="#contact" className="hover:text-blue-400">
            Contact
          </a>

          {/* 👉 ADD HERE */}
          <ThemeToggle />

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
