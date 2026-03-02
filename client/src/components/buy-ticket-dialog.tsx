import React, { useState } from "react";
import { useBuyTickets } from "@/hooks/use-raffles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ticket, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

interface BuyTicketDialogProps {
  raffleId: number;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BuyTicketDialog({ raffleId, title, isOpen, onClose }: BuyTicketDialogProps) {
  const [amount, setAmount] = useState<number>(1);
  const buyMutation = useBuyTickets();
  const { toast } = useToast();
  
  const presets = [1, 5, 10, 50];

  const handleBuy = async () => {
    try {
      await buyMutation.mutateAsync({ id: raffleId, amount });
      
      // Trigger premium celebration
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#F59E0B', '#FBBF24', '#ffffff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#F59E0B', '#FBBF24', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      toast({
        title: "Tickets Secured",
        description: `Successfully acquired ${amount} entries for the ${title}.`,
      });
      
      setTimeout(() => {
        onClose();
        setAmount(1); // Reset
      }, 2000);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Could not process your purchase.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card border-primary/20 shadow-2xl shadow-primary/10">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Ticket className="text-primary h-6 w-6" />
            Acquire Entries
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            Select the number of entries you wish to secure for the <strong className="text-foreground">{title}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex flex-col items-center justify-center space-y-6">
            
            <AnimatePresence mode="wait">
              {buyMutation.isSuccess ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center text-center space-y-4 py-4"
                >
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Entry Confirmed</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your allocation has been registered in the system.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full space-y-6"
                >
                  <div className="flex items-center justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setAmount(Math.max(1, amount - 1))}
                      disabled={amount <= 1 || buyMutation.isPending}
                      className="border-white/10 hover:bg-white/5 h-12 w-12 rounded-full"
                    >
                      -
                    </Button>
                    <div className="text-5xl font-display font-bold w-24 text-center text-glow">
                      {amount}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setAmount(Math.min(100, amount + 1))}
                      disabled={amount >= 100 || buyMutation.isPending}
                      className="border-white/10 hover:bg-white/5 h-12 w-12 rounded-full"
                    >
                      +
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((preset) => (
                      <Button
                        key={preset}
                        variant={amount === preset ? "default" : "outline"}
                        onClick={() => setAmount(preset)}
                        disabled={buyMutation.isPending}
                        className={`
                          ${amount === preset 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                            : 'border-white/10 hover:bg-white/5 text-muted-foreground'}
                          transition-all duration-300
                        `}
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {buyMutation.isError && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg w-full">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>Failed to process transaction. Please try again.</p>
              </div>
            )}
            
          </div>
        </div>

        {!buyMutation.isSuccess && (
          <DialogFooter className="sm:justify-stretch">
            <Button 
              className="w-full font-bold text-lg h-14 bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/90 hover:to-yellow-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleBuy}
              disabled={buyMutation.isPending}
            >
              {buyMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Secure {amount} {amount === 1 ? 'Entry' : 'Entries'}
                </span>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
