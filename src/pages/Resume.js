import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AvailabilityContext } from "../context/AvailabilityContext";

// ─────────────────────────────────────────────────────────────
// ✅ RESUME DATA — Edit this to match your real info
// Keeping data separate from JSX = easy to update later
// ─────────────────────────────────────────────────────────────
const resumeData = {
  name:     "Purva Mehta",
  role:     "Full Stack Developer",
  email:    "mehtapurva265@gmail.com",
  phone:    "+91 9574942221",
  location: "Veraval,Gir Somnath, Gujarat",
  github:   "github.com/purvamehta",
  linkedin: "linkedin.com/in/purvamehta",
  summary:
    "Software developer with more than 3 year of experience specializing in building scalable web applications and backend Solutions. Proficient in Microsoft SQL Server, and .NET Framework. Seeking to leverage my expertise in full-stack development To contribute to innovative projects that drive business value.",

  experience: [
    {
      title:    "Full Stack Developer",
      company:  "ActoSoft",
      period:   "November, 2022 – Present",
      points: [
        "Developed and maintained scalable web applications using .NET Framework",
        "Designed and optimized SQL Server database schemas, improving query performance and data integrity.",
        "Collaborated directly with clients to gather requirements, clarify business needs, and propose technical solutions for new modules and feature enhancements",
        "Proactively researched and adopted best practices and new tools to improve development efficiency.",
      ],
    },
    {
      title:    "Software Engineering Intern",
      company:  "IT Hub Software Solution",
      period:   "January, 2022 –  April, 2022",
      points: [
        "Designed UI wireframes using Figma and implemented responsive layouts using HTML and CSS.",
        "Created multi-selection features for filtering services on the website.",
        "Integrated SQL and MySQL databases with frontend components for dynamic dashboards.",
      ],
    },
  ],

  education: [
    {
      degree:  "Bachelor of Electronics and Communication Engineering",
      school:  "Gujarat Technological University, Shantilal Shah Engineering College",
      period:  "June,2018 – May, 2022",
      detail:  "Graduated with distinction. Focused on software engineering and web technologies.",
    },
  ],

  skills: {
    Frontend: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML & CSS"],
    Backend:  ["ASP.NET Core", "C#", "REST APIs", "SQL Server", "Entity Framework"],
    Tools:    ["Git & GitHub", "Postman", "Docker", "Azure", "VS Code"],
  },

  certifications: [
    "Microsoft Certified: Azure Fundamentals (AZ-900)",
    "React – The Complete Guide (Udemy)",
  ],
};

// ─────────────────────────────────────────────────────────────
// ✅ Small helper — Section heading with a divider line
// ─────────────────────────────────────────────────────────────
const SectionHeading = ({ title }) => (
  <div className="mb-4">
    <h2 className="text-xs font-bold tracking-widest text-blue-500 uppercase">
      {title}
    </h2>
    <div className="mt-1 border-t border-gray-200 dark:border-gray-700" />
  </div>
);

