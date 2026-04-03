import { useRef, useState } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { fadeInUp, staggerContainer } from "../animations/variants";

// ─────────────────────────────────────────────────────────────
// ✅ DATA — Edit this to match YOUR actual skill levels (0-100)
// Organized by category — each tab shows one category
// ─────────────────────────────────────────────────────────────
const skillsData = {
  Frontend: [
    { skill: "React",          value: 90 },
    { skill: "JavaScript",     value: 85 },
    { skill: "Tailwind CSS",   value: 80 },
    { skill: "Framer Motion",  value: 65 },
    { skill: "HTML & CSS",     value: 90 },
  ],
  Backend: [
    { skill: "ASP.NET Core",   value: 85 },
    { skill: "C#",             value: 88 },
    { skill: "REST APIs",      value: 85 },
    { skill: "SQL Server",     value: 78 },
    { skill: "Entity Framework",value: 75 },
  ],
  Tools: [
    { skill: "Git & GitHub",   value: 85 },
    { skill: "VS Code",        value: 90 },
    { skill: "Postman",        value: 80 },
    { skill: "Azure",          value: 50 },
    { skill: "Figma",          value: 60 },
  ],
  Soft: [
    { skill: "Problem Solving",value: 90 },
    { skill: "Teamwork",       value: 88 },
    { skill: "Communication",  value: 80 },
    { skill: "Self Learning",  value: 95 },
    { skill: "Adaptability",   value: 85 },
    { skill: "Time Mgmt",      value: 78 },
  ],
};

// ─────────────────────────────────────────────────────────────
// Tab icon map
// ─────────────────────────────────────────────────────────────
const tabIcons = {
  Frontend: "⚛️",
  Backend:  "⚙️",
  Tools:    "🛠️",
  Soft:     "🧠",
};

// ─────────────────────────────────────────────────────────────
// ✅ CUSTOM TOOLTIP for Recharts
// Shows a clean popup when hovering over radar points
// ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 text-sm bg-gray-900 border rounded-lg shadow-xl border-blue-500/30">
        <p className="font-semibold text-blue-400">{payload[0].payload.skill}</p>
        <p className="text-white">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────────────────────────
// ✅ SKILL BAR — Single animated progress bar
// grows from 0% → value% when isInView flips true
// transitionDelay staggers each bar 100ms after the previous
// ─────────────────────────────────────────────────────────────
const SkillBar = ({ skill, value, index, isInView }) => (
  <div className="mb-4">
    {/* Label + Percentage */}
    <div className="flex justify-between mb-1.5">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {skill}
      </span>
      <span className="text-sm font-semibold text-blue-400">
        {value}%
      </span>
    </div>

    {/* Bar Track */}
    <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-800">
      {/* ✅ Pure CSS animation — no Framer Motion needed for simple bars */}
      {/* transitionDelay = index * 100ms creates the stagger effect */}
      <div
        className="h-full transition-all duration-700 ease-out rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
        style={{
          width: isInView ? `${value}%` : "0%",
          transitionDelay: `${index * 100}ms`,
        }}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// ✅ MAIN SKILLS SECTION
// ─────────────────────────────────────────────────────────────
function Skills() {
  // ✅ Derived state pattern — activeTab drives currentSkills
  // Never store currentSkills in state — compute it!
  const [activeTab, setActiveTab] = useState("Frontend");
  const currentSkills = skillsData[activeTab];

  const sectionRef = useRef(null);

  // ✅ once: true — bars only animate in once
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section className="py-20 bg-white dark:bg-gray-950">

      {/* ── Section Header ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 mb-12 text-center"
      >
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase"
        >
          What I Work With
        </motion.p>
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold">
          My Skills
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          className="w-16 h-1 mx-auto mt-4 bg-blue-400 rounded-full"
        />
      </motion.div>

      <div className="max-w-5xl px-4 mx-auto" ref={sectionRef}>

        {/* ── Tab Buttons ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {Object.keys(skillsData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                transition-all duration-200 border
                ${activeTab === tab
                  ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-blue-400"
                }
              `}
            >
              <span>{tabIcons[tab]}</span>
              {tab}
            </button>
          ))}
        </div>

        {/* ── Animated Content (Radar + Bars) ── */}
        {/* ✅ AnimatePresence + key change = fade out old, fade in new */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid items-center grid-cols-1 gap-10 md:grid-cols-2"
          >

            {/* ── LEFT: Radar Chart ── */}
            <div className="w-full h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={currentSkills} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>

                  {/* Web grid lines */}
                  <PolarGrid
                    stroke="#e5e7eb"
                    className="dark:stroke-gray-700"
                    gridType="polygon"
                  />

                  {/* Skill labels around the edge */}
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{
                      fontSize: 11,
                      fontWeight: 600,
                      fill: "#6b7280",
                    }}
                  />

                  {/* Value rings (0, 25, 50, 75, 100) — hidden for cleaner look */}
                  <PolarRadiusAxis
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />

                  {/* ✅ The filled radar shape */}
                  <Radar
                    dataKey="value"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    fill="#60a5fa"
                    fillOpacity={0.25}
                    dot={{ fill: "#60a5fa", r: 4 }}
                    activeDot={{ r: 6, fill: "#3b82f6" }}
                  />

                  {/* Hover tooltip */}
                  <Tooltip content={<CustomTooltip />} />

                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* ── RIGHT: Animated Skill Bars ── */}
            <div className="w-full">
              {currentSkills.map((item, index) => (
                <SkillBar
                  key={item.skill}
                  skill={item.skill}
                  value={item.value}
                  index={index}
                  isInView={isInView}
                />
              ))}
            </div>

          </motion.div>
        </AnimatePresence>

        {/* ── Bottom Note ── */}
        <p className="mt-10 text-xs text-center text-gray-400 dark:text-gray-600">
          Values reflect personal assessment of proficiency • Always learning 🚀
        </p>

      </div>
    </section>
  );
}

export default Skills;