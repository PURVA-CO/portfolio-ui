function Skills() {
    const skills = ["React", ".NET Core", "C#", "SQL", "JavaScript"];
  
    return (
      <section className="py-20 text-center">
        <h2 className="mb-6 text-3xl font-bold">My Skills</h2>
  
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 text-sm transition bg-gray-200 rounded-full dark:bg-gray-800 hover:bg-blue-500"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    );
  }
  
  export default Skills;