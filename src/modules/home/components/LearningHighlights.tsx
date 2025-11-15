import { HOME_LEARNING_HIGHLIGHTS } from "@/constants/home";
import type { ReactNode } from "react";

const getHighlightIcon = (id: string, className: string): ReactNode => {
  if (id === "first-mover") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M14 5L16.5 10.5L22.5 11.5L18 15.5L19.5 21.5L14 18.5L8.5 21.5L10 15.5L5.5 11.5L11.5 10.5L14 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M21 7H7C5.89543 7 5 7.89543 5 9V19C5 20.1046 5.89543 21 7 21H21C22.1046 21 23 20.1046 23 19V9C23 7.89543 22.1046 7 21 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 14C12.1046 14 13 13.1046 13 12C13 10.8954 12.1046 10 11 10C9.89543 10 9 10.8954 9 12C9 13.1046 9.89543 14 11 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 11.5L23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21L13.5 17.5C14.5 16.5 16 16.5 17 17.5L23 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const LearningHighlights = () => (
  <div className="space-y-8 sm:space-y-10">
    {HOME_LEARNING_HIGHLIGHTS.map(highlight => (
      <div
        key={highlight.id}
        className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_55px_rgba(10,30,94,0.25)] backdrop-blur sm:rounded-[32px] sm:p-8"
      >
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className={`rounded-2xl ${highlight.accent.background} p-3`}>
            {getHighlightIcon(highlight.id, `text-white ${highlight.accent.text}`)}
          </div>
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${highlight.accent.text}`}>
              {highlight.heading}
            </p>
            <p className="text-white/70">{highlight.subheading}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center py-16 text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${highlight.accent.background}`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={highlight.accent.text}>
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">Coming Soon</h3>
          <p className="mt-2 text-white/70 max-w-md">{highlight.description}</p>
        </div>
      </div>
    ))}
  </div>
);
