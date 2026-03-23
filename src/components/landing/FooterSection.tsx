import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function FooterSection() {
  return (
    <footer className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Join thousands of students turning confusion into clarity with Vedoryn's royal AI career intelligence.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-royal text-primary-foreground font-semibold shadow-royal hover:opacity-90">
              <Crown className="w-4 h-4 mr-2" /> Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-royal flex items-center justify-center shadow-glow">
              <Crown className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Vedoryn</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Vedoryn. The Royal Career Intelligence Operating System.
          </p>
        </div>
      </div>
    </footer>
  );
}
