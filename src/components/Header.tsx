import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground">OG</span>
            <span className="text-xl font-bold">OpenGuild</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#learn" className="text-sm font-medium hover:text-primary transition-colors">
            Learn
          </a>
          <a href="#activity" className="text-sm font-medium hover:text-primary transition-colors">
            Activity
          </a>
          <a href="#events" className="text-sm font-medium hover:text-primary transition-colors">
            Events
          </a>
          <a href="#blogs" className="text-sm font-medium hover:text-primary transition-colors">
            Blogs
          </a>
          <a href="#members" className="text-sm font-medium hover:text-primary transition-colors">
            Members
          </a>
        </nav>

        <Button variant="default" size="lg" className="hidden md:inline-flex">
          🏹 Hunt bounty now!
        </Button>
      </div>
    </header>
  );
};

export default Header;
