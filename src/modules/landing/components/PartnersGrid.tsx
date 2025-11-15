import { LANDING_PARTNERS } from "@/constants/landing";

export const PartnersGrid = () => (
  <section className="bg-gradient-to-b from-black to-[#06131c] py-20">
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
      <h2 className="mb-16 text-center text-4xl font-bold">Our Partners</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LANDING_PARTNERS.map(partner => (
          <div
            key={partner.name}
            className="flex h-32 items-center justify-center rounded-xl bg-[#011B29] p-10 text-center"
          >
            <span className="text-lg font-semibold text-white/90">{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
