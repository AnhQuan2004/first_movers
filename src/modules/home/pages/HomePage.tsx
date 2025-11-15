import NavBar from "@/components/NavBar";
import { BountyShowcase } from "../components/BountyShowcase";
import { CommunityFooter } from "../components/CommunityFooter";
import { HeroBanner } from "../components/HeroBanner";
import { LearningHighlights } from "../components/LearningHighlights";
import { StatHighlights } from "../components/StatHighlights";

const HomePage = () => (
  <div className="min-h-screen overflow-hidden bg-gradient-to-b from-[#2B68E0] via-[#1A3E8E] via-30% via-[#0A1F4A] via-60% via-[#071230] via-80% to-[#02041C] text-white">
    <NavBar />
    <HeroBanner />
    <StatHighlights />

    <section className="relative z-20 mt-16 px-4 pb-20 sm:mt-20 sm:px-6 sm:pb-24">
      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.45fr,1fr] lg:gap-12">
        <BountyShowcase />
        <LearningHighlights />
      </div>
      <div className="pointer-events-none absolute bottom-[-160px] left-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 opacity-30 sm:block">
        <svg viewBox="0 0 600 600" fill="none" className="h-full w-full">
          <path d="M10 340 C220 460 360 300 580 420" stroke="#FFEB00" strokeWidth="12" strokeLinecap="round" />
        </svg>
      </div>
    </section>

    <CommunityFooter />
  </div>
);

export default HomePage;
