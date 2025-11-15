import NavBar from "@/components/NavBar";
import { HeroSection } from "../components/HeroSection";
import { ProgramsGrid } from "../components/ProgramsGrid";
import { PartnersGrid } from "../components/PartnersGrid";
import { LandingFooter } from "../components/LandingFooter";

const LandingPage = () => (
  <main className="min-h-screen overflow-hidden bg-black text-white">
    <NavBar />
    <HeroSection />
    <ProgramsGrid />
    <PartnersGrid />
    <LandingFooter />
  </main>
);

export default LandingPage;
