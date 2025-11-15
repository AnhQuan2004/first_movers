import { Github, Twitter, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Learn", href: "/learn" },
  { label: "Earn", href: "/earn" },
  { label: "FM Launchpad", href: "/fm-launchpad" },
];

export const LandingFooter = () => (
  <footer className="border-t border-white/10 bg-black pt-16 pb-8">
    <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
      <div className="mb-10 flex flex-col justify-between md:flex-row">
        <div className="mb-8 md:mb-0">
          <img src="/logo.png" alt="FM Logo" className="mb-4 h-12" />
          <p className="mb-6 max-w-md text-white/70">
            First Movers Vietnam is the official Sui community for developers and builders in Vietnam
          </p>
          <div className="inline-block rounded-full bg-white px-4 py-2 text-black">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase">
              <span>Powered by</span>
              <img src="/sui.png" alt="Sui Logo" className="h-5" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <h3 className="mb-4 text-lg font-semibold">Join our community</h3>
          <div className="flex gap-4 text-white">
            {[Twitter, AlertCircle, Github].map((Icon, index) => (
              <a key={Icon.displayName ?? index} href="#" className="transition-colors hover:text-[#4DA2FF]">
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 text-sm text-white/70 md:flex-row">
        <nav className="mb-4 flex gap-6 md:mb-0">
          {footerLinks.map(link => (
            <Link key={link.href} to={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-white/50">
          &copy;2025 First Movers |{" "}
          <a href="#" className="hover:text-white">
            Cookie Policy
          </a>
          ,{" "}
          <a href="#" className="hover:text-white">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
);
