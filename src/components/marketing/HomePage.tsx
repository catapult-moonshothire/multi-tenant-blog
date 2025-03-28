"use client";

import CallToAction from "@/components/marketing/CallToAction";
import Features from "@/components/marketing/Features";
import Footer from "@/components/marketing/Footer";
import HeroSection from "@/components/marketing/HeroSection";
import Navbar from "@/components/marketing/Navbar";
import ProblemSolution from "@/components/marketing/ProblemSolution";
import Testimonials from "@/components/marketing/Testimonials";
import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    const handleScrollAnimation = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;

        // Check if element is in viewport
        if (rect.top <= windowHeight * 0.85 && rect.bottom >= 0) {
          el.classList.add("visible");
        }
      });
    };

    // Run once on mount to check initial elements in view
    handleScrollAnimation();

    // Add scroll listener
    window.addEventListener("scroll", handleScrollAnimation);

    return () => {
      window.removeEventListener("scroll", handleScrollAnimation);
    };
  }, []);

  return (
    <div className="min-h-screen bg-offwhite overflow-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSolution />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default HomePage;
