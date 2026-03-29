import React, { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../animations/variants";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p) => p.techStack === filter);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const data = await getProjects();
    setProjects(data);
  };

  return (
    <section id="projects" className="py-16">
      <h2 className="mb-10 text-3xl font-bold text-center">My Projects</h2>

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

      {/* ✅ GRID CONTAINER */}
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
            className="overflow-hidden transition duration-300 bg-gray-100 dark:bg-gray-900 rounded-xl hover:scale-105"
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
            <div className="p-4">
              <h3 className="text-xl font-semibold">{project.title}</h3>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {project.description}
              </p>

              <a
                href={project.projectUrl}
                target="_blank"
                className="inline-block mt-3 text-blue-400"
              >
                <FaExternalLinkAlt />
              </a>
              <a href={project.githubUrl} target="_blank">
                <FaGithub />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Projects;