// ─────────────────────────────────────────────────────────────
// ✅ MAIN RESUME PAGE
// ─────────────────────────────────────────────────────────────
function Resume() {
  // ✅ useNavigate(-1) = go back to wherever the user came from
  const navigate = useNavigate();

  // Read availability from global context
  const { isAvailable } = useContext(AvailabilityContext);

  const handlePrint = () => window.print();

  return (
    // min-h-screen bg — visible on screen, @media print overrides to white
    <div className="min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-950">

      {/* ── Top Action Bar ── */}
      {/* no-print class → this whole bar disappears when printing */}
      <div className="flex items-center justify-between max-w-3xl mx-auto mb-6 no-print">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 transition-colors duration-200 hover:text-blue-400"
        >
          ← Back to Portfolio
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2 text-sm text-white transition-colors duration-200 bg-blue-500 rounded-lg shadow hover:bg-blue-600"
        >
          🖨️ Print / Save PDF
        </button>

      </div>

      {/* ── Resume Card ── */}
      {/* This white card is what gets printed — clean A4-style */}
      <div
        className="max-w-3xl p-10 mx-auto bg-white shadow-xl resume-card dark:bg-gray-900 rounded-2xl print:shadow-none print:rounded-none print:p-8"
      >

        {/* ══ HEADER ══════════════════════════════════════════ */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-start">

          {/* Name + Role + Availability */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {resumeData.name}
            </h1>
            <p className="mt-1 font-semibold text-blue-500">{resumeData.role}</p>

            {/* ✅ Availability badge — reads from global Context */}
            <span
              className={`inline-flex items-center gap-1.5 mt-2 text-xs font-semibold
                          px-2.5 py-1 rounded-full
                          ${isAvailable
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                          }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full
                                ${isAvailable ? "bg-green-500" : "bg-red-500"}`}
              />
              {isAvailable ? "Open to Work" : "Not Available"}
            </span>
          </div>

          {/* Contact Info */}
          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400 md:text-right">
            <p>📧 {resumeData.email}</p>
            <p>📱 {resumeData.phone}</p>
            <p>📍 {resumeData.location}</p>
            <p>🔗 {resumeData.github}</p>
            <p>💼 {resumeData.linkedin}</p>
          </div>

        </div>

        {/* ══ SUMMARY ══════════════════════════════════════════ */}
        <div className="mb-8">
          <SectionHeading title="Summary" />
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {resumeData.summary}
          </p>
        </div>

        {/* ══ EXPERIENCE ═══════════════════════════════════════ */}
        <div className="mb-8">
          <SectionHeading title="Experience" />

          <div className="space-y-6">
            {resumeData.experience.map((exp) => (
              <div key={exp.title + exp.company}>

                {/* Role + Period */}
                <div className="flex flex-wrap items-start justify-between gap-1">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="text-xs font-medium text-blue-500">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-400">{exp.period}</span>
                </div>

                {/* Bullet Points */}
                <ul className="mt-2 space-y-1">
                  {exp.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400"
                    >
                      <span className="text-blue-400 mt-0.5 shrink-0">▸</span>
                      {point}
                    </li>
                  ))}
                </ul>

              </div>
            ))}
          </div>
        </div>

        {/* ══ EDUCATION ════════════════════════════════════════ */}
        <div className="mb-8">
          <SectionHeading title="Education" />

          {resumeData.education.map((edu) => (
            <div key={edu.degree} className="flex flex-wrap justify-between gap-1">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                  {edu.degree}
                </h3>
                <p className="text-xs font-medium text-blue-500">{edu.school}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {edu.detail}
                </p>
              </div>
              <span className="text-xs text-gray-400">{edu.period}</span>
            </div>
          ))}
        </div>

        {/* ══ SKILLS ═══════════════════════════════════════════ */}
        <div className="mb-8">
          <SectionHeading title="Skills" />

          <div className="space-y-3">
            {Object.entries(resumeData.skills).map(([category, items]) => (
              <div key={category} className="flex flex-wrap items-start gap-3">

                <span className="text-xs font-bold text-gray-500 dark:text-gray-400
                                 w-16 shrink-0 pt-0.5">
                  {category}
                </span>

                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-full
                                 bg-blue-50 dark:bg-blue-900/30
                                 text-blue-600 dark:text-blue-300
                                 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ══ CERTIFICATIONS ═══════════════════════════════════ */}
        <div>
          <SectionHeading title="Certifications" />

          <ul className="space-y-1">
            {resumeData.certifications.map((cert) => (
              <li
                key={cert}
                className="flex gap-2 text-xs text-gray-600 dark:text-gray-400"
              >
                <span className="text-blue-400 shrink-0">✦</span>
                {cert}
              </li>
            ))}
          </ul>
        </div>

      </div>{/* end resume card */}
    </div>
  );
}

export default Resume;