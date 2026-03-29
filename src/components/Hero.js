import { motion } from "framer-motion";
import { fadeInUp } from "../animations/variants";

function Hero() {
  return (
    <section className="py-24 text-center bg-white dark:bg-gray-950">
      {/* <h1 className="text-5xl font-bold leading-tight">
        Hi, I'm <span className="text-blue-400">Full Stack Developer</span>
      </h1> */}

      <motion.h1
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="text-5xl font-bold"
      >
        Hi, I'm Purva Mehta
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="mt-6 text-gray-600 dark:text-gray-400"
      >
        I build scalable web applications using React and .NET Core. Passionate
        about clean code and modern UI.
      </motion.p>

      <div className="flex justify-center gap-4 mt-8">
        <button className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600">
          View Projects
        </button>

        <button className="px-6 py-2 border border-gray-500 rounded hover:border-blue-400">
          Contact Me
        </button>
        <a
          href="/Purva_Mehta_26_10_2000.pdf"
          download
          className="px-6 py-2 border rounded hover:border-blue-400"
        >
          Download Resume
        </a>
      </div>
    </section>
  );
}

export default Hero;
