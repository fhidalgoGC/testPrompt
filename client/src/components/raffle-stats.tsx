import { Eye } from "lucide-react";
import { VisualProgress } from "@/components/ui/visual-progress";

interface RaffleStatsProps {
  viewersCount: number;
  sold: number;
  total: number;
}

export function RaffleStats({ viewersCount, sold, total }: RaffleStatsProps) {
  return (
    <div className="w-full space-y-3">
      {/* Viewers Badge */}
      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-950/30 border border-green-300 dark:border-green-700/50 rounded-full w-fit mx-auto">
        <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse" />
        <Eye className="w-4 h-4 text-green-700 dark:text-green-400" />
        <span className="text-sm font-semibold text-green-900 dark:text-green-300">
          {viewersCount} Personas están viendo este item
        </span>
      </div>

      {/* Progress Bar and Percentage */}
      <VisualProgress sold={sold} total={total} size="lg" />
    </div>
  );
}
