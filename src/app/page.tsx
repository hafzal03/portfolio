import { HeroAI } from "@/components/sections/HeroAI";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Courses } from "@/components/sections/Courses";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroAI />
      <About />
      <Experience />
      <Education />
      <Projects />
      <Skills />
      <Courses />
      <Services />
      <Contact />
    </main>
  );
}
