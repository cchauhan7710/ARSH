import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturesSection from "../components/FeaturesSection";
import WorkflowSection from "../components/WorkflowSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { useEffect } from "react";
// import Chatbot from "../components/Chatbot";


export default function LandingPage() {
  useEffect(() => {
    // Add intersection observer for smooth fade-in animations
    const sections = document.querySelectorAll(".fade-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <>
      <Header />
     {/* <Chatbot/>  */}

      {/* Enable smooth scrolling sitewide */}
      <div
      
        className="scroll-smooth transition-all duration-700 ease-in-out 
                   bg-gradient-to-b from-[#f9fbff] via-white to-[#f5f9ff] 
                   dark:from-gray-950 dark:via-black dark:to-gray-950 
                   text-gray-800 dark:text-gray-100"
      >
        <section id="home" className="fade-section opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <Hero />
        </section>

        <section id="features" className="fade-section opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <FeaturesSection />
        </section>

        <section id="workflow" className="fade-section opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <WorkflowSection />
        </section>

        <section id="contact" className="fade-section opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <CTASection />
        </section>

        <Footer />
      </div>
    </>
  );
}
