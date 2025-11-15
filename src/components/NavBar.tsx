import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, Menu } from "lucide-react";
import logoSrc from "/logo.png";
import { loadSessionProfile, clearSessionProfile } from "@/lib/profile-storage";
import { getAdminOverride } from "@/lib/admin-access";
import type { UserProfile } from "@/types/profile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { emitAuthChange } from "@/lib/auth-events";

const BASE_NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "EXPLORE", href: "/explore" },
  { label: "LEARN", href: "/learn" },
  { label: "EARN", href: "/earn" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserProfile["role"] | undefined>(undefined);

  useEffect(() => {
    if (getAdminOverride()) {
      setUserRole("admin");
    }
    const email = sessionStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
      setIsLoggedIn(true);
      
      const storedProfile = loadSessionProfile();
      if (storedProfile) {
        setProfile(storedProfile);
        if (storedProfile.role) {
          setUserRole(storedProfile.role);
        }
      }
      const storedRole = sessionStorage.getItem("userRole");
      if (!storedProfile && storedRole) {
        if (storedRole === "admin" || storedRole === "partner" || storedRole === "user") {
          setUserRole(storedRole);
        }
      }
    }
  }, []);

  useEffect(() => {
    const override = getAdminOverride();
    if (override && profile?.role !== "admin") {
      setUserRole("admin");
      return;
    }
    if (profile?.role) {
      setUserRole(profile.role);
    }
  }, [profile?.role]);

  const resolvedRole = profile?.role ?? userRole;
  const isAdmin = resolvedRole === "admin";
  const isPartner = resolvedRole === "partner";

  const dynamicNavItems = useMemo(() => {
    const items = [...BASE_NAV_ITEMS];
    if (isPartner) {
      items.push({ label: "CREATE BOUNTY", href: "/create-bounty" });
    }
    return items;
  }, [isPartner]);

  const avatarInitial = profile?.displayName 
    ? profile.displayName.charAt(0).toUpperCase() 
    : userEmail 
      ? userEmail.charAt(0).toUpperCase() 
      : "U";

  const resolvedDisplayName = profile?.displayName || userEmail?.split("@")[0] || "User";

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    clearSessionProfile();
    sessionStorage.removeItem("userEmail");
    emitAuthChange();
    setIsLoggedIn(false);
    setProfile(null);
    setUserEmail(null);
    setUserRole(undefined);
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const renderAuthButtons = (variant: "desktop" | "mobile" = "desktop") => {
    if (isLoggedIn) {
      if (variant === "mobile") {
        return (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage alt={resolvedDisplayName} src="" />
                <AvatarFallback>{avatarInitial}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{resolvedDisplayName}</p>
                {userEmail && <p className="truncate text-xs text-white/60">{userEmail}</p>}
              </div>
            </div>
            <Link
              to="/profile"
              className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              View profile
              <span className="text-[10px] text-white/60">↗</span>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-white/10 hover:text-red-300"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        );
      }

      return (
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm hover:bg-white/10"
            onClick={() => setShowDropdown(prev => !prev)}
          >
            <Avatar className="h-8 w-8 border border-white/10">
              <AvatarImage alt={resolvedDisplayName} src="" />
              <AvatarFallback>{avatarInitial}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{resolvedDisplayName}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
            {showDropdown && userEmail && (
              <div className={`absolute right-0 mt-3 w-56 space-y-2 rounded-xl border border-white/10 ${isHomePage ? 'bg-[#2B68E0]/95' : 'bg-black/95'} p-3 text-sm shadow-lg backdrop-blur z-[100]`}>
                <div>
                  <p className="truncate text-muted-foreground">Signed in as</p>
                  <p className="truncate font-medium text-white">{userEmail}</p>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <Link
                    to="/profile"
                    className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                    onClick={() => setShowDropdown(false)}
                  >
                    View profile
                    <span className="text-[10px] uppercase tracking-wider text-white/60">↗</span>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-xs font-semibold text-red-400 hover:bg-white/10 hover:text-red-300"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            )}
        </div>
      );
    }
    
    if (variant === "mobile") {
      return (
        <div className="space-y-3 text-sm">
          <Button
            variant="outline"
            className="w-full rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:border-[#FFAE00] hover:text-[#FFEB00]"
            asChild
          >
            <a href="https://discord.gg/3QtUhZswEg" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
              Join Discord
            </a>
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:border-[#FFEB00] hover:text-[#FFEB00]"
            asChild
          >
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="border-white/40 bg-white/10 text-white backdrop-blur hover:border-[#FFAE00] hover:text-[#FFEB00]"
          asChild
        >
          <a href="https://discord.gg/3QtUhZswEg" target="_blank" rel="noopener noreferrer">
            Join Discord
          </a>
        </Button>
        <Button
          variant="outline"
          className="border-white/40 bg-white/10 text-white backdrop-blur hover:border-[#FFEB00] hover:text-[#FFEB00]"
          asChild
        >
          <Link to="/login">Log In</Link>
        </Button>
      </div>
    );
  };

  const getNavItemClasses = (path: string) => {
    const baseClass = "transition-colors duration-200";

    if (isActive(path)) {
      return `${baseClass} text-[#FFEB00]`;
    }

    return `${baseClass} text-white/80 hover:text-[#FFEB00]`;
  };

  const isHomePage = location.pathname === "/";
  
  return (
    <header className={`sticky top-0 z-40 ${isHomePage ? 'bg-[#2B68E0]' : 'bg-black border-b border-white/10'} backdrop-blur-sm`}>
      <div className="relative mx-auto flex w-full max-w-7xl items-center px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoSrc} alt="First Mover" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8 text-sm font-semibold uppercase tracking-wide">
          {dynamicNavItems.map(item => (
            <Link
              key={item.label}
              to={item.href}
              className={getNavItemClasses(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden md:block">{renderAuthButtons("desktop")}</div>

        <div className="md:hidden ml-auto">
          {isLoggedIn ? (
            <Button
              variant="outline"
              className="rounded-full border-white/40 bg-white/10 px-6 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-md transition hover:border-[#FFAE00] hover:text-[#FFEB00]"
              asChild
            >
              <a href="https://discord.gg/3QtUhZswEg" target="_blank" rel="noopener noreferrer">Join Discord</a>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="rounded-full border-white/40 bg-white/10 px-6 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-md transition hover:border-[#FFEB00] hover:text-[#FFEB00]"
              asChild
            >
              <Link to="/login">Log In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
