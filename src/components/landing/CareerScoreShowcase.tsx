import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface Props {
  score: number;
}

export function UltraCareerScore({ score }: Props) {
  const rotate = useMotionValue(0);
  const rotateY = useTransform(rotate, [0, 1], ["0deg", "360deg"]);

  useEffect(() => {
    const interval = setInterval(() => {
      rotate.set(rotate.get() + 0.01);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const colors = score < 30
    ? "from-red-500 to-red-700"
    : score < 60
    ? "from-orange-400 to-yellow-500"
    : score < 80
    ? "from-primary to-purple-400"
    : "from-emerald-400 to-green-500";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative w-[320px] h-[320px] md:w-[420px] md:h-[420px] flex items-center justify-center"
    >

      {/* Spotlight Glow Backdrop */}
      <div
        className="absolute w-full h-full rounded-full 
        bg-primary/20 dark:bg-primary/10 blur-[100px] scale-150"
      />

      {/* Floating Glow Orb */}
      <motion.div
        style={{ rotate: rotateY }}
        className={`
          absolute w-[260px] h-[260px] md:w-[340px] md:h-[340px] 
          rounded-full bg-gradient-to-br ${colors}
          shadow-[0_0_50px_rgba(255,255,255,0.15)]
          border border-white/20 dark:border-white/10
          backdrop-blur-xl
          animate-slow-float
        `}
      />

      {/* Inner Pulse Core */}
      <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full 
        bg-white/40 dark:bg-white/10 blur-2xl animate-pulse-slow" />

      {/* Rotating Neural Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute w-[420px] h-[420px] md:w-[500px] md:h-[500px] 
        rounded-full border border-white/10 dark:border-white/5 
        backdrop-blur-xl"
      />

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute w-[330px] h-[330px] md:w-[410px] md:h-[410px] 
        rounded-full border border-primary/20 dark:border-primary/10"
      />

      {/* Floating Hologram Number */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center"
      >
        <div
          className="text-[70px] md:text-[100px] font-display font-bold 
          bg-clip-text text-transparent 
          bg-gradient-to-b from-white to-white/60 
          dark:from-white dark:to-white/70 drop-shadow-lg"
        >
          {score}
        </div>
        <div className="text-lg text-muted-foreground tracking-wide">
          Career Score
        </div>
      </motion.div>
    </motion.div>
  );
}
