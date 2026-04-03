import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// ✅ DATA — Edit this array to update your timeline
// type: "work" | "education" | "achievement"
// ─────────────────────────────────────────────────────────────
const timelineData = [
  {
    year: "2022 – Present",
    title: "Full Stack Developer",
    place: "ActoSoft Technologies",
    description:
      "Building scalable web applications using ASP.NET FrameWork and MSSQL. Leading frontend architecture decisions and Collaborated directly with clients to gather requirements, clarify business needs, and propose technical solutions for new modules and feature enhancements.",
    type: "work",
    icon: "💼",
  },
  {
    year: "2022 – 2022 (3 months)",
    title: "InternShip Trainee",
    place: "IT Hub Software Solution",
    description:
      "Completed a 3-month internship focused on full stack development. Worked on Figma , Html and javascript. Gained hands-on experience in building responsive web applications and collaborating in an agile team environment.",
    type: "work",
    icon: "💼",
  },
  {
    year: "2018 – 2022",
    title: "Bachelor of Electronics Engineering",
    place: "Shantilal Shah Engineering College",
    description:
      "Graduated with distinction. Focused on software engineering, data structures, and web technologies.",
    type: "education",
    icon: "🎓",
  },
  {
    year: "2020",
    title: "Started Coding Journey",
    place: "Self Taught",
    description:
      "Fell in love with programming. Built first React app, first .NET API, and never looked back.",
    type: "achievement",
    icon: "🚀",
  },
];

// ─────────────────────────────────────────────────────────────
// Color map per type — easily extensible
// ─────────────────────────────────────────────────────────────
const typeColors = {
  work: "bg-blue-100  dark:bg-blue-900/40  text-blue-500  dark:text-blue-300",
  education:
    "bg-green-100 dark:bg-green-900/40 text-green-500 dark:text-green-300",
  achievement:
    "bg-purple-100 dark:bg-purple-900/40 text-purple-500 dark:text-purple-300",
};

// ─────────────────────────────────────────────────────────────
// ✅ SINGLE TIMELINE CARD
// Each card has its OWN useInView — triggers independently
// isLeft controls which side it sits on + which direction it slides from
// ─────────────────────────────────────────────────────────────
const TimelineCard = ({ item, index }) => {
  const cardRef = useRef(null);

  // ✅ Each card triggers itself — not the whole section
  // margin: "-80px" = wait until card is 80px inside viewport before triggering
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });

  // Even index → right side, Odd index → left side
  const isLeft = index % 2 !== 0;

  // ✅ Slide direction based on side
  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -60 : 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="relative flex items-center justify-center mb-12">
      {/* ── CENTER DOT ── */}
      <div className="absolute z-10 -translate-x-1/2 left-1/2">
        <div className="relative flex items-center justify-center w-5 h-5 bg-blue-400 border-4 border-white rounded-full shadow-md dark:border-gray-950">
          {/* ✅ Pulsing ring — only animates when card is in view */}
          {isInView && (
            <motion.div
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 bg-blue-400 rounded-full"
            />
          )}
        </div>
      </div>

      {/* ── YEAR BADGE (opposite side of card) ── */}
      <div
        className={`
          hidden md:flex absolute left-1/2 -translate-x-1/2 top-0
          ${isLeft ? "md:translate-x-8" : "md:-translate-x-full md:pr-8"}
          items-center
        `}
      />

      {/* ── CARD ── */}
      {/* ml-auto / mr-auto pushes card to correct side */}
      <motion.div
        ref={cardRef}
        variants={cardVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={`
          w-full md:w-5/12 p-5 rounded-2xl shadow-sm
          bg-gray-50 dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          hover:border-blue-400 dark:hover:border-blue-500
          hover:shadow-md hover:shadow-blue-500/10
          transition-all duration-300
          ${isLeft ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"}
        `}
      >
        {/* Top Row — icon + type badge + year */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.icon}</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                typeColors[item.type]
              }`}
            >
              {item.type}
            </span>
          </div>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
            {item.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {item.title}
        </h3>

        {/* Place */}
        <p className="text-sm text-blue-400 font-medium mt-0.5">{item.place}</p>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {item.description}
        </p>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ✅ MAIN TIMELINE SECTION
// ─────────────────────────────────────────────────────────────
function Timeline() {
  const sectionRef = useRef(null);

  // ✅ useScroll tracks how far user has scrolled through this section
  // offset: start when section center hits viewport center,
  //         end when section bottom hits viewport center
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  // ✅ useTransform maps scroll 0→1 to scaleY 0→1
  // The vertical line GROWS as you scroll down through the timeline
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-950">
      {/* Section Header */}
      <div className="px-4 mb-16 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase">
          My Journey
        </p>
        <h2 className="text-3xl font-bold">Experience & Education</h2>
        <div className="w-16 h-1 mx-auto mt-4 bg-blue-400 rounded-full" />
      </div>

      {/* Timeline Container */}
      <div ref={sectionRef} className="relative max-w-4xl px-4 mx-auto">
        {/* ✅ THE GROWING LINE */}
        {/* transformOrigin: top → line grows downward from top */}
        {/* scaleY controlled by scroll position */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800">
          <motion.div
            style={{ scaleY: lineScaleY, transformOrigin: "top" }}
            className="absolute inset-0 bg-blue-400 rounded-full"
          />
        </div>

        {/* Cards — data-driven, each gets its own index for left/right logic */}
        {timelineData.map((item, index) => (
          <TimelineCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Timeline;
