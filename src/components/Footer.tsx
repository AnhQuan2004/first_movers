import { Mail, Github, Facebook, Youtube, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-6">
            <a href="mailto:contact@openguild.dev" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              First Movers • © 2025 • Sui Community
            </p>
            <p className="text-sm text-muted-foreground">
              Bring Web 3.0 builders together.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;