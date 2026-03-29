import React, { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../animations/variants";

const SkeletonCard = () => (
  <div className="overflow-hidden bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse">
    {/* Image placeholder */}
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
    {/* Content placeholders */}
    <div className="p-4 space-y-3">
      <div className="w-3/4 h-5 bg-gray-300 rounded dark:bg-gray-700" />
      <div className="w-full h-4 bg-gray-300 rounded dark:bg-gray-700" />
      <div className="w-5/6 h-4 bg-gray-300 rounded dark:bg-gray-700" />
      <div className="flex gap-3 mt-4">
        <div className="w-16 h-4 bg-gray-300 rounded dark:bg-gray-700" />
        <div className="w-16 h-4 bg-gray-300 rounded dark:bg-gray-700" />
      </div>
    </div>
  </div>
);

function Projects() {
  const [projects, setProjects] = useState([]);

  // ✅ Step 3 — Added loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p) =>
          p.techStack?.toLowerCase().includes(filter.toLowerCase())
        );

  console.log("Filter:", filter);

  useEffect(() => {
    fetchProjects();
  }, []);

  console.log("Filtered:", filteredProjects);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      // ✅ Step 3 — Catch API errors and store in state
      setError("Failed to load projects. Please check your connection.");
    } finally {
      // ✅ Step 3 — Always reset loading whether success or failure
      setLoading(false);
    }
  };

  console.log(projects);

  return (
    <section id="projects" className="py-16">
      <h2 className="mb-10 text-3xl font-bold text-center">My Projects</h2>
      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {["All", "React", ".NET", "FullStack"].map((tech) => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            className={`px-4 py-2 rounded ${
              filter === tech
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* ✅ Step 3 — Error State */}
      {error && (
        <div className="py-16 text-center">
          <p className="text-lg text-red-400">{error}</p>
          <button
            onClick={fetchProjects}
            className="px-6 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ✨ Step 4 — Skeleton Loader: shown while loading */}
      {loading && !error && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      )}

      {/* ✅ Step 3 — Empty State: shown when filter returns 0 results */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-400">
            No projects found for{" "}
            <span className="text-blue-400">"{filter}"</span>.
          </p>
          <button
            onClick={() => setFilter("All")}
            className="px-6 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Show All Projects
          </button>
        </div>
      )}

      {/* ✅ GRID CONTAINER */}
      {/* ✅ Project Grid — only shown when loaded, no error, and has results */}
      {!loading && !error && filteredProjects.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col overflow-hidden transition duration-300 bg-gray-100 dark:bg-gray-900 rounded-xl hover:scale-105"
            >
              {/* ✅ IMAGE CONTAINER */}
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={
                    project.imageUrl
                      ? `/images/${project.imageUrl}`
                      : `/images/default.png`
                  }
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* ✅ CONTENT */}
              <div className="flex flex-col flex-1 p-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>

                <p className="flex-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>

                {/* ✨ Step 5 — Tech stack badge */}
                {project.techStack && (
                  <span className="inline-block px-2 py-1 mt-3 text-xs text-blue-500 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 w-fit">
                    {project.techStack}
                  </span>
                )}

                {/* ✅ Step 1 Fix + Step 5 — Secure links with labels */}
                <div className="flex gap-4 mt-4">
                  {project.projectUrl && (
                    // ✅ Step 1 — Added rel="noreferrer" to fix security vulnerability
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-400 transition-colors duration-200 hover:text-blue-300"
                    >
                      <FaExternalLinkAlt size={12} />
                      Live Demo
                    </a>
                  )}

                  {project.githubUrl && (
                    // ✅ Step 1 — Added rel="noreferrer" here too
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-400 transition-colors duration-200 hover:text-gray-200"
                    >
                      <FaGithub size={14} />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

export default Projects;
