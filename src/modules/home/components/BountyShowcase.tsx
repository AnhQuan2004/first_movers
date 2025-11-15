import { HOME_FEATURED_BOUNTIES, HOME_UPCOMING_ACTIVATIONS } from "@/constants/home";

const FeaturedBountyCard = ({
  title,
  href,
  badge,
  timeframe,
  reward,
}: (typeof HOME_FEATURED_BOUNTIES)[number]) => (
  <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-sm transition-colors hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-1 items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E5BFF] to-[#182FFF] shadow-[0_12px_30px_rgba(24,68,255,0.45)]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M12 11V14M9.5 16.5L12 14L14.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:underline">
          {title}
        </a>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
          {badge ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFE977]/10 px-3 py-1 text-[#FFE977]">
              <span className="text-[10px]">⭐</span> {badge}
            </span>
          ) : null}
          <span>{timeframe}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E47FF]/20 text-[#7DA6FF]">$</div>
      <p className="text-base font-semibold text-[#7DA6FF] sm:text-lg">{reward}</p>
    </div>
  </div>
);

const UpcomingActivationCard = ({ title, status, href }: (typeof HOME_UPCOMING_ACTIVATIONS)[number]) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="block">
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 text-sm transition-colors hover:bg-white/10">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E5BFF]/80 to-[#182FFF]/80 shadow-[0_12px_30px_rgba(24,68,255,0.25)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
            <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-white/70">{status}</p>
        </div>
      </div>
    </div>
  </a>
);

export const BountyShowcase = () => (
  <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_28px_60px_rgba(6,18,70,0.25)] backdrop-blur sm:rounded-[32px] sm:p-8">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="rounded-2xl bg-[#163BFF]/20 p-3">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#7DA6FF]">
            <path d="M14 26C20.6274 26 26 20.6274 26 14C26 7.37258 20.6274 2 14 2C7.37258 2 2 7.37258 2 14C2 20.6274 7.37258 26 14 26Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 18.5H14.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 11C11 9.89543 11.8954 9 13 9H14.5C15.6046 9 16.5 9.89543 16.5 11C16.5 11.8467 15.9303 12.5848 15.1332 12.8507C14.3854 13.0999 13.75 13.7229 13.75 14.5V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7DA6FF]">Top Bounties This Month</p>
          <p className="text-white/70">High-value opportunities ending soon</p>
        </div>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      {HOME_FEATURED_BOUNTIES.map(bounty => (
        <FeaturedBountyCard key={bounty.id} {...bounty} />
      ))}

      {HOME_UPCOMING_ACTIVATIONS.map(activation => (
        <UpcomingActivationCard key={activation.id} {...activation} />
      ))}

      <div className="mt-4 flex flex-col items-center justify-center py-6 text-sm text-white/70">
        More bounty opportunities coming soon. Stay tuned!
      </div>
    </div>
  </div>
);
