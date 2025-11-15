import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroBanner = () => (
  <section className="relative overflow-hidden pb-32">
    <div className="relative z-30 mx-auto max-w-4xl px-6 pt-16 text-center sm:pt-20 md:pt-24">
      <div className="absolute left-1/2 top-[60px] h-96 w-96 -translate-x-1/2 rounded-full bg-white/15 blur-[120px]" />
      <h1 className="relative text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl lg:text-7xl">
        Where builders{" "}
        <span className="block md:inline">
          become <span className="text-[#FFEB00]">First Movers</span>
        </span>
      </h1>
      <p className="relative mt-4 text-sm text-white/85 sm:text-base md:mt-5 md:text-xl">
        Build. Learn. Earn. Repeat.{" "}
        <span className="hidden sm:inline">
          <br />
        </span>
        Join 5000+ builder community moving first
      </p>
      <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
        <Button
          variant="outline"
          className="h-12 w-full rounded-full border-white/30 bg-white/10 px-8 text-sm font-semibold text-white/90 backdrop-blur sm:h-14 sm:w-auto sm:min-w-[180px] sm:px-10 md:text-base"
          asChild
        >
          <Link to="/learn">Start Learning</Link>
        </Button>
        <Button
          className="h-12 w-full rounded-full border border-[#FFD966] bg-gradient-to-b from-[#FFE977] to-[#FFB400] px-8 text-sm font-semibold text-[#132254] shadow-[0_12px_30px_rgba(255,209,0,0.35)] hover:from-[#FFE977] hover:to-[#FFC53D] sm:h-14 sm:w-auto sm:min-w-[180px] sm:px-10 md:text-base"
          asChild
        >
          <Link to="/fm-launchpad">FM Launchpad</Link>
        </Button>
      </div>
    </div>

    <div className="pointer-events-none absolute -left-16 top-20 block h-40 w-40 opacity-70 sm:-left-20 sm:top-24 sm:h-56 sm:w-56 md:left-[-80px] md:top-32 md:h-[540px] md:w-[540px]">
      <svg viewBox="0 0 600 600" fill="none" className="h-full w-full">
        <path d="M10 140 C200 40 320 200 520 110" stroke="#FFEB00" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </div>
    <div className="pointer-events-none absolute -right-16 bottom-6 block h-36 w-36 opacity-60 sm:-right-20 sm:bottom-4 sm:h-48 sm:w-48 md:right-[-120px] md:bottom-[-40px] md:h-[520px] md:w-[520px]">
      <svg viewBox="0 0 600 600" fill="none" className="h-full w-full">
        <path d="M590 470 C380 550 250 380 70 480" stroke="#FFEB00" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </div>
    <div className="pointer-events-none absolute left-6 top-28 block md:left-[18%] md:top-[18%]">
      <svg width="120" height="180" viewBox="0 0 120 180" fill="none" className="h-20 w-auto sm:h-24 md:h-[180px]">
        <path d="M30 0L66 66L6 90L96 178" stroke="#FF4DD8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div className="pointer-events-none absolute left-10 top-[38%] block md:left-[15%] md:top-[25%]">
      <div className="h-3 w-3 rounded-sm bg-[#FF4DD8] sm:h-4 sm:w-4 md:h-5 md:w-5" />
    </div>
    <div className="pointer-events-none absolute right-10 top-24 block opacity-80 sm:right-[18%] sm:top-[16%] sm:opacity-90">
      <svg width="90" height="90" viewBox="0 0 80 80" fill="#FFFFFF" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12">
        <path d="M20 10L40 30L20 50L40 70" stroke="#FFEB00" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div className="pointer-events-none absolute right-4 bottom-24 block sm:right-[18%] sm:bottom-[18%]">
      <div className="grid grid-cols-3 gap-1">
        <div className="h-4 w-4 rounded-sm bg-transparent sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-[#FFE65A] sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-transparent sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-transparent sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-[#FFE65A] sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-transparent sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-transparent sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-[#FFE65A] sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-transparent sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </div>
    </div>
    <div className="pointer-events-none absolute left-6 bottom-24 block sm:left-[8%] sm:bottom-[18%]">
      <div className="grid grid-cols-2 gap-1">
        <div className="h-4 w-4 rounded-sm bg-[#FFE65A] sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-transparent sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-transparent sm:h-5 sm:w-5 md:h-6 md:w-6" />
        <div className="h-4 w-4 rounded-sm bg-[#FFE65A] sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </div>
    </div>
  </section>
);
