import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisualProgress } from "./ui/visual-progress";
import { Button } from "@/components/ui/button";
import { BuyTicketDialog } from "./buy-ticket-dialog";
import { ShieldCheck, Eye, ChevronRight } from "lucide-react";
import seedIconImg from "@/assets/seed-icon-nobg.png";
import { useI18n } from "@/lib/i18n";

interface Raffle {
  id: number;
  title: string;
  description: string;
  imageUrls: string[];
  totalTickets: number;
  soldTickets: number;
}

interface RaffleCardProps {
  raffle: Raffle;
  featured?: boolean;
  badgeLabel?: string;
}

export function RaffleCard({ raffle, featured = false, badgeLabel }: RaffleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useI18n();
  const images = raffle.imageUrls || [];
  
  const isComplete = raffle.soldTickets >= raffle.totalTickets;

  const baseViewers = useMemo(() => {
    const seed = raffle.id * 7 + 137;
    return 180 + (seed % 250);
  }, [raffle.id]);

  const [viewers, setViewers] = useState(baseViewers);

  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      setViewers(prev => {
        const delta = Math.floor(Math.random() * 21) - 10;
        return Math.max(150, Math.min(500, prev + delta));
      });
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <>
      <motion.div 
        className={`
          group relative overflow-hidden rounded-2xl bg-card border border-border
          transition-all duration-500 hover:border-primary/30 box-glow-hover
          shadow-lg dark:shadow-none dark:border-white/5
          ${featured ? 'md:grid md:grid-cols-2 md:gap-0' : 'flex flex-col'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
      >
        <div className={`relative overflow-hidden ${featured ? 'h-[250px] sm:h-full sm:min-h-[350px]' : 'h-[180px] sm:h-[240px] w-full'}`}>
          <div className="absolute inset-0 z-10 hidden dark:md:block md:bg-gradient-to-r md:from-transparent md:to-card" />
          
          <motion.img
            src={images[0]}
            alt={raffle.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {isComplete ? (
              <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md border bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {t.raffle.awaitingDraw}
              </div>
            ) : null}
          </div>
        </div>

        <div className={`relative z-20 flex flex-col justify-between p-4 sm:p-6 ${featured ? 'md:p-10' : ''}`}>
          <div>
            
            <h3 className={`mb-2 sm:mb-3 font-extrabold tracking-wide raffle-title ${featured ? 'text-2xl sm:text-4xl md:text-5xl' : 'text-xl sm:text-3xl'}`} style={{fontFamily: "'Playfair Display', serif"}}>
              {raffle.title}
            </h3>
            
            {raffle.description && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                {raffle.description}
              </p>
            )}
            {!isComplete && (
              <div className="flex items-center gap-2 mb-3 sm:mb-4" data-testid="viewers-counter">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-600/10 dark:bg-green-500/10 border border-green-600/30 dark:border-green-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 dark:bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600 dark:bg-green-500"></span>
                  </span>
                  <Eye className="w-3.5 h-3.5 text-green-700 dark:text-green-400" />
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">{viewers}</span>
                </div>
                <span className="text-xs text-foreground font-bold">
                  {t.raffle.viewersWatching}
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-4 sm:space-y-6">
            <VisualProgress 
              sold={raffle.soldTickets} 
              total={raffle.totalTickets} 
              size={featured ? "lg" : "md"}
            />
            
            <Button 
              className={`
                w-full font-bold group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300
                ${isComplete 
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary cursor-not-allowed opacity-80' 
                  : 'bg-primary text-black hover:bg-yellow-500'}
              `}
              size={featured ? "lg" : "default"}
              onClick={() => !isComplete && setIsDialogOpen(true)}
              disabled={isComplete}
              data-testid={`button-secure-entry-${raffle.id}`}
            >
              {isComplete ? t.raffle.allocationFull : (<>{t.raffle.secureEntry}<img src={seedIconImg} alt="Semilla" className="w-6 h-6 ml-1 object-contain" /></>)}
              {!isComplete && (
                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      <BuyTicketDialog 
        raffleId={raffle.id}
        title={raffle.title}
        totalTickets={raffle.totalTickets}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
