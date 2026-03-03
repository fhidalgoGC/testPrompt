import { useState, useEffect, useRef, useCallback } from "react";
import { useBuyTickets, useSendOtp, useVerifyOtp } from "@/hooks/use-raffles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, Zap, CheckCircle2, AlertCircle, ChevronLeft, Mail, Sparkles, Phone, CreditCard, ShieldCheck, Timer, Minus, Plus, Clock, Copy, Check, X, Upload, FileCheck, Loader2 } from "lucide-react";
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

type Step = "country" | "quantity" | "payment" | "info" | "confirm" | "success";

type Country = "VE" | "MX" | "CO";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  details: { label: string; value: string }[];
}

const COUNTRY_CONFIG: Record<Country, { name: string; flag: string; currency: string; price: number; paymentMethods: PaymentMethod[] }> = {
  VE: {
    name: "Venezuela", flag: "🇻🇪", currency: "USD", price: 1,
    paymentMethods: [
      {
        id: "pago_movil", name: "Pago Movil", icon: "📱",
        details: [
          { label: "Telefono", value: "0412-1234567" },
          { label: "Cedula", value: "V-12345678" },
          { label: "Banco", value: "Banesco" },
        ],
      },
      {
        id: "transferencia_ve", name: "Transferencia", icon: "🏦",
        details: [
          { label: "Banco", value: "Banesco" },
          { label: "Cuenta", value: "0134-0001-23-4567890123" },
          { label: "Titular", value: "ApexDraw C.A." },
          { label: "RIF", value: "J-12345678-9" },
        ],
      },
    ],
  },
  MX: {
    name: "México", flag: "🇲🇽", currency: "MXN", price: 18,
    paymentMethods: [
      {
        id: "spei", name: "Transferencia SPEI", icon: "🏦",
        details: [
          { label: "Banco", value: "BBVA México" },
          { label: "CLABE", value: "012345678901234567" },
          { label: "Titular", value: "ApexDraw S.A. de C.V." },
          { label: "Concepto", value: "Semillas ApexDraw" },
        ],
      },
      {
        id: "oxxo", name: "OXXO Pay", icon: "🏪",
        details: [
          { label: "Referencia", value: "1234-5678-9012-3456" },
          { label: "Monto exacto", value: "Segun tu compra" },
          { label: "Vigencia", value: "1 hora" },
        ],
      },
    ],
  },
  CO: {
    name: "Colombia", flag: "🇨🇴", currency: "COP", price: 4200,
    paymentMethods: [
      {
        id: "nequi", name: "Nequi", icon: "💜",
        details: [
          { label: "Numero Nequi", value: "300-1234567" },
          { label: "Titular", value: "ApexDraw SAS" },
        ],
      },
      {
        id: "daviplata", name: "Daviplata", icon: "🔴",
        details: [
          { label: "Numero Daviplata", value: "310-7654321" },
          { label: "Titular", value: "ApexDraw SAS" },
        ],
      },
      {
        id: "transferencia_co", name: "Transferencia", icon: "🏦",
        details: [
          { label: "Banco", value: "Bancolombia" },
          { label: "Cuenta Ahorros", value: "123-456789-01" },
          { label: "Titular", value: "ApexDraw SAS" },
          { label: "NIT", value: "901.234.567-8" },
        ],
      },
    ],
  },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TicketPickerContent({ raffleId, title, totalTickets, onClose }: Omit<BuyTicketDialogProps, "isOpen">) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; filename: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerIdNumber, setBuyerIdNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<Step>("country");
  const [timeLeft, setTimeLeft] = useState(OTP_TIMEOUT_SECONDS);
  const [assignedNumbers, setAssignedNumbers] = useState<number[]>([]);
  const [transactionId, setTransactionId] = useState("");
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

  const handleProceedToPayment = () => {
    if (quantity < 1 || !buyerEmail.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail.trim())) {
      toast({ variant: "destructive", title: t.picker.invalidEmail, description: t.picker.invalidEmailDesc });
      return;
    }
    setSelectedPaymentMethod(null);
    setStep("payment");
  };

  const handleCopyValue = (value: string, fieldId: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: "destructive", title: t.picker.uploadError, description: "Max 10MB" });
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("comprobante", file);
      const res = await fetch("/api/upload-comprobante", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Upload failed");
      }
      const data = await res.json();
      setUploadedFile({ name: file.name, filename: data.filename });
      toast({ title: t.picker.uploadSuccess });
    } catch (err) {
      toast({ variant: "destructive", title: t.picker.uploadError, description: err instanceof Error ? err.message : "" });
    } finally {
      setIsUploading(false);
    }
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
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let txId = "";
      for (let i = 0; i < 8; i++) txId += chars[Math.floor(Math.random() * chars.length)];
      setTransactionId(txId);
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
            <div className="glass-gold rounded-lg p-4 w-full max-w-sm space-y-3">
              <p className="text-sm text-muted-foreground">{t.picker.transactionLabel}</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-mono font-bold text-primary tracking-widest" data-testid="text-transaction-id">{transactionId}</span>
                <button
                  onClick={() => handleCopyValue(transactionId, "txid")}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors"
                  data-testid="button-copy-transaction"
                >
                  {copiedField === "txid" ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-xs text-primary/80 font-medium">{t.picker.saveTransactionNote}</p>
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
        ) : step === "payment" ? (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 py-2">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" onClick={() => setStep("quantity")} className="text-muted-foreground -ml-2" data-testid="button-back-to-quantity">
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
              <h3 className="text-lg font-display font-bold text-foreground" data-testid="text-payment-title">{t.picker.paymentMethods}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.picker.paymentMethodsDesc}</p>

            {selectedCountry && (
              <div className="glass-gold rounded-lg p-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.picker.totalToPay}</span>
                <span className="text-xl font-display font-bold text-primary" data-testid="text-payment-total">
                  {(quantity * COUNTRY_CONFIG[selectedCountry].price).toLocaleString()} {COUNTRY_CONFIG[selectedCountry].currency}
                </span>
              </div>
            )}

            {selectedCountry && (
              <div className="space-y-3">
                {COUNTRY_CONFIG[selectedCountry].paymentMethods.map((method) => (
                  <div key={method.id} className={`rounded-xl border-2 overflow-hidden transition-all duration-200 ${selectedPaymentMethod === method.id ? 'border-primary shadow-[0_0_12px_rgba(245,158,11,0.15)]' : 'border-white/10'}`}>
                    <button
                      onClick={() => { setSelectedPaymentMethod(selectedPaymentMethod === method.id ? null : method.id); setUploadedFile(null); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${selectedPaymentMethod === method.id ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                      data-testid={`button-payment-${method.id}`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-medium text-foreground flex-1 text-left">{method.name}</span>
                      <ChevronLeft className={`h-4 w-4 text-muted-foreground transition-transform ${selectedPaymentMethod === method.id ? '-rotate-90' : 'rotate-180'}`} />
                    </button>
                    <AnimatePresence>
                      {selectedPaymentMethod === method.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1 space-y-2 border-t border-white/5">
                            {method.details.map((detail) => (
                              <div key={detail.label} className="flex items-center justify-between gap-2 py-1.5">
                                <span className="text-xs text-muted-foreground">{detail.label}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-mono font-medium text-foreground" data-testid={`text-detail-${method.id}-${detail.label}`}>{detail.value}</span>
                                  <button
                                    onClick={() => handleCopyValue(detail.value, `${method.id}-${detail.label}`)}
                                    className="p-1 rounded hover:bg-white/10 transition-colors"
                                    data-testid={`button-copy-${method.id}-${detail.label}`}
                                  >
                                    {copiedField === `${method.id}-${detail.label}` ? (
                                      <Check className="h-3.5 w-3.5 text-green-400" />
                                    ) : (
                                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}

            {selectedPaymentMethod && (
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 pt-1 overflow-hidden"
                >
                  <p className="text-sm font-medium text-foreground">{t.picker.uploadProof}</p>
                  <p className="text-xs text-muted-foreground">{t.picker.uploadProofDesc}</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                      e.target.value = "";
                    }}
                    data-testid="input-file-upload"
                  />

                  {!uploadedFile ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full border-2 border-dashed border-white/15 hover:border-primary/40 rounded-xl p-6 flex flex-col items-center gap-3 transition-all hover:bg-primary/5 disabled:opacity-50"
                      data-testid="button-upload-area"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-8 w-8 text-primary animate-spin" />
                          <span className="text-sm text-muted-foreground">{t.picker.uploading}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{t.picker.uploadDragDrop}</span>
                          <span className="text-xs text-muted-foreground/60">{t.picker.uploadFormats}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 flex items-center gap-3">
                      <FileCheck className="h-6 w-6 text-green-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate" data-testid="text-uploaded-filename">{uploadedFile.name}</p>
                        <p className="text-xs text-green-400">{t.picker.uploadSuccess}</p>
                      </div>
                      <button
                        onClick={() => { setUploadedFile(null); fileInputRef.current?.click(); }}
                        className="text-xs text-muted-foreground hover:text-foreground underline shrink-0"
                        data-testid="button-change-file"
                      >
                        {t.picker.changeFile}
                      </button>
                    </div>
                  )}

                  <Button
                    className="w-full font-bold h-12 bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-40"
                    onClick={() => setStep("info")}
                    disabled={!uploadedFile}
                    data-testid="button-payment-done"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      {t.picker.continueAfterPayment}
                    </span>
                  </Button>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        ) : step === "info" ? (
          <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 py-2">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" onClick={() => setStep("payment")} className="text-muted-foreground -ml-2" data-testid="button-back-to-payment">
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
              <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="text-primary h-5 w-5" />
                {t.picker.contactModalTitle}
              </h3>
            </div>

            <div className="glass-gold rounded-lg p-3 flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">{t.picker.verifyInfoDesc}</p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="tel" placeholder={t.picker.phonePlaceholder} value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className="bg-secondary/50 border-white/10 pl-10" data-testid="input-buyer-phone" />
              </div>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={
                    selectedCountry === "VE" ? t.picker.idPlaceholderVE :
                    selectedCountry === "MX" ? t.picker.idPlaceholderMX :
                    selectedCountry === "CO" ? t.picker.idPlaceholderCO :
                    t.picker.idPlaceholder
                  }
                  value={buyerIdNumber}
                  onChange={(e) => setBuyerIdNumber(e.target.value)}
                  className="bg-secondary/50 border-white/10 pl-10"
                  data-testid="input-buyer-id"
                />
              </div>
            </div>

            <Button
              className="w-full font-bold h-12 bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.98]"
              onClick={() => setStep("confirm")}
              disabled={!buyerPhone.trim() || !buyerIdNumber.trim()}
              data-testid="button-continue-to-confirm"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                {t.picker.continueButton}
              </span>
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
                onClick={handleProceedToPayment} disabled={!buyerEmail.trim() || quantity < 1}
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
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto bg-card border-primary/20 shadow-2xl shadow-primary/10 p-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        hideClose
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-50 rounded-sm p-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
          data-testid="button-close-dialog"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
        <DialogHeader className="px-6 pt-4 pb-0">
          <DialogTitle className="font-display text-xl flex items-center gap-2" data-testid="text-dialog-title">
            <Ticket className="text-primary h-5 w-5" />{t.picker.title}
          </DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6 pt-2 min-h-[60vh]">
          {isOpen && <TicketPickerContent raffleId={raffleId} title={title} totalTickets={totalTickets} onClose={onClose} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
