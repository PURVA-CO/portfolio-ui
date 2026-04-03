// ─────────────────────────────────────────────────────────────
// ✅ BLOG POSTS DATA — Your mini CMS
// To add a new post: just add one object to this array
// slug     → unique, URL-friendly (lowercase + hyphens)
// content  → ## for headings, - for list items,
//             blank line between paragraphs
// ─────────────────────────────────────────────────────────────

export const blogPosts = [
    {
      slug:     "why-i-love-react-hooks",
      title:    "Why I Love React Hooks",
      date:     "March 2026",
      readTime: "5 min read",
      tag:      "React",
      emoji:    "⚛️",
      excerpt:
        "Hooks completely changed how I think about React. Here's what clicked for me and why I'll never go back to class components.",
      content: `
  Hooks changed everything for me when I first started using them seriously. Before hooks, I was writing class components with lifecycle methods scattered everywhere — it felt messy and hard to follow.
  
  ## What is useState?
  
  useState lets you add local state to a functional component with one clean line. Instead of this.state and this.setState everywhere, you get a simple pair — the current value and a function to update it.
  
  The mental model is simple: when the value changes, the component re-renders with the new value. That's it.
  
  ## Why useEffect?
  
  useEffect replaced three lifecycle methods in one hook — componentDidMount, componentDidUpdate, and componentWillUnmount. The cleanup function in the return handles teardown, which means no more scattered unmount logic.
  
  The dependency array is the part people get wrong most often. Empty array means run once. A value in the array means run whenever that value changes. No array means run every render.
  
  ## The Custom Hook Pattern
  
  The best thing hooks unlocked is the ability to extract logic into custom hooks. Any repeated stateful logic — data fetching, form handling, scroll tracking — can become a reusable use-prefixed function. This is the pattern I use constantly now.
  
  ## Final Thoughts
  
  If you're still writing class components, I strongly encourage exploring hooks. The code is shorter, easier to read, and the logic is much easier to reuse. Start with useState and useEffect — those two cover 80% of real use cases.
      `,
    },
  
    {
      slug:     "clean-api-design-with-dotnet",
      title:    "Clean API Design with .NET Core",
      date:     "February 2026",
      readTime: "4 min read",
      tag:      ".NET",
      emoji:    "⚙️",
      excerpt:
        "After building several APIs, I've settled on patterns that make .NET Core services consistent, testable, and easy to extend.",
      content: `
  Building a REST API that's easy to maintain is harder than it sounds. After working on several .NET Core projects, I've settled on a few patterns that consistently lead to cleaner code.
  
  ## Repository Pattern
  
  Abstracting database access behind an interface keeps your controllers thin and your logic testable. Controllers should only orchestrate — they call the service, the service calls the repository, the repository talks to the database. Each layer has one job.
  
  ## DTOs Over Entities
  
  Never return your database entities directly from API endpoints. DTOs give you control over exactly what leaves your API. They protect against over-posting, hide internal fields, and let you shape responses without changing your database schema.
  
  ## Consistent Error Responses
  
  One thing that frustrates API consumers is inconsistent error shapes. I use a global exception middleware that catches unhandled errors and always returns the same structure — statusCode, message, and an optional errors array.
  
  ## Result Pattern Over Exceptions
  
  For expected failure cases — like "user not found" or "email already taken" — throwing exceptions is expensive. A Result type that wraps success or failure lets you handle these cases explicitly without try/catch everywhere.
  
  ## Final Thoughts
  
  These patterns add a little structure upfront but pay back quickly as the project grows. The key principle is separation of concerns — each piece does one thing, and changing one piece doesn't break others.
      `,
    },
  
    {
      slug:     "my-journey-into-fullstack",
      title:    "My Journey Into Full Stack Development",
      date:     "January 2026",
      readTime: "6 min read",
      tag:      "Career",
      emoji:    "🚀",
      excerpt:
        "From writing my first HTML page to building production APIs — here's the journey and what I'd tell my past self.",
      content: `
  Everyone's path into development looks different. Mine started with a curiosity about how websites worked and turned into a full-time career building the things I used to just browse.
  
  ## Where It Started
  
  My first real project was a simple HTML and CSS page for a school assignment. I remember being amazed that a few text files could produce something visual in a browser. That feeling of seeing code become something real hooked me immediately.
  
  ## Learning JavaScript
  
  JavaScript was humbling at first. The async model, closures, and prototype chain felt alien. What helped was building small things constantly — a to-do app, a weather widget, a quiz game. Each project exposed a new gap in my understanding.
  
  ## Discovering React
  
  React clicked quickly once I understood the component model. Thinking in components — breaking a UI into small reusable pieces — matched how my brain already approached design.
  
  ## Adding the Backend
  
  .NET Core was my entry into backend development. Coming from JavaScript, a strongly typed language felt restrictive at first. Now I see it as protective — the compiler catches entire categories of bugs before they reach production.
  
  ## What I'd Tell My Past Self
  
  Pick one thing and go deep before going wide. Depth in one stack teaches you patterns that transfer everywhere. And build real projects even before you feel ready. Tutorials teach syntax. Projects teach problem solving.
      `,
    },
  ];