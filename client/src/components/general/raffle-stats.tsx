import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { VisualProgress } from "@/components/ui/visual-progress";
import { useI18n } from "@/lib/i18n";
import { fetchRaffleStats, type RaffleStatsData } from "@/services/progressBar.service";

export function RaffleStats() {
  const { t } = useI18n();
  const [stats, setStats] = useState<RaffleStatsData | null>(null);
  const [viewersCount, setViewersCount] = useState(Math.floor(Math.random() * (150 - 20 + 1) + 20));

  useEffect(() => {
    fetchRaffleStats()
      .then(setStats)
      .catch((err) => console.error("Error fetching raffle stats:", err));

    const polling = setInterval(() => {
      fetchRaffleStats()
        .then(setStats)
        .catch((err) => console.error("Error polling raffle stats:", err));
    }, 30000);

    return () => clearInterval(polling);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount(prev => {
        const minViewers = 20;
        const maxViewers = 150;
        const change = Math.floor(Math.random() * 20) - 10;
        const newCount = Math.max(minViewers, Math.min(maxViewers, prev + change));
        return newCount;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sold = stats?.vendidos ?? 0;
  const total = stats?.total ?? 0;
  const isComplete = total > 0 && sold >= total;
  const isLoading = stats === null;

  if (isLoading) {
    return (
      <div className="w-full animate-pulse" data-testid="stats-loading">
        <div className="h-3 bg-secondary/50 rounded-full mb-2" />
        <div className="h-4 bg-secondary/30 rounded w-1/3 mx-auto" />
      </div>
    );
  }

  return (
    <>
      {!isComplete && (
        <div className="flex items-center gap-2 mb-2" data-testid="viewers-counter">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-600/10 dark:bg-green-500/10 border border-green-600/30 dark:border-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 dark:bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600 dark:bg-green-500"></span>
            </span>
            <Eye className="w-3.5 h-3.5 text-green-700 dark:text-green-400" />
            <span className="text-xs font-bold text-green-700 dark:text-green-400">{viewersCount}</span>
          </div>
          <span className="text-xs text-foreground font-bold">
            {t.raffle.viewersWatching}
          </span>
        </div>
      )}

      <VisualProgress 
        sold={sold} 
        total={total}
      />
    </>
  );
}