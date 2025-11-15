import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { LANDING_COLORS, LANDING_HERO_STATS } from "@/constants/landing";

export const HeroSection = () => (
  <section className="relative overflow-hidden py-20">
    <div className="absolute inset-0">
      <img src="/background.png" alt="Sui gradient background" className="h-full w-full object-cover" />
    </div>
    <div
      className="absolute inset-0"
      style={{ background: `linear-gradient(to bottom, ${LANDING_COLORS.gradientTop}80, ${LANDING_COLORS.gradientBottom}80)` }}
    />

    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 sm:px-10 lg:px-16">
      <div className="w-full max-w-4xl rounded-[40px] border border-white/20 bg-gradient-to-br from-[#0b1685]/90 to-[#346ed2]/90 backdrop-blur-sm px-8 py-16 text-center shadow-[0_40px_80px_-40px_rgba(11,22,133,0.7)] md:px-16">
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-5xl">
          We grow builders. We launch pioneers. Powered by Sui.
        </h1>

        <p className="mt-6 text-base text-white/75 sm:text-lg">
          A community where learning meets action. We guide developers from zero to mainnet — mastering Move, building
          projects, and joining the builders shaping the future of Web3 on Sui.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/learn">
            <Button className="flex items-center gap-2 rounded-full bg-white px-8 py-5 text-base font-semibold text-[#0b1685] shadow-[0_10px_25px_-10px_rgba(255,255,255,0.8)] hover:bg-white/90">
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="https://discord.gg/3QtUhZswEg" target="_blank" rel="noopener noreferrer" className="inline-flex">
            <Button variant="outline" className="flex items-center gap-2 rounded-full border-white border-2 bg-transparent px-8 py-5 text-base font-semibold text-white hover:bg-white/10">
              Join Discord
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      <div className="mt-12 grid w-full gap-6 md:grid-cols-3">
        {LANDING_HERO_STATS.map(stat => (
          <div key={stat.value} className="border-white/10 bg-gradient-to-br from-[#0b1685]/80 to-[#346ed2]/80 backdrop-blur rounded-3xl border">
            <div className="p-8 text-center">
              <p className="text-5xl font-semibold text-white">{stat.value}</p>
              <p className="mt-3 text-base text-white/90">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
