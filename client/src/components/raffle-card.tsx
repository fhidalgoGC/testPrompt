import React, { useState } from "react";
import { motion } from "framer-motion";
import { VisualProgress } from "./ui/visual-progress";
import { Button } from "@/components/ui/button";
import { BuyTicketDialog } from "./buy-ticket-dialog";
import { ChevronRight, ShieldCheck } from "lucide-react";

interface Raffle {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  totalTickets: number;
  soldTickets: number;
}

interface RaffleCardProps {
  raffle: Raffle;
  featured?: boolean;
}

export function RaffleCard({ raffle, featured = false }: RaffleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const isComplete = raffle.soldTickets >= raffle.totalTickets;

  return (
    <>
      <motion.div 
        className={`
          group relative overflow-hidden rounded-2xl bg-card border border-white/5
          transition-all duration-500 hover:border-primary/30 box-glow-hover
          ${featured ? 'md:grid md:grid-cols-2 md:gap-0' : 'flex flex-col'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
      >
        {/* Image Section */}
        <div className={`relative overflow-hidden ${featured ? 'h-[200px] sm:h-full sm:min-h-[300px]' : 'h-[180px] sm:h-[240px] w-full'}`}>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 md:bg-gradient-to-r md:from-transparent md:to-card" />
          
          <motion.img 
            src={raffle.imageUrl} 
            alt={raffle.title}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{ 
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className={`
              px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md border
              ${isComplete 
                ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'bg-black/50 text-white border-white/10'}
            `}>
              {isComplete ? 'Awaiting Draw' : 'Active Campaign'}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`relative z-20 flex flex-col justify-between p-4 sm:p-6 ${featured ? 'md:p-10' : ''}`}>
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary/80">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-widest">Verified Asset</span>
            </div>
            
            <h3 className={`font-display font-bold text-foreground mb-2 sm:mb-3 ${featured ? 'text-xl sm:text-3xl md:text-4xl' : 'text-lg sm:text-2xl'}`}>
              {raffle.title}
            </h3>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
              {raffle.description}
            </p>
          </div>

          <div className="mt-auto space-y-6">
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
                  : 'bg-white text-black hover:bg-primary'}
              `}
              size={featured ? "lg" : "default"}
              onClick={() => !isComplete && setIsDialogOpen(true)}
              disabled={isComplete}
            >
              {isComplete ? 'Allocation Full' : 'Secure Entry'}
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
