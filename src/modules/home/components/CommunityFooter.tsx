import { Link } from "react-router-dom";
import { HOME_NAV_LINKS } from "@/constants/home";

export const CommunityFooter = () => (
  <footer className="relative z-10 border-t border-white/5">
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:justify-between">
      <div className="max-w-sm space-y-4">
        <img src="/fm.png" alt="First Movers" className="h-12 w-auto" />
        <p className="text-sm text-white/75">
          First Movers Vietnam is the official Sui community for developers and builders in Vietnam
        </p>
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60">Powered by</span>
          <img src="/sui.png" alt="Sui" className="h-6 w-auto" />
        </div>
      </div>
      <div className="flex flex-col items-start gap-6 md:items-end">
        <h3 className="text-lg font-semibold text-white/85">Join our community</h3>
        <div className="flex gap-4">
          {[
            {
              label: "Community Arrow",
              icon: (
                <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ),
            },
            {
              label: "Email",
              icon: (
                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor" />
              ),
            },
            {
              label: "Heart",
              icon: (
                <path d="M9 19C4.7 19.7 2 17.6 2 13.7C2 11.5 3.3 9.5 5.6 8.7C5.6 8.4 5.5 8.2 5.5 8C5.5 3.8 9.5 1 13.3 3.3C15.3 1.8 18.4 2.2 19.7 4.3C21.1 6.5 20.6 9.4 18.4 11C19 17.1 13.7 19.9 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ),
            },
          ].map(action => (
            <a
              key={action.label}
              href="#"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
              aria-label={action.label}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {action.icon}
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-8 text-sm text-white/60 md:flex-row">
        <div className="flex flex-wrap justify-center gap-6 md:justify-start">
          {HOME_NAV_LINKS.map(link => (
            <Link key={link.href} to={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-white/50">&copy;2025 First Movers</span>
          <a href="#" className="transition hover:text-white">
            Cookie Policy, Privacy Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
);
