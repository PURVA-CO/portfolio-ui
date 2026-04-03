import { BrowserRouter, Routes, Route } from "react-router-dom"; // ✅ NEW

// Page components
import Resume from "./pages/Resume"; // ✅ NEW

import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Stats from "./components/Stats";
import Timeline from "./components/Timeline";
import Projects from "./pages/Projects";
import { Toaster } from "react-hot-toast";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import CoverLetter from "./pages/CoverLetter";
import ChatAssistant from "./components/ChatAssistant";

// ─────────────────────────────────────────────────────────────
// ✅ HomePage — extracted from App so Router can swap pages
// Everything that was in App before now lives here
// ─────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <>
      <Toaster />
      <Navbar />
      <Hero />
      <About />
      <Stats />
      <Timeline />
      <Skills />
      <div className="max-w-6xl px-4 mx-auto">
        <Projects />
      </div>
      <Contact />
      <Footer />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// ✅ App — now just a Router that picks which page to show
// Adding a new page = adding ONE <Route> line here
// ─────────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* / → full portfolio homepage */}
        <Route path="/" element={<HomePage />} />
        {/* /resume → standalone resume page */}
        <Route path="/resume" element={<Resume />} />
        {/* Blog list — /blog */}
        <Route path="/blog" element={<BlogList />} /> {/* ✅ NEW */}
        {/* Individual post — /blog/why-i-love-react-hooks etc */}
        <Route path="/blog/:slug" element={<BlogPost />} /> {/* ✅ NEW */}
        <Route path="/cover-letter"  element={<CoverLetter />} /> {/* ✅ NEW */}
      </Routes>
      {/*
        ✅ ChatAssistant lives OUTSIDE <Routes>
        This means it NEVER unmounts during navigation
        The chat stays open even when user visits /blog or /resume
        Same pattern used by Intercom, Crisp, and every support chat widget
      */}
      <ChatAssistant />
    </BrowserRouter>
  );
}

export default App;
