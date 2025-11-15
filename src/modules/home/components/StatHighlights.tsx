import { HOME_STATS } from "@/constants/home";

type Stat = (typeof HOME_STATS)[number];

interface StatHighlightsProps {
  stats?: Stat[];
}

export const StatHighlights = ({ stats = HOME_STATS }: StatHighlightsProps) => (
  <section className="relative z-30 -mt-16 px-6 sm:-mt-20">
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
      {stats.map(stat => (
        <div
          key={stat.label}
          className="rounded-[24px] border border-white/10 bg-white/5 backdrop-blur p-6 text-center shadow-[0_22px_45px_rgba(8,25,100,0.25)] sm:rounded-[28px] sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60 text-center">{stat.label}</p>
          <p className="mt-3 text-2xl font-semibold sm:mt-4 sm:text-3xl md:text-4xl text-center whitespace-nowrap">
            <span className={stat.accent}>{stat.value}</span>
            {stat.suffix ? ` ${stat.suffix}` : ""}
          </p>
        </div>
      ))}
    </div>
  </section>
);
