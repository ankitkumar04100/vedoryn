import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Crown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Career Score", href: "#career-score" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add elegant shadow after scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        backdrop-blur-xl border-b 
        ${
          scrolled
            ? "bg-background/80 border-border shadow-lg shadow-black/5 dark:shadow-white/5"
            : "bg-background/40 border-transparent"
        }
      `}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div
            className="
              w-10 h-10 rounded-xl 
              bg-gradient-to-br from-primary to-purple-500 
              flex items-center justify-center
              shadow-[0_0_20px_rgba(0,0,0,0.15)] 
              dark:shadow-[0_0_20px_rgba(255,255,255,0.08)]
            "
          >
            <Crown className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Vedoryn
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="
                text-sm font-medium text-muted-foreground 
                hover:text-primary transition-colors
              "
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* DESKTOP CTA */}
          <Link to="/auth" className="hidden md:block">
            <Button
              size="sm"
              className="
                bg-gradient-to-r from-primary to-purple-500 
                text-white font-semibold 
                shadow-lg hover:scale-[1.05]
                transition-all duration-300
              "
            >
              <Crown className="w-3 h-3 mr-1" /> Get Started
            </Button>
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div
          className="
            md:hidden backdrop-blur-xl 
            bg-background/80 border-t border-border 
            px-4 pb-4 shadow-lg
          "
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="
                block py-3 text-sm font-medium 
                text-muted-foreground hover:text-primary 
                transition-colors
              "
            >
              {link.label}
            </a>
          ))}

          <Link to="/auth">
            <Button
              size="sm"
              className="
                w-full mt-2 
                bg-gradient-to-r from-primary to-purple-500 
                text-white font-semibold py-3
                hover:scale-[1.03] transition-all
              "
            >
              <Crown className="w-4 h-4 mr-1" /> Get Started
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
