import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export function FooterSection() {
  return (
    <footer className="relative pt-28 pb-12 overflow-hidden">

      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-primary/10 dark:bg-primary/5 blur-3xl animate-float" />
        <div
          className="absolute top-10 right-10 w-80 h-80 bg-purple-500/10 dark:bg-purple-400/5 blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="container mx-auto px-4">

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Ready to Transform Your Career?
          </h2>

          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
            Join thousands of students using Vedoryn to build clarity, confidence, and real career success with AI.
          </p>

          <Link to="/auth">
            <Button
              size="lg"
              className="
                bg-gradient-to-r from-primary to-purple-500 
                text-white font-semibold shadow-xl px-10 py-6
                rounded-xl hover:scale-[1.05]
                transition-all duration-300
              "
            >
              <Crown className="w-4 h-4 mr-2" />
              Get Started Now
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* FOOTER GRID */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Vedoryn</span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed">
              The Royal AI Career Intelligence Operating System — built to
              transform confusion into clarity with data-driven precision.
            </p>
          </div>

          {/* PRODUCT LINKS */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#career-score" className="hover:text-primary transition">Career Score</Link></li>
              <li><Link to="#features" className="hover:text-primary transition">AI Features</Link></li>
              <li><Link to="#how-it-works" className="hover:text-primary transition">How It Works</Link></li>
              <li><Link to="#pricing" className="hover:text-primary transition">Pricing</Link></li>
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-primary transition">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition">Career Guides</a></li>
              <li><a href="#" className="hover:text-primary transition">Interview Tips</a></li>
              <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* SOCIALS & COPYRIGHT */}
        <div className="mt-16 pt-8 border-t border-white/20 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* SOCIAL ICONS */}
          <div className="flex gap-4">
            {[Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
              <motion.a
                key={i}
                whileHover={{ scale: 1.15, y: -3 }}
                className="w-9 h-9 rounded-full bg-white/20 dark:bg-white/5
                  backdrop-blur-xl border border-white/30 dark:border-white/10
                  flex items-center justify-center cursor-pointer"
                href="#"
              >
                <Icon className="w-4 h-4 text-foreground/80" />
              </motion.a>
            ))}
          </div>

          {/* COPYRIGHT */}
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Vedoryn. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
