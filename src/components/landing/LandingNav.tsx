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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 
        backdrop-blur-2xl transition-all duration-300 
        border-b 
        ${
          scrolled
            ? "bg-background/85 border-border shadow-md dark:shadow-white/5"
            : "bg-background/40 border-transparent"
        }
      `}
    >
      <div className="container mx-auto h-16 px-4 flex items-center justify-between">

        {/* BRAND */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="
              w-10 h-10 rounded-xl 
              bg-gradient-to-br from-primary to-purple-500 
              flex items-center justify-center
              shadow-lg shadow-primary/30
              group-hover:scale-105 transition-transform
            "
          >
            <Crown className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Vedoryn
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="
                text-sm font-medium 
                text-muted-foreground 
                hover:text-primary transition-colors
              "
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* THEME SWITCH */}
          <ThemeToggle />

          {/* CTA (DESKTOP) */}
          <Link to="/auth" className="hidden md:block">
            <Button
              size="sm"
              className="
                bg-gradient-to-r from-primary to-purple-500 
                text-white font-semibold px-5 py-2 rounded-xl
                shadow-lg shadow-primary/40
                hover:scale-[1.06] active:scale-[0.96]
                transition-all
              "
            >
              <Crown className="w-4 h-4 mr-1" /> Get Started
            </Button>
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="
              md:hidden p-2 rounded-lg 
              hover:bg-muted transition-colors 
              border border-transparent hover:border-border
            "
          >
            {open ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="
            md:hidden 
            backdrop-blur-2xl bg-background/95 
            border-t border-border 
            px-4 pb-6 pt-3 shadow-lg
          "
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="
                block py-3 
                text-sm font-medium 
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
                w-full mt-3 py-3 
                bg-gradient-to-r from-primary to-purple-500 
                text-white font-semibold shadow-lg shadow-primary/30
                rounded-xl
                hover:scale-[1.03] active:scale-[0.96]
                transition-all
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
