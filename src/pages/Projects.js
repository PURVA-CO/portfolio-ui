import React, { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../animations/variants";
import AIExplainerModal from "../components/AIExplainerModal"; // ✅ NEW

// ─────────────────────────────────────────────────────────────
// Skeleton Card — shown while API loads
// ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="overflow-hidden bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse">
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700" />
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  // ✅ NEW — which project's AI modal is open (null = closed)
  // Stores the whole project object so modal has all its data
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p) =>
          p.techStack?.toLowerCase().includes(filter.toLowerCase())
        );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="py-16">
      <h2 className="mb-10 text-3xl font-bold text-center">My Projects</h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["All", "React", ".NET", "FullStack"].map((tech) => (
          <button
            key={tech}
            onClick={() => setFilter(tech)}
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              filter === tech
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Error State */}
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

      {/* Skeleton Loader */}
      {loading && !error && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      )}

      {/* Empty State */}
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

      {/* Projects Grid */}
      {!loading && !error && filteredProjects.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              className="flex flex-col overflow-hidden transition duration-300 bg-gray-100 dark:bg-gray-900 rounded-xl hover:scale-105"
            >
              {/* Image */}
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

              {/* Content */}
              <div className="flex flex-col flex-1 p-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>

                <p className="flex-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {project.description}
                </p>

                {/* Tech Stack Badge */}
                {project.techStack && (
                  <span className="inline-block px-2 py-1 mt-3 text-xs text-blue-500 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 w-fit">
                    {project.techStack}
                  </span>
                )}

                {/* Links Row */}
                <div className="flex flex-wrap gap-4 mt-4">
                  {project.projectUrl && (
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

                {/* ✅ NEW — AI Explain Button */}
                {/* onClick stores the whole project in selectedProject state */}
                {/* This triggers the modal to open with this project's data */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-4 text-sm font-medium text-blue-400 transition-all duration-200 border border-dashed rounded-lg border-blue-400/50 hover:bg-blue-500/10 hover:border-blue-400 group"
                >
                  <span className="transition-transform duration-200 group-hover:scale-110">
                    ✨
                  </span>
                  Explain with AI
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ✅ AI EXPLAINER MODAL */}
      {/* Only renders when selectedProject is not null */}
      {/* onClose sets selectedProject back to null → modal disappears */}
      {selectedProject && (
        <AIExplainerModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

export default Projects;
