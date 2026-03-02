import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface VisualProgressProps {
  sold: number;
  total: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VisualProgress({ sold, total, className = "", size = "md" }: VisualProgressProps) {
  const { t } = useI18n();
  const basePercentage = Math.min(100, Math.max(0, (sold / total) * 100));
  const [displayPercentage, setDisplayPercentage] = useState(basePercentage);

  useEffect(() => {
    setDisplayPercentage(basePercentage);
  }, [basePercentage]);

  const delayPatternRef = useRef(0);
  const isFirstTickRef = useRef(true);

  useEffect(() => {
    if (basePercentage >= 100) return;
    const delays = [3000, 5000, 8000, 2000, 4000, 7000];
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      setDisplayPercentage(prev => Math.min(prev + 0.01, basePercentage + 0.5));
      const delay = delays[delayPatternRef.current % delays.length];
      delayPatternRef.current++;
      timeout = setTimeout(tick, delay);
    };

    const firstDelay = isFirstTickRef.current ? 15000 : delays[delayPatternRef.current % delays.length];
    isFirstTickRef.current = false;
    timeout = setTimeout(tick, firstDelay);
    return () => clearTimeout(timeout);
  }, [basePercentage]);

  const percentage = displayPercentage;
  const isAlmostComplete = percentage >= 90;
  const isComplete = percentage >= 100;

  const prevPercentageRef = useRef(displayPercentage);
  const percentControls = useAnimation();
  const barFlashControls = useAnimation();

  useEffect(() => {
    if (prevPercentageRef.current !== displayPercentage) {
      prevPercentageRef.current = displayPercentage;
      percentControls.start({
        scale: [1, 1.15, 1],
        color: ["#22c55e", "#22c55e", isAlmostComplete ? "#F59E0B" : "#ffffff"],
        transition: { duration: 0.6, ease: "easeOut" },
      });
      barFlashControls.start({
        opacity: [0, 1, 0],
        transition: { duration: 0.8, ease: "easeOut" },
      });
    }
  }, [displayPercentage]);

  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-5"
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          {isComplete ? (
            <span className="text-primary font-bold text-glow">{t.progress.targetReached}</span>
          ) : isAlmostComplete ? (
            <span className="text-accent font-bold">{t.progress.imminentDraw}</span>
          ) : (
            <span>{t.progress.fundingProgress}</span>
          )}
        </span>
        <motion.span
          className={`font-display font-bold ${size === 'lg' ? 'text-3xl' : 'text-xl'} ${isAlmostComplete ? 'text-primary' : 'text-foreground'}`}
          animate={percentControls}
        >
          {percentage.toFixed(2)}%
        </motion.span>
      </div>
      
      <div className={`w-full bg-secondary/50 rounded-full overflow-hidden relative border border-white/5 backdrop-blur-sm ${heights[size]}`}>
        <motion.div 
          className="absolute top-0 left-0 h-full bg-primary/30 blur-md rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/60 via-white/40 to-green-400/60"
          initial={{ opacity: 0 }}
          animate={barFlashControls}
        />
        
        <motion.div
          className={`absolute top-0 left-0 h-full rounded-full ${
            isComplete 
              ? 'bg-gradient-to-r from-primary via-yellow-300 to-primary' 
              : isAlmostComplete
              ? 'bg-gradient-to-r from-accent to-cyan-300'
              : 'bg-gradient-to-r from-primary/80 to-primary'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut", type: "spring", bounce: 0.2 }}
        >
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
          />
        </motion.div>
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground/80">
        <span>{t.progress.drawTrigger} </span>
        <motion.span
          className="inline-block text-red-500 font-bold"
          animate={{
            x: [0, -2, 2, -2, 2, 0],
            scale: [1, 1.02, 1, 1.02, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2.5,
          }}
        >
          {t.progress.drawUrgent}
        </motion.span>
      </div>
    </div>
  );
}
