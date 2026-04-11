// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { fadeInUp } from "../animations/variants";
// import { FaGithub, FaLinkedinIn } from "react-icons/fa";
// import ParticleBackground from "./ParticleBackground"; // ✅ NEW
// import { Link } from "react-router-dom";
// import API from "../services/api";

// const roles = [
//   "Full Stack Developer",
//   "React Developer",
//   ".NET Developer",
//   "Problem Solver",
// ];

// function Hero() {
//   const [roleIndex, setRoleIndex] = useState(0);
//   const [hero, setHero] = useState({
//     name: "Purva Mehta",
//     tagline: "Full Stack Developer",
//     subTagline:
//       "I build scalable web applications using React and .NET Core. Passionate about clean code and modern UI.",
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRoleIndex((prev) => (prev + 1) % roles.length);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     API.get("/hero")
//       .then((res) => {
//         if (res.data) setHero(res.data);
//       })
//       .catch(() => {}); // falls back to default above
//   }, []);

//   const scrollTo = (id) => {
//     document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     // ✅ position: relative — anchors the absolute canvas inside this section
//     <section className="relative py-32 overflow-hidden text-center bg-white dark:bg-gray-950">
//       {/* ✅ LAYER 1 — 3D Particle Canvas (absolute, behind everything) */}
//       <ParticleBackground />

//       {/* ✅ LAYER 2 — All Hero content (relative + z-10 = floats above canvas) */}
//       {/* Without z-10 here, text would be hidden under the canvas */}
//       <div className="relative z-10">
//         <motion.h1
//           variants={fadeInUp}
//           initial="hidden"
//           animate="visible"
//           className="text-5xl font-bold"
//         >
//           Hi, I'm <span className="text-blue-400">{hero.name}</span>
//         </motion.h1>

//         {/* Cycling role */}
//         <motion.div
//           variants={fadeInUp}
//           initial="hidden"
//           animate="visible"
//           transition={{ ...fadeInUp.visible?.transition, delay: 0.3 }}
//           className="flex items-center justify-center h-8 mt-4"
//         >
//           <AnimatePresence mode="wait">
//             <motion.span
//               key={roleIndex}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.4 }}
//               className="text-xl font-semibold text-blue-400"
//             >
//               {roles[roleIndex]}
//             </motion.span>
//           </AnimatePresence>
//         </motion.div>

//         {/* Description */}
//         <motion.p
//           variants={fadeInUp}
//           initial="hidden"
//           animate="visible"
//           transition={{ ...fadeInUp.visible?.transition, delay: 0.5 }}
//           className="max-w-xl mx-auto mt-6 text-gray-600 dark:text-gray-400"
//         >
//           {hero.tagline}
//         </motion.p>
//         <motion.p
//           variants={fadeInUp}
//           initial="hidden"
//           animate="visible"
//           transition={{ ...fadeInUp.visible?.transition, delay: 0.5 }}
//           className="max-w-xl mx-auto mt-1 text-gray-600 dark:text-gray-400"
//         >
//           {hero.subTagline}
//         </motion.p>

//         {/* Social Links */}
//         <motion.div
//           variants={fadeInUp}
//           initial="hidden"
//           animate="visible"
//           transition={{ ...fadeInUp.visible?.transition, delay: 0.65 }}
//           className="flex justify-center gap-5 mt-6"
//         >
//           <a
//             href="https://github.com/PURVA-CO"
//             target="_blank"
//             rel="noreferrer"
//             className="text-gray-500 transition-colors duration-200 hover:text-blue-400"
//             aria-label="GitHub"
//           >
//             <FaGithub size={24} />
//           </a>
//           <a
//             href="https://www.linkedin.com/in/purva-metha/"
//             target="_blank"
//             rel="noreferrer"
//             className="text-gray-500 transition-colors duration-200 hover:text-blue-400"
//             aria-label="LinkedIn"
//           >
//             <FaLinkedinIn size={24} />
//           </a>
//         </motion.div>

