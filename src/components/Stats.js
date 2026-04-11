// import { useRef, useState, useEffect } from "react";
// import { motion, useInView } from "framer-motion";
// import { fadeInUp, staggerContainer } from "../animations/variants";

// // ─────────────────────────────────────────────────────────────
// // ✅ DATA — To add/edit stats, only change this array
// // No JSX changes needed when you update numbers or add new cards
// // ─────────────────────────────────────────────────────────────
// const stats = [
//   { icon: "🚀", value: 5,  suffix: "+", label: "Projects Built"    },
//   { icon: "💼", value: 3,   suffix: "+", label: "Years Experience"   },
//   { icon: "⭐", value: 50, suffix: "+", label: "GitHub Commits"     },
// ];

// // ─────────────────────────────────────────────────────────────
// // ✅ CUSTOM HOOK — useCountUp
// // Counts from 0 → end over `duration` ms
// // Only starts when `shouldStart` flips to true (scroll trigger)
// // ─────────────────────────────────────────────────────────────
// const useCountUp = (end, duration = 2000, shouldStart = false) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     // ✅ Don't start until the section is in view
//     if (!shouldStart) return;

//     let startTime = null;

//     const animate = (timestamp) => {
//       // Record when animation first started
//       if (!startTime) startTime = timestamp;

//       // Progress: 0 (start) → 1 (end)
//       const progress = Math.min((timestamp - startTime) / duration, 1);

//       // ✅ Ease-out cubic: starts fast, slows to final value (professional feel)
//       const eased = 1 - Math.pow(1 - progress, 3);

//       setCount(Math.floor(eased * end));

//       // Keep animating until progress reaches 1
//       if (progress < 1) requestAnimationFrame(animate);
//     };

//     // ✅ Use requestAnimationFrame — syncs with 60fps screen refresh
//     // Much smoother than setInterval
//     requestAnimationFrame(animate);
//   }, [shouldStart, end, duration]);

//   return count;
// };

// // ─────────────────────────────────────────────────────────────
// // ✅ ANIMATED STAT CARD
// // Receives `isInView` from parent — "lift state up" pattern
// // One parent controls when ALL children start counting together
// // ─────────────────────────────────────────────────────────────
// const AnimatedStat = ({ icon, value, suffix, label, isInView, delay }) => {
//   const count = useCountUp(value, 2000, isInView);

//   return (
//     <motion.div
//       variants={fadeInUp}
//       className="flex flex-col items-center justify-center gap-3 p-8 transition-all duration-300 border border-gray-200 rounded-2xl bg-gray-50 dark:bg-gray-900 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 group"
//     >
//       {/* Icon with subtle scale on hover */}
//       <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
//         {icon}
//       </span>

//       {/* Animated Number */}
//       <div className="text-5xl font-bold text-blue-400 tabular-nums">
//         {count}
//         <span className="text-3xl">{suffix}</span>
//       </div>

//       {/* Label */}
//       <p className="text-sm font-medium tracking-wide text-center text-gray-500 uppercase dark:text-gray-400">
//         {label}
//       </p>
//     </motion.div>
//   );
// };

// // ─────────────────────────────────────────────────────────────
// // ✅ MAIN SECTION
// // ─────────────────────────────────────────────────────────────
// function Stats() {
//   // Attach ref to the section — useInView watches this element
//   const ref = useRef(null);

//   // ✅ once: true → animation fires exactly once on first scroll into view
//   const isInView = useInView(ref, { once: true, margin: "-100px" });

//   return (
//     <section
//       ref={ref}
//       className="py-20 bg-white dark:bg-gray-950"
//     >
//       {/* Section Header */}
//       <motion.div
//         variants={staggerContainer}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         className="mb-12 text-center"
//       >
//         <motion.p
//           variants={fadeInUp}
//           className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase"
//         >
//           By The Numbers
//         </motion.p>

//         <motion.h2
//           variants={fadeInUp}
//           className="text-3xl font-bold"
//         >
//           My Achievements
//         </motion.h2>

//         <motion.div
//           variants={fadeInUp}
//           className="w-16 h-1 mx-auto mt-4 bg-blue-400 rounded-full"
//         />
//       </motion.div>

//       {/* Stats Grid */}
//       {/* ✅ Data-driven: adding a new stat = adding one object to the stats array above */}
//       <motion.div
//         variants={staggerContainer}
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true }}
//         className="grid max-w-4xl grid-cols-2 gap-6 px-4 mx-auto lg:grid-cols-3"
//       >
//         {stats.map((stat, index) => (
//           <AnimatedStat
//             key={stat.label}
//             {...stat}
//             isInView={isInView}   // ✅ Parent passes scroll state down
//             delay={index * 0.15}  // Each card staggers slightly
//           />
//         ))}
//       </motion.div>
//     </section>
//   );
// }

// export default Stats;

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "../animations/variants";

const stats = [
  { icon: "🚀", value: 5, suffix: "+", label: "Projects Built" },
  { icon: "💼", value: 3, suffix: "+", label: "Years Experience" },
  { icon: "⭐", value: 50, suffix: "+", label: "GitHub Commits" },
];

const useCountUp = (end, duration = 2000, shouldStart = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [shouldStart, end, duration]);
  return count;
};

const AnimatedStat = ({ icon, value, suffix, label, isInView }) => {
  const count = useCountUp(value, 2000, isInView);
  return (
    <motion.div
      variants={fadeInUp}
      className="flex flex-col items-center justify-center w-full gap-2 p-5 transition-all duration-300 border border-gray-200 sm:gap-3 sm:p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 group"
    >
      <span className="text-3xl transition-transform duration-300 sm:text-4xl group-hover:scale-110">
        {icon}
      </span>
      <div className="text-3xl font-bold text-blue-400 sm:text-5xl tabular-nums">
        {count}
        <span className="text-xl sm:text-3xl">{suffix}</span>
      </div>
      <p className="text-xs font-medium tracking-wide text-center text-gray-500 uppercase dark:text-gray-400">
        {label}
      </p>
    </motion.div>
  );
};

function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 bg-white sm:py-20 dark:bg-gray-950">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="px-4 mb-10 text-center sm:mb-12"
      >
        <motion.p
          variants={fadeInUp}
          className="mb-2 text-xs font-semibold tracking-widest text-blue-400 uppercase sm:text-sm"
        >
          By The Numbers
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="text-2xl font-bold sm:text-3xl"
        >
          My Achievements
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          className="w-16 h-1 mx-auto mt-4 bg-blue-400 rounded-full"
        />
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl px-4 mx-auto"
      >
        {/*
          ✅ MOBILE GRID FIX:
          - 3 items total, 2 per row on mobile = 2 on top + 1 alone at bottom
          - Fix: use flex with wrap + each card has fixed width on mobile
          - This auto-centers the lone bottom card using justify-center
        */}
        <div className="flex flex-wrap justify-center gap-4 sm:grid sm:grid-cols-3 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="w-[45%] sm:w-full">
              <AnimatedStat {...stat} isInView={isInView} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Stats;
