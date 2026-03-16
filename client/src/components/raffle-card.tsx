import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RaffleStats } from "@/components/raffle-stats";
import { Button } from "@/components/ui/button";
import { BuyTicketDialog } from "./buy-ticket-dialog";
import { ShieldCheck, ChevronRight } from "lucide-react";
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
          flex flex-col max-w-[700px] mx-auto
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
      >
        <div className={`relative w-full ${featured ? '' : 'h-[180px] sm:h-[240px]'}`}>
          {featured && (
            <motion.img
              src={images[0]}
              alt={raffle.title}
              className="w-full h-auto object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
          {!featured && (
            <>
              <div className="absolute inset-0 z-10 hidden dark:md:block md:bg-gradient-to-r md:from-transparent md:to-card" />
              <motion.img
                src={images[0]}
                alt={raffle.title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </>
          )}
          
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {isComplete ? (
              <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md border bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {t.raffle.awaitingDraw}
              </div>
            ) : null}
          </div>
        </div>

        <div className={`relative z-20 flex flex-col justify-between p-4 sm:p-6 ${featured ? 'p-6 sm:p-8' : ''}`}>
          <div>
            
            <h3 className={`mb-2 sm:mb-3 font-extrabold tracking-wide raffle-title text-center ${featured ? 'text-2xl sm:text-4xl md:text-5xl' : 'text-xl sm:text-3xl'}`} style={{fontFamily: "'Playfair Display', serif"}}>
              {raffle.title}
            </h3>
            
            {raffle.description && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                {raffle.description}
              </p>
            )}
            <RaffleStats 
              viewersCount={viewers}
              sold={raffle.soldTickets}
              total={raffle.totalTickets}
              isComplete={isComplete}
            />
          </div>

          <div className="mt-auto space-y-4 sm:space-y-5 pt-4 sm:pt-6">
            
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
