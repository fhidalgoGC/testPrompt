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
  const percentage = total > 0 ? (sold / total) * 100 : 0;
  const isAlmostComplete = percentage >= 90;
  const isComplete = percentage >= 100;

  const barFlashControls = useAnimation();

  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-5"
  };

  return (
    <div className={`w-full ${className}`}>
      
      <div className={`w-full bg-secondary/50 rounded-full overflow-hidden relative border border-border backdrop-blur-sm ${heights[size]}`}>
        <motion.div 
          className="absolute top-0 left-0 h-full bg-green-700/30 dark:bg-green-500/30 blur-md rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.div
          className={`absolute top-0 left-0 h-full rounded-full ${
            isComplete 
              ? 'bg-gradient-to-r from-green-600 via-green-400 to-green-600 dark:from-green-500 dark:via-green-300 dark:to-green-500' 
              : isAlmostComplete
              ? 'bg-gradient-to-r from-green-600 to-green-500 dark:from-green-400 dark:to-green-300'
              : 'bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500/80 dark:to-green-500'
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
        <motion.div
          className="absolute inset-0 z-10 rounded-full bg-white/70"
          style={{ boxShadow: "0 0 12px 4px rgba(34,197,94,0.5)" }}
          initial={{ opacity: 0 }}
          animate={barFlashControls}
        />
      </div>
      
      <div className="mt-1 text-center">
        <span className="text-xs font-bold text-foreground">
          {sold} / {total} ({percentage.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