//         {/* CTA Buttons */}
//         <motion.div
//           variants={fadeInUp}
//           initial="hidden"
//           animate="visible"
//           transition={{ ...fadeInUp.visible?.transition, delay: 0.8 }}
//           className="flex flex-wrap justify-center gap-4 mt-8"
//         >
//           <button
//             onClick={() => scrollTo("projects")}
//             className="px-6 py-2 text-white transition-colors duration-200 bg-blue-500 rounded hover:bg-blue-600"
//           >
//             View Projects
//           </button>

//           <button
//             onClick={() => scrollTo("contact")}
//             className="px-6 py-2 transition-colors duration-200 border border-gray-500 rounded hover:border-blue-400"
//           >
//             Contact Me
//           </button>

//           {/* <a
//             href="/Purva_Mehta_26_10_2000.pdf"
//             download
//             className="px-6 py-2 transition-colors duration-200 border border-gray-500 rounded hover:border-blue-400"
//           >
//             Download Resume
//           </a> */}

//           <Link
//             to="/resume"
//             className="px-6 py-2 border border-gray-500 rounded hover:border-blue-400"
//           >
//             View Resume
//           </Link>
//         </motion.div>
//       </div>
//     </section>
//   );
// }

// export default Hero;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "../animations/variants";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import ParticleBackground from "./ParticleBackground";
import { Link } from "react-router-dom";
import API from "../services/api";

const roles = [
  "Full Stack Developer",
  "React Developer",
  ".NET Developer",
  "Problem Solver",
];

function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [hero, setHero] = useState({
    name: "Purva Mehta",
    tagline:
      "FullStack Developer | Building Scalable Web Experiences with React & .NET",
    subTagline:
      "Passionate about clean architecture, modern UI, and solving real-world business problems through technology.",
  });

  useEffect(() => {
    const interval = setInterval(
      () => setRoleIndex((p) => (p + 1) % roles.length),
      2000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    API.get("/hero")
      .then((res) => {
        if (res.data) setHero(res.data);
      })
      .catch(() => {});
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative py-20 overflow-hidden text-center bg-white sm:py-28 md:py-32 dark:bg-gray-950">
      <ParticleBackground />

      <div className="relative z-10 max-w-2xl px-4 mx-auto">
        {/* Name — scales from small to large */}
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
        >
          Hi, I'm <span className="text-blue-400">{hero.name}</span>
        </motion.h1>

        {/* Cycling role */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ ...fadeInUp.visible?.transition, delay: 0.3 }}
          className="flex items-center justify-center mt-3 h-7 sm:h-8"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold text-blue-400 sm:text-lg md:text-xl"
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Description — appropriate text size on mobile */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ ...fadeInUp.visible?.transition, delay: 0.5 }}
          className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400"
        >
          {hero.tagline}
        </motion.p>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ ...fadeInUp.visible?.transition, delay: 0.55 }}
          className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400"
        >
          {hero.subTagline}
        </motion.p>

        {/* Social links */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ ...fadeInUp.visible?.transition, delay: 0.65 }}
          className="flex justify-center gap-5 mt-5"
        >
          <a
            href="https://github.com/PURVA-CO"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 transition-colors hover:text-blue-400"
            aria-label="GitHub"
          >
            <FaGithub size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/purva-metha/"
            target="_blank"
            rel="noreferrer"
            className="text-gray-500 transition-colors hover:text-blue-400"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={22} />
          </a>
        </motion.div>

        {/* CTA Buttons — wrap cleanly on mobile */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ ...fadeInUp.visible?.transition, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mt-6 sm:mt-8"
        >
          <button
            onClick={() => scrollTo("projects")}
            className="px-5 py-2 text-sm text-white transition-colors duration-200 bg-blue-500 rounded-lg sm:text-base hover:bg-blue-600"
          >
            View Projects
          </button>

          <button
            onClick={() => scrollTo("contact")}
            className="px-5 py-2 text-sm transition-colors duration-200 border border-gray-500 rounded-lg sm:text-base hover:border-blue-400"
          >
            Contact Me
          </button>

          <Link
            to="/resume"
            className="px-5 py-2 text-sm transition-colors duration-200 border border-gray-500 rounded-lg sm:text-base hover:border-blue-400"
          >
            View Resume
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
