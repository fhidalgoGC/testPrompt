import { useState, useMemo } from "react";
import { useSoldTickets, useBuyTickets } from "@/hooks/use-raffles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, Zap, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface BuyTicketDialogProps {
  raffleId: number;
  title: string;
  totalTickets: number;
  isOpen: boolean;
  onClose: () => void;
}

const RANGE_SIZE = 100;

function TicketPickerContent({ raffleId, title, totalTickets, onClose }: Omit<BuyTicketDialogProps, "isOpen">) {
  const [rangeStart, setRangeStart] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [buyerName, setBuyerName] = useState("");
  const [searchNum, setSearchNum] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: soldTickets = [], isLoading: loadingSold } = useSoldTickets(raffleId);
  const buyMutation = useBuyTickets();
  const { toast } = useToast();

  const soldSet = useMemo(() => new Set(soldTickets), [soldTickets]);

  const rangeEnd = Math.min(rangeStart + RANGE_SIZE - 1, totalTickets);
  const totalRanges = Math.ceil(totalTickets / RANGE_SIZE);
  const currentRange = Math.floor((rangeStart - 1) / RANGE_SIZE) + 1;

  const numbersInRange = useMemo(() => {
    const nums: number[] = [];
    for (let i = rangeStart; i <= rangeEnd; i++) {
      nums.push(i);
    }
    return nums;
  }, [rangeStart, rangeEnd]);

  const goToRange = (zeroBasedIndex: number) => {
    const clamped = Math.max(0, Math.min(zeroBasedIndex, totalRanges - 1));
    setRangeStart(clamped * RANGE_SIZE + 1);
  };

  const goPrev = () => goToRange(currentRange - 2);
  const goNext = () => goToRange(currentRange);

  const handleSearch = () => {
    const num = parseInt(searchNum, 10);
    if (isNaN(num) || num < 1 || num > totalTickets) {
      toast({ variant: "destructive", title: "Numero invalido", description: `Ingresa un numero entre 1 y ${totalTickets}.` });
      return;
    }
    const newStart = Math.floor((num - 1) / RANGE_SIZE) * RANGE_SIZE + 1;
    setRangeStart(newStart);
    if (soldSet.has(num)) {
      toast({ title: "No disponible", description: `El numero ${num} ya fue vendido.` });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        next.add(num);
        return next;
      });
    }
    setSearchNum("");
  };

  const toggleNumber = (num: number) => {
    if (soldSet.has(num)) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  };

  const handleBuy = async () => {
    if (selected.size === 0 || !buyerName.trim()) return;

    try {
      await buyMutation.mutateAsync({
        id: raffleId,
        ticketNumbers: Array.from(selected),
        buyerName: buyerName.trim(),
      });

      setShowSuccess(true);

      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#F59E0B", "#FBBF24", "#ffffff"],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#F59E0B", "#FBBF24", "#ffffff"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();

      toast({
        title: "Numeros Asegurados",
        description: `Compraste ${selected.size} numeros para ${title}.`,
      });

      setTimeout(() => {
        setSelected(new Set());
        setBuyerName("");
        setShowSuccess(false);
        setRangeStart(1);
        buyMutation.reset();
        onClose();
      }, 2500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron comprar los numeros.",
      });
    }
  };

  const availableInRange = numbersInRange.filter(n => !soldSet.has(n)).length;

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center space-y-4 py-8"
          >
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Compra Confirmada</h3>
              <p className="text-sm text-muted-foreground mt-1">Tus numeros han sido registrados.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Buscar numero..."
                  value={searchNum}
                  onChange={(e) => setSearchNum(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-secondary/50 border-white/10"
                  min={1}
                  max={totalTickets}
                  data-testid="input-search-number"
                />
              </div>
              <Button variant="outline" onClick={handleSearch} className="border-white/10" data-testid="button-search">
                Ir
              </Button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goPrev}
                disabled={currentRange <= 1}
                className="border-white/10 shrink-0"
                data-testid="button-prev-range"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex-1 text-center min-w-0">
                <span className="font-display font-bold text-base" data-testid="text-range-label">
                  {rangeStart} - {rangeEnd}
                </span>
                <span className="text-muted-foreground text-xs ml-1">
                  ({availableInRange} disp.)
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goNext}
                disabled={currentRange >= totalRanges}
                className="border-white/10 shrink-0"
                data-testid="button-next-range"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {Array.from({ length: Math.min(totalRanges, 10) }, (_, i) => {
                const pageIdx = totalRanges <= 10
                  ? i
                  : Math.max(0, Math.min(currentRange - 6, totalRanges - 10)) + i;
                const start = pageIdx * RANGE_SIZE + 1;
                const end = Math.min(start + RANGE_SIZE - 1, totalTickets);
                const isActive = pageIdx === currentRange - 1;
                return (
                  <Button
                    key={pageIdx}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToRange(pageIdx)}
                    className={`text-[10px] shrink-0 px-2 ${isActive ? "" : "border-white/10 text-muted-foreground"}`}
                    data-testid={`button-range-${pageIdx}`}
                  >
                    {start}-{end}
                  </Button>
                );
              })}
            </div>

            {loadingSold ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-[6px] sm:gap-1" data-testid="grid-numbers">
                {numbersInRange.map((num) => {
                  const isSold = soldSet.has(num);
                  const isSelected = selected.has(num);
                  return (
                    <button
                      key={num}
                      onClick={() => toggleNumber(num)}
                      disabled={isSold}
                      className={`
                        aspect-square rounded-md text-xs font-bold flex items-center justify-center transition-all duration-150 touch-manipulation
                        ${isSold
                          ? "bg-destructive/20 text-destructive/50 cursor-not-allowed line-through"
                          : isSelected
                          ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(245,158,11,0.4)] scale-105"
                          : "bg-secondary/50 text-muted-foreground border border-white/5 active:bg-primary/20 sm:hover:border-primary/40 sm:hover:bg-primary/10 sm:hover:text-foreground"
                        }
                      `}
                      data-testid={`button-number-${num}`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-secondary/50 border border-white/5" />
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span>Tu seleccion</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-destructive/20" />
                <span>Vendido</span>
              </div>
            </div>

            {selected.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-gold rounded-lg p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Seleccionados:</span>
                  <span className="text-primary font-display font-bold text-lg" data-testid="text-selected-count">{selected.size}</span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                  {Array.from(selected).sort((a, b) => a - b).map(num => (
                    <span
                      key={num}
                      className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-md font-medium cursor-pointer active:bg-destructive/20 active:text-destructive sm:hover:bg-destructive/20 sm:hover:text-destructive transition-colors touch-manipulation"
                      onClick={() => toggleNumber(num)}
                      data-testid={`tag-selected-${num}`}
                    >
                      {num}
                    </span>
                  ))}
                </div>

                <Input
                  placeholder="Tu nombre"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="bg-secondary/50 border-white/10"
                  data-testid="input-buyer-name"
                />

                <Button
                  className="w-full font-bold text-base h-12 bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.98]"
                  onClick={handleBuy}
                  disabled={buyMutation.isPending || !buyerName.trim()}
                  data-testid="button-confirm-buy"
                >
                  {buyMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Comprar {selected.size} {selected.size === 1 ? "numero" : "numeros"}
                    </span>
                  )}
                </Button>
              </motion.div>
            )}

            {buyMutation.isError && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{buyMutation.error instanceof Error ? buyMutation.error.message : "Error al procesar la compra."}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BuyTicketDialog({ raffleId, title, totalTickets, isOpen, onClose }: BuyTicketDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="bg-card border-primary/20 max-h-[92dvh]">
          <DrawerHeader className="text-left px-4 pt-2 pb-0">
            <DrawerTitle className="font-display text-xl flex items-center gap-2" data-testid="text-dialog-title">
              <Ticket className="text-primary h-5 w-5" />
              Escoge tus numeros
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-sm" data-testid="text-dialog-description">
              Selecciona los numeros para <strong className="text-foreground">{title}</strong>
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 pt-2 overflow-y-auto">
            {isOpen && <TicketPickerContent raffleId={raffleId} title={title} totalTickets={totalTickets} onClose={onClose} />}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-primary/20 shadow-2xl shadow-primary/10 p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-2xl flex items-center gap-2" data-testid="text-dialog-title">
            <Ticket className="text-primary h-6 w-6" />
            Escoge tus numeros
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2" data-testid="text-dialog-description">
            Selecciona los numeros para <strong className="text-foreground">{title}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-4">
          {isOpen && <TicketPickerContent raffleId={raffleId} title={title} totalTickets={totalTickets} onClose={onClose} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
