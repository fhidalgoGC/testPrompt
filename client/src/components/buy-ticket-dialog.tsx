import { useState, useMemo } from "react";
import { useSoldTickets, useBuyTickets, useSendOtp } from "@/hooks/use-raffles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, Zap, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Search, Mail, Sparkles, Phone, User, CreditCard, ShieldCheck, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/lib/i18n";

interface BuyTicketDialogProps {
  raffleId: number;
  title: string;
  totalTickets: number;
  isOpen: boolean;
  onClose: () => void;
}

const RANGE_SIZE = 100;

type PickerStep = "picker" | "confirm" | "success";

function ContactModal({
  isOpen,
  onClose,
  onSubmitted,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (phone: string, email: string, idNumber: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [idNumber, setIdNumber] = useState("");

  const sendOtpMutation = useSendOtp();
  const { toast } = useToast();
  const { t } = useI18n();
  const isMobile = useIsMobile();

  const resetState = () => {
    setPhone("");
    setEmail("");
    setIdNumber("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    if (!phone.trim() || !email.trim() || !idNumber.trim()) {
      toast({ variant: "destructive", title: t.picker.fillAllFields, description: t.picker.fillAllFieldsDesc });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({ variant: "destructive", title: t.picker.invalidEmail, description: t.picker.invalidEmailDesc });
      return;
    }
    try {
      await sendOtpMutation.mutateAsync({ phone: phone.trim() });
      toast({ title: t.picker.codeSent, description: t.picker.codeSentDesc });
    } catch {
      toast({ variant: "destructive", title: t.picker.errorTitle, description: t.picker.errorGeneric });
    }
    onSubmitted(phone.trim(), email.trim(), idNumber.trim());
    resetState();
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 py-2"
    >
      <p className="text-sm text-muted-foreground leading-relaxed">
        {t.picker.verifyInfoDesc}
      </p>
      <div className="space-y-3">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="tel"
            placeholder={t.picker.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-secondary/50 border-white/10 pl-10"
            data-testid="input-buyer-phone"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder={t.picker.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary/50 border-white/10 pl-10"
            data-testid="input-buyer-email"
          />
        </div>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.picker.idPlaceholder}
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="bg-secondary/50 border-white/10 pl-10"
            data-testid="input-buyer-id"
          />
        </div>
      </div>

      <div className="glass rounded-lg p-3 flex items-start gap-3">
        <MessageSquare className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.picker.smsExplanation}
        </p>
      </div>

      <Button
        className="w-full font-bold h-12 bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.98]"
        onClick={handleSubmit}
        disabled={sendOtpMutation.isPending || !phone.trim() || !email.trim() || !idNumber.trim()}
        data-testid="button-continue-purchase"
      >
        {sendOtpMutation.isPending ? (
          <span className="flex items-center gap-2">
            <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            {t.picker.sendingCode}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t.picker.continueBtn}
          </span>
        )}
      </Button>
    </motion.div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DrawerContent className="bg-card border-primary/20 max-h-[85dvh]">
          <DrawerHeader className="text-left px-4 pt-2 pb-0">
            <DrawerTitle className="font-display text-lg flex items-center gap-2" data-testid="text-contact-modal-title">
              <ShieldCheck className="text-primary h-5 w-5" />
              {t.picker.contactModalTitle}
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-sm">
              {t.picker.contactModalSubtitle}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6 pt-2">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[420px] bg-card border-primary/20 shadow-2xl shadow-primary/10">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2" data-testid="text-contact-modal-title">
            <ShieldCheck className="text-primary h-5 w-5" />
            {t.picker.contactModalTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t.picker.contactModalSubtitle}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

function TicketPickerContent({ raffleId, title, totalTickets, onClose }: Omit<BuyTicketDialogProps, "isOpen">) {
  const [rangeStart, setRangeStart] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [buyerName, setBuyerName] = useState("");
  const [searchNum, setSearchNum] = useState("");
  const [step, setStep] = useState<PickerStep>("picker");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactData, setContactData] = useState<{ phone: string; email: string; idNumber: string } | null>(null);

  const { data: soldTickets = [], isLoading: loadingSold } = useSoldTickets(raffleId);
  const buyMutation = useBuyTickets();
  const { toast } = useToast();
  const { t } = useI18n();

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
      toast({ variant: "destructive", title: t.picker.invalidNumber, description: `${t.picker.invalidNumberDesc} ${totalTickets}.` });
      return;
    }
    const newStart = Math.floor((num - 1) / RANGE_SIZE) * RANGE_SIZE + 1;
    setRangeStart(newStart);
    if (soldSet.has(num)) {
      toast({ title: t.picker.notAvailable, description: t.picker.notAvailableDesc.replace("{num}", String(num)) });
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

  const handleProceedToContact = () => {
    if (selected.size === 0 || !buyerName.trim()) return;
    setShowContactModal(true);
  };

  const handleContactSubmitted = (phone: string, email: string, idNumber: string) => {
    setContactData({ phone, email, idNumber });
    setShowContactModal(false);
    setStep("confirm");
  };

  const handleConfirmBuy = async () => {
    if (!contactData) return;
    try {
      await buyMutation.mutateAsync({
        id: raffleId,
        ticketNumbers: Array.from(selected),
        buyerName: buyerName.trim(),
        buyerPhone: contactData.phone,
        buyerEmail: contactData.email,
        buyerIdNumber: contactData.idNumber,
      });

      setStep("success");

      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#F59E0B", "#FBBF24", "#ffffff"] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#F59E0B", "#FBBF24", "#ffffff"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();

      toast({
        title: t.picker.toastTitle,
        description: t.picker.toastDesc.replace("{count}", String(selected.size)).replace("{title}", title),
      });

      setTimeout(() => {
        setSelected(new Set());
        setBuyerName("");
        setStep("picker");
        setContactData(null);
        setRangeStart(1);
        buyMutation.reset();
        onClose();
      }, 2500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t.picker.errorTitle,
        description: error instanceof Error ? error.message : t.picker.errorDesc,
      });
    }
  };

  const availableInRange = numbersInRange.filter(n => !soldSet.has(n)).length;

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {step === "success" ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center space-y-4 py-8"
            >
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground" data-testid="text-success-title">{t.picker.successTitle}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.picker.successDesc}</p>
              </div>
              <div className="glass rounded-lg p-3 flex items-start gap-3 max-w-sm">
                <MessageSquare className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed text-left">
                  {t.picker.otpReminder}
                </p>
              </div>
            </motion.div>
          ) : step === "confirm" ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5 py-4"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground" data-testid="text-confirm-title">
                    {t.picker.confirmTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">
                    {t.picker.confirmDesc}
                  </p>
                </div>
              </div>

              <div className="glass-gold rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.picker.selected}</span>
                  <span className="text-primary font-display font-bold" data-testid="text-confirm-count">{selected.size}</span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                  {Array.from(selected).sort((a, b) => a - b).map(num => (
                    <span key={num} className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-md font-medium">
                      {num}
                    </span>
                  ))}
                </div>
                {contactData && (
                  <div className="border-t border-white/10 pt-2 mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><User className="h-3 w-3" /> {buyerName}</div>
                    <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {contactData.phone}</div>
                    <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {contactData.email}</div>
                    <div className="flex items-center gap-2"><CreditCard className="h-3 w-3" /> {contactData.idNumber}</div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10"
                  onClick={() => { setStep("picker"); setContactData(null); }}
                  data-testid="button-back-to-picker"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
                <Button
                  className="flex-1 font-bold bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.98]"
                  onClick={handleConfirmBuy}
                  disabled={buyMutation.isPending}
                  data-testid="button-final-confirm"
                >
                  {buyMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      {t.picker.processing}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selected.size === 1 ? t.picker.buyButton : t.picker.buyButtonPlural}
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder={t.picker.searchPlaceholder}
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
                  {t.picker.go}
                </Button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button variant="outline" size="icon" onClick={goPrev} disabled={currentRange <= 1} className="border-white/10 shrink-0" data-testid="button-prev-range">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center min-w-0">
                  <span className="font-display font-bold text-base" data-testid="text-range-label">{rangeStart} - {rangeEnd}</span>
                  <span className="text-muted-foreground text-xs ml-1">({availableInRange} {t.picker.availableShort})</span>
                </div>
                <Button variant="outline" size="icon" onClick={goNext} disabled={currentRange >= totalRanges} className="border-white/10 shrink-0" data-testid="button-next-range">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {Array.from({ length: Math.min(totalRanges, 10) }, (_, i) => {
                  const pageIdx = totalRanges <= 10 ? i : Math.max(0, Math.min(currentRange - 6, totalRanges - 10)) + i;
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
                  <span>{t.picker.legendAvailable}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-primary" />
                  <span>{t.picker.legendSelected}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-destructive/20" />
                  <span>{t.picker.legendSold}</span>
                </div>
              </div>

              {selected.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-gold rounded-lg p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t.picker.selected}</span>
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

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t.picker.namePlaceholder}
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="bg-secondary/50 border-white/10 pl-10"
                      data-testid="input-buyer-name"
                    />
                  </div>

                  <Button
                    className="w-full font-bold text-base h-12 bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.98]"
                    onClick={handleProceedToContact}
                    disabled={!buyerName.trim() || selected.size === 0}
                    data-testid="button-proceed-contact"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      {selected.size === 1 ? t.picker.buyButton : t.picker.buyButtonPlural}
                    </span>
                  </Button>
                </motion.div>
              )}

              {buyMutation.isError && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{buyMutation.error instanceof Error ? buyMutation.error.message : t.picker.errorGeneric}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmitted={handleContactSubmitted}
      />
    </>
  );
}

export function BuyTicketDialog({ raffleId, title, totalTickets, isOpen, onClose }: BuyTicketDialogProps) {
  const isMobile = useIsMobile();
  const { t } = useI18n();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="bg-card border-primary/20 max-h-[92dvh]">
          <DrawerHeader className="text-left px-4 pt-2 pb-0">
            <DrawerTitle className="font-display text-xl flex items-center gap-2" data-testid="text-dialog-title">
              <Ticket className="text-primary h-5 w-5" />
              {t.picker.title}
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-sm" data-testid="text-dialog-description">
              {t.picker.subtitle} <strong className="text-foreground">{title}</strong>
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
            {t.picker.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2" data-testid="text-dialog-description">
            {t.picker.subtitle} <strong className="text-foreground">{title}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-4">
          {isOpen && <TicketPickerContent raffleId={raffleId} title={title} totalTickets={totalTickets} onClose={onClose} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
