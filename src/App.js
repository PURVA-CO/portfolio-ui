import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Skills from "./components/Skills";
import Projects from "./pages/Projects";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      <Toaster />
      <Navbar />
      <Hero />
      <About/>
      <Skills/>
       {/* Content Container */}
       <div className="max-w-6xl px-4 mx-auto">
        <Projects />
      </div>
      <Contact />
      <Footer />
    </>
  )
}

export default App;