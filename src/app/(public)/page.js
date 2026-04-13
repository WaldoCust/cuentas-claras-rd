"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSteps from "@/components/landing/SolutionSteps";
import Benefits from "@/components/landing/Benefits";
import TrustSection from "@/components/landing/TrustSection";
import PricingPreview from "@/components/landing/PricingPreview";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen premium-gradient-bg text-slate-900 overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSteps />
        <Benefits />
        <TrustSection />
        <PricingPreview />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
