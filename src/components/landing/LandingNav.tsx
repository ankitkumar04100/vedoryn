import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Crown, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Career Score", href: "#career-score" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass royal-border border-t-0 border-l-0 border-r-0">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-royal flex items-center justify-center shadow-glow">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Vedoryn</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/auth" className="hidden md:block">
            <Button size="sm" className="bg-gradient-royal text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-glow">
              <Crown className="w-3 h-3 mr-1" /> Get Started
            </Button>
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-border px-4 pb-4">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <Link to="/auth">
            <Button size="sm" className="w-full mt-2 bg-gradient-royal text-primary-foreground font-semibold">
              <Crown className="w-3 h-3 mr-1" /> Get Started
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
