import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface VisualProgressProps {
  sold: number;
  total: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VisualProgress({ sold, total, className = "", size = "md" }: VisualProgressProps) {
  const [percentage, setPercentage] = useState(0);
  
  // Animate the percentage value for a smooth counting effect
  useEffect(() => {
    const target = Math.min(100, Math.max(0, (sold / total) * 100));
    setPercentage(target);
  }, [sold, total]);

  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-5"
  };

  const isAlmostComplete = percentage >= 90;
  const isComplete = percentage >= 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase flex items-center gap-2">
          {isComplete ? (
            <span className="text-primary font-bold text-glow">Target Reached</span>
          ) : isAlmostComplete ? (
            <span className="text-accent font-bold">Imminent Draw</span>
          ) : (
            <span>Funding Progress</span>
          )}
        </span>
        <span className={`font-display font-bold ${size === 'lg' ? 'text-3xl' : 'text-xl'} ${isAlmostComplete ? 'text-primary' : 'text-foreground'}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      
      <div className={`w-full bg-secondary/50 rounded-full overflow-hidden relative border border-white/5 backdrop-blur-sm ${heights[size]}`}>
        {/* Glow effect behind the bar */}
        <motion.div 
          className="absolute top-0 left-0 h-full bg-primary/30 blur-md rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* The actual solid bar */}
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
          {/* Shimmer sweep effect inside the bar */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
            animate={{ 
              x: ['-100%', '200%'] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              ease: "linear",
              repeatDelay: 1
            }}
          />
        </motion.div>
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground/80 flex justify-between">
        <span>Draw triggers exclusively at 100%</span>
        <span>{total} Total Capacity</span>
      </div>
    </div>
  );
}
