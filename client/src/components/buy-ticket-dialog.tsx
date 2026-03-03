import { useState, useEffect, useRef, useCallback } from "react";
import { useBuyTickets, useSendOtp, useVerifyOtp } from "@/hooks/use-raffles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, Zap, CheckCircle2, AlertCircle, ChevronLeft, Mail, Sparkles, Phone, CreditCard, ShieldCheck, Timer, Minus, Plus, Clock } from "lucide-react";
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

const OTP_TIMEOUT_SECONDS = 300;
const MAX_TICKETS = 100;

type Step = "country" | "quantity" | "info" | "otp" | "confirm" | "success";

type Country = "VE" | "MX" | "CO";

const COUNTRY_CONFIG: Record<Country, { name: string; flag: string; currency: string; price: number }> = {
  VE: { name: "Venezuela", flag: "🇻🇪", currency: "USD", price: 1 },
  MX: { name: "México", flag: "🇲🇽", currency: "MXN", price: 18 },
  CO: { name: "Colombia", flag: "🇨🇴", currency: "COP", price: 4200 },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TicketPickerContent({ raffleId, title, totalTickets, onClose }: Omit<BuyTicketDialogProps, "isOpen">) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerIdNumber, setBuyerIdNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<Step>("country");
  const [timeLeft, setTimeLeft] = useState(OTP_TIMEOUT_SECONDS);
  const [assignedNumbers, setAssignedNumbers] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buyMutation = useBuyTickets();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const { toast } = useToast();
  const { t } = useI18n();

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(OTP_TIMEOUT_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  useEffect(() => {
    if (timeLeft === 0 && step === "otp") {
      toast({ title: t.picker.timerExpiredTitle, description: t.picker.timerExpiredDesc });
      setStep("confirm");
    }
  }, [timeLeft, step]);

  const handleClose = useCallback(() => {
    stopTimer();
    onClose();
  }, [stopTimer, onClose]);

  const handleProceedToInfo = () => {
    if (quantity < 1 || !buyerEmail.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail.trim())) {
      toast({ variant: "destructive", title: t.picker.invalidEmail, description: t.picker.invalidEmailDesc });
      return;
    }
    setStep("info");
  };

  const handleSendCode = async () => {
    const phoneDigits = buyerPhone.trim().replace(/\D/g, "");
    if (phoneDigits.length < 8) {
      toast({ variant: "destructive", title: t.picker.invalidPhone, description: t.picker.invalidPhoneDesc });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail.trim())) {
      toast({ variant: "destructive", title: t.picker.invalidEmail, description: t.picker.invalidEmailDesc });
      return;
    }
    try {
      await sendOtpMutation.mutateAsync({ phone: buyerPhone.trim() });
      toast({ title: t.picker.codeSent, description: t.picker.codeSentToEmail });
      setStep("otp");
      startTimer();
    } catch {
      toast({ variant: "destructive", title: t.picker.errorTitle, description: t.picker.errorGeneric });
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) return;
    try {
      const result = await verifyOtpMutation.mutateAsync({ phone: buyerPhone.trim(), code: otpCode });
      if (result.valid) {
        stopTimer();
        setStep("confirm");
      } else {
        toast({ variant: "destructive", title: t.picker.codeInvalid, description: t.picker.codeInvalidDesc });
      }
    } catch (error) {
      toast({ variant: "destructive", title: t.picker.errorTitle, description: error instanceof Error ? error.message : t.picker.errorGeneric });
    }
  };

  const handleResendOtp = async () => {
    setOtpCode("");
    try {
      await sendOtpMutation.mutateAsync({ phone: buyerPhone.trim() });
      toast({ title: t.picker.codeSent, description: t.picker.codeSentToEmail });
      startTimer();
    } catch {
      toast({ variant: "destructive", title: t.picker.errorTitle, description: t.picker.errorGeneric });
    }
  };

  const handleConfirmBuy = async () => {
    try {
      const result = await buyMutation.mutateAsync({
        id: raffleId,
        quantity,
        buyerPhone: buyerPhone.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerIdNumber: buyerIdNumber.trim(),
      });
      setAssignedNumbers(result.assignedNumbers);
      setStep("success");
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#F59E0B", "#FBBF24", "#ffffff"] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#F59E0B", "#FBBF24", "#ffffff"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
      toast({ title: t.picker.toastTitle, description: t.picker.toastDesc.replace("{count}", String(quantity)).replace("{title}", title) });
    } catch (error) {
      toast({ variant: "destructive", title: t.picker.errorTitle, description: error instanceof Error ? error.message : t.picker.errorDesc });
    }
  };

  const timerPercent = (timeLeft / OTP_TIMEOUT_SECONDS) * 100;
  const timerUrgent = timeLeft <= 60;

  const quickAmounts = [1, 2, 3, 5, 10, 25];

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {step === "success" ? (
          <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-4 py-6">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground" data-testid="text-success-title">{t.picker.successTitle}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.picker.successDesc}</p>
            </div>
            {assignedNumbers.length > 0 && (
              <div className="glass-gold rounded-lg p-4 w-full max-w-sm">
                <p className="text-sm font-medium text-foreground mb-2">{t.picker.yourNumbers}</p>
                <div className="flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto">
                  {assignedNumbers.map(num => (
                    <span key={num} className="px-2.5 py-1 text-sm bg-primary/20 text-primary rounded-md font-bold font-mono">{num}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="w-full max-w-sm rounded-lg border border-red-500/30 bg-red-500/10 p-4 space-y-2" data-testid="payment-warning">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <Clock className="h-4 w-4 shrink-0" />
                {t.picker.paymentWarningTitle}
              </div>
              <p className="text-xs text-red-300/80 leading-relaxed">{t.picker.paymentWarningDesc}</p>
            </div>
            <Button variant="outline" className="mt-2 border-white/10" onClick={handleClose} data-testid="button-close-success">
              {t.picker.closeBtn}
            </Button>
          </motion.div>
        ) : step === "confirm" ? (
          <motion.div key="confirm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5 py-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold text-foreground" data-testid="text-confirm-title">{t.picker.confirmTitle}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">{t.picker.confirmDesc}</p>
              </div>
            </div>
            <div className="glass-gold rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.picker.ticketCount}</span>
                <span className="text-primary font-display font-bold text-lg" data-testid="text-confirm-count">{quantity}</span>
              </div>
              <p className="text-xs text-muted-foreground">{t.picker.randomAssignNote}</p>
              <div className="border-t border-white/10 pt-2 mt-2 space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {buyerEmail}</div>
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {buyerPhone}</div>
                {buyerIdNumber.trim() && <div className="flex items-center gap-2"><CreditCard className="h-3 w-3" /> {buyerIdNumber}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-white/10" onClick={() => setStep("info")} data-testid="button-back-to-info">
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
                    <Zap className="h-4 w-4" />
                    {t.picker.confirmBtn}
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        ) : step === "otp" ? (
          <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 py-2">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                <Mail className="h-7 w-7 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-foreground" data-testid="text-otp-title">{t.picker.verifyTitle}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-xs mx-auto">
                  {t.picker.verifyDesc.replace("{phone}", buyerPhone)}
                </p>
              </div>
            </div>

            <div className="relative w-full h-2 bg-secondary/50 rounded-full overflow-hidden">
              <motion.div
                className={`absolute left-0 top-0 h-full rounded-full ${timerUrgent ? "bg-destructive" : "bg-accent"}`}
                initial={{ width: "100%" }}
                animate={{ width: `${timerPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <Timer className={`h-4 w-4 ${timerUrgent ? "text-destructive animate-pulse" : "text-accent"}`} />
              <span className={`font-mono text-lg font-bold ${timerUrgent ? "text-destructive" : "text-accent"}`} data-testid="text-timer">
                {formatTime(timeLeft)}
              </span>
            </div>

            <Input
              type="text" inputMode="numeric" maxLength={6} placeholder={t.picker.otpPlaceholder}
              value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="bg-secondary/50 border-white/10 text-center text-2xl font-mono tracking-[0.5em] h-14"
              data-testid="input-otp-code"
            />

            <Button
              className="w-full font-bold h-12 bg-gradient-to-r from-accent to-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 active:scale-[0.98]"
              onClick={handleVerifyOtp} disabled={otpCode.length !== 6 || verifyOtpMutation.isPending}
              data-testid="button-verify-otp"
            >
              {verifyOtpMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {t.picker.verifying}
                </span>
              ) : (
                <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />{t.picker.verifyCode}</span>
              )}
            </Button>

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => { stopTimer(); setStep("info"); setOtpCode(""); }} className="text-muted-foreground" data-testid="button-back-from-otp">
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleResendOtp} disabled={sendOtpMutation.isPending} className="text-accent" data-testid="button-resend-otp">
                {sendOtpMutation.isPending ? t.picker.sendingCode : t.picker.resendCode}
              </Button>
            </div>
          </motion.div>
        ) : step === "info" ? (
          <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 py-2">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" onClick={() => setStep("quantity")} className="text-muted-foreground -ml-2" data-testid="button-back-to-quantity">
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
              <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="text-primary h-5 w-5" />
                {t.picker.contactModalTitle}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.picker.verifyInfoDesc}</p>
            <div className="space-y-3">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="tel" placeholder={t.picker.phonePlaceholder} value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className="bg-secondary/50 border-white/10 pl-10" data-testid="input-buyer-phone" />
              </div>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder={t.picker.idPlaceholder} value={buyerIdNumber} onChange={(e) => setBuyerIdNumber(e.target.value)} className="bg-secondary/50 border-white/10 pl-10" data-testid="input-buyer-id" />
              </div>
            </div>

            <div className="glass rounded-lg p-3 flex items-start gap-3">
              <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{t.picker.emailCodeExplanation}</p>
            </div>

            <Button
              className="w-full font-bold h-12 bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.98]"
              onClick={handleSendCode} disabled={sendOtpMutation.isPending || !buyerPhone.trim() || !buyerEmail.trim()}
              data-testid="button-send-code"
            >
              {sendOtpMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {t.picker.sendingCode}
                </span>
              ) : (
                <span className="flex items-center gap-2"><Mail className="h-5 w-5" />{t.picker.sendCodeEmail}</span>
              )}
            </Button>
          </motion.div>
        ) : step === "quantity" ? (
          <motion.div key="quantity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" onClick={() => setStep("country")} className="text-muted-foreground -ml-2" data-testid="button-back-to-country">
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
              <div className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground leading-relaxed">{t.picker.quantityDesc}</p>
              </div>
            </div>

            {selectedCountry && (
              <div className="glass-gold rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.picker.pricePerSeed}</span>
                <span className="text-lg font-display font-bold text-primary" data-testid="text-price">
                  {COUNTRY_CONFIG[selectedCountry].price} {COUNTRY_CONFIG[selectedCountry].currency}
                </span>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline" size="icon"
                className="h-12 w-12 rounded-full border-white/10 text-foreground"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                data-testid="button-decrease-qty"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="w-24 text-center">
                <Input
                  type="number" min={1} max={MAX_TICKETS} value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1 && val <= MAX_TICKETS) setQuantity(val);
                    else if (e.target.value === "") setQuantity(1);
                  }}
                  className="bg-secondary/50 border-white/10 text-center text-3xl font-display font-bold h-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  data-testid="input-quantity"
                />
              </div>
              <Button
                variant="outline" size="icon"
                className="h-12 w-12 rounded-full border-white/10 text-foreground"
                onClick={() => setQuantity(q => Math.min(MAX_TICKETS, q + 1))}
                disabled={quantity >= MAX_TICKETS}
                data-testid="button-increase-qty"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {quickAmounts.map(amt => (
                <Button
                  key={amt} variant={quantity === amt ? "default" : "outline"} size="sm"
                  className={`min-w-[3rem] ${quantity === amt ? "" : "border-white/10 text-muted-foreground"}`}
                  onClick={() => setQuantity(amt)}
                  data-testid={`button-quick-${amt}`}
                >{amt}</Button>
              ))}
            </div>

            {selectedCountry && (
              <div className="glass rounded-lg p-3 text-center">
                <span className="text-sm text-muted-foreground">Total: </span>
                <span className="text-xl font-display font-bold text-primary" data-testid="text-total-price">
                  {(quantity * COUNTRY_CONFIG[selectedCountry].price).toLocaleString()} {COUNTRY_CONFIG[selectedCountry].currency}
                </span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder={t.picker.emailPlaceholder} value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)}
                  className="bg-secondary/50 border-white/10 pl-10" data-testid="input-buyer-email" />
              </div>

              <Button
                className="w-full font-bold text-base h-12 bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.98]"
                onClick={handleProceedToInfo} disabled={!buyerEmail.trim() || quantity < 1}
                data-testid="button-proceed-contact"
              >
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {quantity === 1 ? t.picker.buyButton : t.picker.buyButtonPlural.replace("{count}", String(quantity))}
                </span>
              </Button>
            </div>

            {buyMutation.isError && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{buyMutation.error instanceof Error ? buyMutation.error.message : t.picker.errorGeneric}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="country" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 py-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Ticket className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground" data-testid="text-country-title">{t.picker.selectCountry}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{t.picker.selectCountryDesc}</p>
            </div>

            <div className="flex justify-center gap-6">
              {(Object.keys(COUNTRY_CONFIG) as Country[]).map((code) => {
                const country = COUNTRY_CONFIG[code];
                return (
                  <button
                    key={code}
                    onClick={() => { setSelectedCountry(code); setStep("quantity"); }}
                    className="flex flex-col items-center gap-2 group"
                    data-testid={`button-country-${code}`}
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-all flex items-center justify-center text-4xl bg-secondary/30 group-hover:bg-primary/10 group-hover:scale-110 duration-200">
                      {country.flag}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors">{country.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
              <Ticket className="text-primary h-5 w-5" />{t.picker.title}
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
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto bg-card border-primary/20 shadow-2xl shadow-primary/10 p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-2xl flex items-center gap-2" data-testid="text-dialog-title">
            <Ticket className="text-primary h-6 w-6" />{t.picker.title}
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
