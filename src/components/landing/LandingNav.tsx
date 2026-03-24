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

  // Detect scroll for nav-shadow and shrink effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500
        backdrop-blur-2xl
        border-b 
        ${
          scrolled
            ? "bg-background/90 border-border shadow-[0_4px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_40px_rgba(255,255,255,0.04)]"
            : "bg-background/40 border-transparent"
        }
      `}
    >
      <div
        className={`
          container mx-auto px-4 flex items-center justify-between 
          transition-all duration-300
          ${scrolled ? "h-14" : "h-20"}
        `}
      >
        {/* LEFT SIDE LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="
              w-11 h-11 rounded-2xl 
              bg-gradient-to-br from-yellow-400 to-purple-600
              flex items-center justify-center
              shadow-xl shadow-yellow-500/30
              group-hover:scale-110 group-hover:rotate-3 
              transition-all duration-300
            "
          >
            <Crown className="w-5 h-5 text-white drop-shadow-lg" />
          </div>

          <div className="flex flex-col -space-y-1">
            <span className="
              font-display font-bold text-2xl tracking-tight
              text-foreground transition-colors
            ">
              Vedoryn
            </span>

            {/* Royal Glow Line */}
            <div className="
              h-[2px] w-0 
              bg-gradient-to-r from-yellow-400 to-purple-500 
              rounded-full 
              group-hover:w-full transition-all duration-500
            " />
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="
                relative text-sm font-medium text-muted-foreground
                hover:text-foreground transition-all duration-200
                tracking-wide
                after:content-['']
                after:absolute after:left-0 after:-bottom-1
                after:w-0 after:h-[2px]
                after:bg-gradient-to-r from-primary to-purple-500
                after:rounded-full
                hover:after:w-full after:transition-all after:duration-300
              "
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* DESKTOP CTA */}
          <Link to="/auth" className="hidden md:block">
            <Button
              size="sm"
              className="
                bg-gradient-to-r from-yellow-400 via-primary to-purple-600
                text-white font-semibold px-6 py-2 
                rounded-xl 
                shadow-lg shadow-yellow-500/30
                hover:scale-[1.07] active:scale-[0.95]
                transition-all duration-300
              "
            >
              <Crown className="w-4 h-4 mr-1" /> Get Started
            </Button>
          </Link>

          {/* MOBILE MENU ICON */}
          <button
            onClick={() => setOpen(!open)}
            className="
              md:hidden p-2 rounded-xl
              hover:bg-muted/60 transition-colors
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
            md:hidden backdrop-blur-2xl 
            bg-background/95 border-t border-border 
            px-4 pb-6 pt-3 shadow-lg
          "
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="
                block py-3 text-sm font-medium tracking-wide
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
                mt-4 w-full py-3 text-white
                bg-gradient-to-r from-yellow-400 via-primary to-purple-600
                rounded-xl shadow-xl shadow-yellow-500/30
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
