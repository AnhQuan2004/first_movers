import { LANDING_PROGRAMS } from "@/constants/landing";

export const ProgramsGrid = () => (
  <section className="bg-[#0b1685]/10 py-20">
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
      <h2 className="mb-16 text-center text-4xl font-bold">We build the next wave of Web3 innovators through:</h2>

      <div className="grid gap-6 md:grid-cols-3">
        {LANDING_PROGRAMS.slice(0, 3).map(program => (
          <article key={program.title} className="group relative overflow-hidden rounded-2xl">
            <img src={program.image} alt={program.title} className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold">{program.title}</h3>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {LANDING_PROGRAMS.slice(3).map(program => (
          <article key={program.title} className="group relative overflow-hidden rounded-2xl">
            <img src={program.image} alt={program.title} className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold">{program.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
