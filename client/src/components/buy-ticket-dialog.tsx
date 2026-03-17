import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ticket, CheckCircle2, AlertCircle, ChevronLeft, Mail, Sparkles, Phone, CreditCard, ShieldCheck, Minus, Plus, Copy, Check, X, Upload, FileCheck, Loader2, Eye } from "lucide-react";
import seedIconImg from "@/assets/seed-icon-nobg.png";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/lib/i18n";
import { usePurchase } from "@/providers/purchase-provider";
import { BrandHeader } from "@/components/general/brand-header";
import { ContinueButton } from "@/components/general/continue-button";
import pagoMovilLogo from "@/assets/logos/pago-movil.png";
import speiLogo from "@/assets/logos/spei.jpg";
import transferenciaLogo from "@/assets/logos/transferencia.png";
import binanceLogo from "@/assets/logos/binance.png";

const PAYMENT_LOGOS: Record<string, string> = {
  pago_movil: pagoMovilLogo,
  spei: speiLogo,
  transferencia_co: transferenciaLogo,
  binance: binanceLogo,
};

interface BuyTicketDialogProps {
  raffleId: number;
  title: string;
  totalTickets: number;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_TICKETS = 96;

type Step = "payment" | "quantity" | "payment-details" | "info" | "confirm" | "success";

type Country = "VE" | "MX" | "CO";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  details: { label: string; value: string }[];
}

const COUNTRY_CONFIG: Record<Country, { name: string; flag: string; currency: string; price: number; paymentMethods: PaymentMethod[] }> = {
  VE: {
    name: "Venezuela", flag: "🇻🇪", currency: "USD", price: 0.25,
    paymentMethods: [
      {
        id: "pago_movil", name: "Pago Móvil", icon: "📱",
        details: [
          { label: "Cédula", value: "20242594" },
          { label: "Celular", value: "0422-6333703" },
          { label: "Banco", value: "Banco de Venezuela 0102" },
        ],
      },
    ],
  },
  MX: {
    name: "México", flag: "🇲🇽", currency: "MXN", price: 4.5,
    paymentMethods: [
      {
        id: "spei", name: "Transferencia SPEI", icon: "🏦",
        details: [
          { label: "Banco", value: "MercadoPago" },
          { label: "CLABE", value: "722969010417786326" },
        ],
      },
    ],
  },
  CO: {
    name: "Colombia", flag: "🇨🇴", currency: "COP", price: 925,
    paymentMethods: [
      {
        id: "transferencia_co", name: "Bancolombia (Transferencia)", icon: "🏦",
        details: [
          { label: "Banco", value: "Bancolombia" },
          { label: "Cuenta", value: "00981065221" },
          { label: "Tipo", value: "Cta de ahorros" },
          { label: "Titular", value: "Aron Hidalgo" },
        ],
      },
    ],
  },
};

const GLOBAL_PAYMENT_METHODS: (PaymentMethod & { countryName: string; countryFlag: string; currency: string; price: number })[] = [
  {
    id: "binance", name: "Binance Pay", icon: "💰",
    countryName: "Global", countryFlag: "🌎", currency: "USD", price: 0.25,
    details: [
      { label: "Binance ID", value: "91914887" },
    ],
  },
];

const PHONE_COUNTRIES: { code: string; flag: string; dialCode: string; name: string }[] = [
  { code: "VE", flag: "🇻🇪", dialCode: "+58", name: "Venezuela" },
  { code: "CO", flag: "🇨🇴", dialCode: "+57", name: "Colombia" },
  { code: "MX", flag: "🇲🇽", dialCode: "+52", name: "México" },
  { code: "US", flag: "🇺🇸", dialCode: "+1", name: "Estados Unidos" },
  { code: "CA", flag: "🇨🇦", dialCode: "+1", name: "Canadá" },
  { code: "AR", flag: "🇦🇷", dialCode: "+54", name: "Argentina" },
  { code: "BR", flag: "🇧🇷", dialCode: "+55", name: "Brasil" },
  { code: "CL", flag: "🇨🇱", dialCode: "+56", name: "Chile" },
  { code: "EC", flag: "🇪🇨", dialCode: "+593", name: "Ecuador" },
  { code: "PE", flag: "🇵🇪", dialCode: "+51", name: "Perú" },
  { code: "BO", flag: "🇧🇴", dialCode: "+591", name: "Bolivia" },
  { code: "PY", flag: "🇵🇾", dialCode: "+595", name: "Paraguay" },
  { code: "UY", flag: "🇺🇾", dialCode: "+598", name: "Uruguay" },
  { code: "PA", flag: "🇵🇦", dialCode: "+507", name: "Panamá" },
  { code: "CR", flag: "🇨🇷", dialCode: "+506", name: "Costa Rica" },
  { code: "GT", flag: "🇬🇹", dialCode: "+502", name: "Guatemala" },
  { code: "HN", flag: "🇭🇳", dialCode: "+504", name: "Honduras" },
  { code: "SV", flag: "🇸🇻", dialCode: "+503", name: "El Salvador" },
  { code: "NI", flag: "🇳🇮", dialCode: "+505", name: "Nicaragua" },
  { code: "DO", flag: "🇩🇴", dialCode: "+1", name: "Rep. Dominicana" },
  { code: "PR", flag: "🇵🇷", dialCode: "+1", name: "Puerto Rico" },
  { code: "CU", flag: "🇨🇺", dialCode: "+53", name: "Cuba" },
  { code: "TT", flag: "🇹🇹", dialCode: "+1", name: "Trinidad y Tobago" },
  { code: "JM", flag: "🇯🇲", dialCode: "+1", name: "Jamaica" },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function TicketPickerContent({ raffleId, title, totalTickets, onClose }: Omit<BuyTicketDialogProps, "isOpen">) {
  const { country: globalCountry } = useI18n();
  const purchase = usePurchase();
  const [selectedCountry] = useState<Country>((globalCountry === "OTHER" ? "VE" : globalCountry) as Country);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; file: File } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quantity, setQuantity] = useState(4);
  const [phoneCountry, setPhoneCountry] = useState("VE");
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerIdNumber, setBuyerIdNumber] = useState("V-");
  const [step, setStep] = useState<Step>("payment");
  const [assignedNumbers, setAssignedNumbers] = useState<number[]>([]);
  const [transactionId, setTransactionId] = useState("");
  const [referencia, setReferencia] = useState("");
  const { toast } = useToast();
  const { t } = useI18n();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleProceedToInfo = () => {
    if (quantity < 1) return;
    setStep("info");
  };

  const handleCopyValue = (value: string, fieldId: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: "destructive", title: t.picker.uploadError, description: "Max 10MB" });
      return;
    }
    setUploadedFile({ name: file.name, file });
    purchase.setProofFile(file);
    toast({ title: t.picker.uploadSuccess });
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
    setStep("confirm");
  };


  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmBuy = async () => {
    setIsSubmitting(true);

    const allMethods = (Object.keys(COUNTRY_CONFIG) as Country[]).flatMap((countryCode) => {
      const cfg = COUNTRY_CONFIG[countryCode];
      return cfg.paymentMethods.map((method) => ({ ...method, countryCode, countryName: cfg.name, countryFlag: cfg.flag, currency: cfg.currency, price: cfg.price }));
    }).concat(GLOBAL_PAYMENT_METHODS);
    const method = allMethods.find(m => m.id === selectedPaymentMethod);
    const total = method ? String(method.price * quantity) : "0";
    const currency = method?.currency || "";
    const precioUnitario = method ? String(method.price) : "0";
    const dialCode = PHONE_COUNTRIES.find(c => c.code === phoneCountry)?.dialCode || "";
    const fullPhone = `${dialCode} ${buyerPhone}`;

    try {
      const data = await purchase.submitPurchase({
        raffleId,
        raffleTitle: title,
        quantity,
        paymentMethod: selectedPaymentMethod || "",
        paymentCurrency: currency,
        precioUnitario,
        totalAmount: total,
        buyerName,
        buyerPhone: fullPhone,
        buyerEmail,
        buyerIdNumber,
        referencia,
      });
      setTransactionId(data.transactionId);
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
    } catch (err) {
      toast({ variant: "destructive", title: t.picker.errorTitle, description: err instanceof Error ? err.message : t.picker.errorGeneric });
    } finally {
      setIsSubmitting(false);
    }
  };


  const quickAmounts = [4, 8, 12, 20, 32, 48, 96];

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {step === "success" ? (
          <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center space-y-4 py-6">
            <img src={seedIconImg} alt="Semilla" className="h-20 w-20 object-contain" />
            <div>
              <h3 className="text-xl font-bold text-foreground" data-testid="text-success-title">{t.picker.successTitle}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.picker.successDesc}</p>
            </div>
            <div className="bg-amber-100 dark:bg-primary/10 border border-amber-300 dark:border-primary/20 rounded-lg p-4 w-full max-w-sm space-y-3">
              <p className="text-sm text-black dark:text-muted-foreground">{t.picker.transactionLabel}</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-mono font-bold text-primary tracking-widest" data-testid="text-transaction-id">{transactionId}</span>
                <button
                  onClick={() => handleCopyValue(transactionId, "txid")}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors"
                  data-testid="button-copy-transaction"
                >
                  {copiedField === "txid" ? (
                    <Check className="h-4 w-4 text-green-700 dark:text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-xs text-black dark:text-primary/80 font-medium">{t.picker.saveTransactionNote}</p>
            </div>
            <Button variant="outline" className="mt-2 border-border" onClick={handleClose} data-testid="button-close-success">
              {t.picker.closeBtn}
            </Button>
          </motion.div>
        ) : step === "confirm" ? (
          <motion.div key="confirm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5 py-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <img src={seedIconImg} alt="Semilla" className="h-20 w-20 object-contain" />
              <div>
                <h3 className="text-xl font-display font-bold text-foreground" data-testid="text-confirm-title">{t.picker.confirmTitle}</h3>
              </div>
            </div>
            <div className="bg-amber-100 dark:bg-primary/10 border border-amber-300 dark:border-primary/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-black dark:text-foreground font-semibold">{t.picker.ticketCount}</span>
                <span className="text-primary font-display font-bold text-lg" data-testid="text-confirm-count">{quantity}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2 space-y-1 text-xs text-foreground">
                {buyerName.trim() && <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> <span className="font-bold">Nombre:</span> {buyerName}</div>}
                {buyerIdNumber.trim() && <div className="flex items-center gap-2"><CreditCard className="h-3 w-3" /> <span className="font-bold">Cédula:</span> {buyerIdNumber}</div>}
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> <span className="font-bold">Teléfono:</span> {PHONE_COUNTRIES.find(c => c.code === phoneCountry)?.dialCode} {buyerPhone}</div>
                <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> <span className="font-bold">Email:</span> {buyerEmail}</div>
                {referencia.trim() && <div className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> <span className="font-bold">Referencia:</span> {referencia}</div>}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-border" onClick={() => setStep("payment-details")} data-testid="button-back-to-payment-details">
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
              <ContinueButton 
                text={isSubmitting ? t.picker.processing : t.picker.confirmBtn}
                onClick={handleConfirmBuy}
                disabled={isSubmitting}
                loading={isSubmitting}
              />
            </div>
          </motion.div>
        ) : step === "payment" ? (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 py-2">
            <h3 className="text-lg font-display font-bold text-foreground" data-testid="text-payment-title">{t.picker.paymentMethods}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.picker.paymentMethodsDesc}</p>

            <div className="space-y-3">
              {(Object.keys(COUNTRY_CONFIG) as Country[])
                .sort((a, b) => {
                  const preferred = globalCountry === "OTHER" ? null : globalCountry;
                  if (preferred) {
                    if (a === preferred && b !== preferred) return -1;
                    if (b === preferred && a !== preferred) return 1;
                  }
                  return 0;
                })
                .flatMap((countryCode) => {
                  const cfg = COUNTRY_CONFIG[countryCode];
                  return cfg.paymentMethods.map((method) => ({
                    ...method,
                    countryCode,
                    countryName: cfg.name,
                    countryFlag: cfg.flag,
                    currency: cfg.currency,
                    price: cfg.price,
                  }));
                }).concat(GLOBAL_PAYMENT_METHODS).map((method) => (
                <button
                  key={method.id}
                  onClick={() => { setSelectedPaymentMethod(method.id); setUploadedFile(null); purchase.setProofFile(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${selectedPaymentMethod === method.id ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]' : 'border-border hover:bg-muted/50'}`}
                  data-testid={`button-payment-${method.id}`}
                >
                  <img src={PAYMENT_LOGOS[method.id] || ""} alt={method.name} className="w-7 h-7 rounded object-contain" />
                  <div className="flex-1 text-left">
                    <span className="font-medium text-foreground">{method.name}</span>
                    <span className="block text-xs text-muted-foreground">Precio por semilla: {method.currency === "USD" ? "$" : ""}{method.price} {method.currency}</span>
                  </div>
                  {selectedPaymentMethod === method.id ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-border" />
                  )}
                </button>
              ))}
            </div>

            <ContinueButton 
              text={t.picker.continueButton}
              onClick={() => setStep("quantity")}
              disabled={!selectedPaymentMethod}
            />
          </motion.div>
        ) : step === "payment-details" ? (
          <motion.div key="payment-details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 py-2">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" onClick={() => setStep("info")} className="text-muted-foreground -ml-2" data-testid="button-back-to-info">
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
              <h3 className="text-lg font-display font-bold text-foreground">{t.picker.paymentMethods}</h3>
            </div>
            {(() => {
              const allMethods = (Object.keys(COUNTRY_CONFIG) as Country[]).flatMap((countryCode) => {
                const cfg = COUNTRY_CONFIG[countryCode];
                return cfg.paymentMethods.map((method) => ({ ...method, countryCode, countryName: cfg.name, countryFlag: cfg.flag, currency: cfg.currency, price: cfg.price }));
              }).concat(GLOBAL_PAYMENT_METHODS);
              const method = allMethods.find(m => m.id === selectedPaymentMethod);
              if (!method) return null;
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary bg-primary/10">
                    <img src={PAYMENT_LOGOS[method.id] || ""} alt={method.name} className="w-7 h-7 rounded object-contain" />
                    <span className="font-medium text-foreground">{method.name}</span>
                    <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                  </div>

                  <div className="space-y-1">
                    {method.details.map((detail) => (
                      <div key={detail.label} className="flex items-center justify-between gap-2 py-0.5">
                        <span className="text-xs text-muted-foreground">{detail.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-medium text-foreground" data-testid={`text-detail-${method.id}-${detail.label}`}>{detail.value}</span>
                          <button
                            onClick={() => handleCopyValue(detail.value, `${method.id}-${detail.label}`)}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            data-testid={`button-copy-${method.id}-${detail.label}`}
                          >
                            {copiedField === `${method.id}-${detail.label}` ? (
                              <Check className="h-3.5 w-3.5 text-green-700 dark:text-green-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 py-1.5 px-3 rounded-lg bg-amber-100 dark:bg-primary/10 border border-amber-300 dark:border-primary/20">
                    <span className="text-xs font-medium text-black dark:text-primary">Total a pagar</span>
                    <span className="text-sm font-bold text-black dark:text-primary" data-testid={`text-price-${method.id}`}>
                      {method.currency === "USD" ? "$" : ""}{(method.price * quantity).toLocaleString()} {method.currency}
                    </span>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-2 space-y-3">
                    <label className="text-lg font-display font-bold text-foreground block mb-2">Referencia</label>
                    <Input
                      placeholder="Ingresa tu referencia de pago"
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      className="text-sm mb-3"
                      data-testid="input-referencia"
                    />

                    <h4 className="text-lg font-display font-bold text-foreground">{t.picker.uploadProof}</h4>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                        e.target.value = "";
                      }}
                      data-testid="input-file-upload"
                    />

                    {!uploadedFile ? (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-amber-300 dark:border-white/15 hover:border-primary/40 rounded-lg p-4 flex flex-col items-center gap-2 transition-all bg-amber-50/50 dark:bg-transparent hover:bg-primary/5"
                        data-testid="button-upload-area"
                      >
                        <Upload className="h-6 w-6 text-black dark:text-muted-foreground" />
                        <span className="text-xs text-black dark:text-muted-foreground">{t.picker.uploadDragDrop}</span>
                        <span className="text-[10px] text-black/60 dark:text-muted-foreground/60">{t.picker.uploadFormats}</span>
                      </button>
                    ) : (
                      <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-green-700 dark:text-green-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate" data-testid="text-uploaded-filename">{uploadedFile.name}</p>
                          <p className="text-[10px] text-green-700 dark:text-green-400">{t.picker.uploadSuccess}</p>
                        </div>
                        <button
                          onClick={() => { setUploadedFile(null); purchase.setProofFile(null); fileInputRef.current?.click(); }}
                          className="text-[10px] text-muted-foreground hover:text-foreground underline shrink-0"
                          data-testid="button-change-file"
                        >
                          {t.picker.changeFile}
                        </button>
                      </div>
                    )}

                    <ContinueButton 
                      text={t.picker.continueAfterPayment}
                      onClick={() => setStep("confirm")}
                      disabled={!uploadedFile}
                    />
                  </div>
                </div>
              );
            })()}
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

            <div className="space-y-3">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <Input
                  placeholder="Nombre completo"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="bg-secondary/50 border-border pl-10"
                  data-testid="input-buyer-name"
                />
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
                  onChange={(e) => {
                    let val = e.target.value;
                    if (!val.startsWith("V-")) val = "V-";
                    const digits = val.slice(2).replace(/\D/g, "").slice(0, 8);
                    setBuyerIdNumber("V-" + digits);
                  }}
                  maxLength={10}
                  className="bg-secondary/50 border-border pl-10"
                  data-testid="input-buyer-id"
                />
              </div>
              <div className="relative flex items-stretch rounded-md border border-border bg-secondary/50 overflow-visible">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                    className="h-full px-3 flex items-center gap-1.5 hover:bg-muted/50 transition-colors shrink-0 border-r border-border"
                    data-testid="button-phone-country"
                  >
                    <span className="text-base">{PHONE_COUNTRIES.find(c => c.code === phoneCountry)?.flag}</span>
                    <span className="text-xs text-muted-foreground font-mono">{PHONE_COUNTRIES.find(c => c.code === phoneCountry)?.dialCode}</span>
                    <ChevronLeft className="h-3 w-3 text-muted-foreground -rotate-90" />
                  </button>
                  {phoneDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-white/10 rounded-lg shadow-xl overflow-y-auto max-h-[200px] min-w-[200px]">
                      {PHONE_COUNTRIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setPhoneCountry(c.code); setPhoneDropdownOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-white/10 transition-colors ${phoneCountry === c.code ? "text-primary font-bold bg-primary/5" : "text-foreground"}`}
                          data-testid={`button-phone-country-${c.code}`}
                        >
                          <span className="text-base">{c.flag}</span>
                          <span>{c.name}</span>
                          <span className="text-muted-foreground font-mono text-xs ml-auto">{c.dialCode}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <input type="tel" inputMode="numeric" maxLength={12} placeholder={t.picker.phonePlaceholder} value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value.replace(/\D/g, "").slice(0, 12))} className="flex-1 bg-transparent h-10 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none" data-testid="input-buyer-phone" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={t.picker.emailPlaceholder}
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="bg-secondary/50 border-border pl-10"
                  data-testid="input-buyer-email"
                />
              </div>
            </div>

            <ContinueButton 
              text={t.picker.continueButton}
              onClick={() => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(buyerEmail.trim())) {
                  toast({ variant: "destructive", title: t.picker.invalidEmail, description: t.picker.invalidEmailDesc });
                  return;
                }
                setStep("payment-details");
              }}
              disabled={!buyerName.trim() || !/^V-\d{5,8}$/.test(buyerIdNumber) || buyerPhone.length < 7 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail.trim())}
              iconPosition="left"
            />
          </motion.div>
        ) : step === "quantity" ? (
          <motion.div key="quantity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Button variant="ghost" size="sm" onClick={() => setStep("payment")} className="text-muted-foreground -ml-2" data-testid="button-back-to-payment">
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
              <h3 className="text-lg font-display font-bold text-foreground">{t.picker.quantityTitle || "Cantidad de semillas"}</h3>
            </div>
            <div className="flex items-center gap-2" data-testid="dialog-viewers-counter">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-600/10 dark:bg-green-500/10 border border-green-600/30 dark:border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 dark:bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600 dark:bg-green-500"></span>
                </span>
                <Eye className="w-3.5 h-3.5 text-green-700 dark:text-green-400" />
                <span className="text-xs font-bold text-green-700 dark:text-green-400">{Math.floor(Math.random() * 80) + 40}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Personas estan comprando sus semillas
              </span>
            </div>


            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline" size="icon"
                className="h-12 w-12 rounded-full border-border text-foreground"
                onClick={() => setQuantity(q => Math.max(4, q - 4))}
                disabled={quantity <= 4}
                data-testid="button-decrease-qty"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="w-24 text-center">
                <span className="block bg-secondary/50 border border-border rounded-md text-center text-3xl font-display font-bold h-14 leading-[3.5rem]" data-testid="text-quantity">{quantity}</span>
              </div>
              <Button
                variant="outline" size="icon"
                className="h-12 w-12 rounded-full border-border text-foreground"
                onClick={() => setQuantity(q => Math.min(MAX_TICKETS, q + 4))}
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
                  className={`min-w-[3rem] ${quantity === amt ? "" : "border-border text-muted-foreground"}`}
                  onClick={() => setQuantity(amt)}
                  data-testid={`button-quick-${amt}`}
                >{amt}</Button>
              ))}
            </div>


            {(() => {
              const allMethods = (Object.keys(COUNTRY_CONFIG) as Country[]).flatMap((countryCode) => {
                const cfg = COUNTRY_CONFIG[countryCode];
                return cfg.paymentMethods.map((method) => ({ ...method, countryCode, countryName: cfg.name, countryFlag: cfg.flag, currency: cfg.currency, price: cfg.price }));
              }).concat(GLOBAL_PAYMENT_METHODS);
              const method = allMethods.find(m => m.id === selectedPaymentMethod);
              if (!method) return null;
              return (
                <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-amber-100 dark:bg-primary/10 border border-amber-300 dark:border-primary/20">
                  <span className="text-sm font-medium text-black dark:text-primary">Total a pagar</span>
                  <span className="text-lg font-bold text-black dark:text-primary" data-testid="text-quantity-total">
                    {method.currency === "USD" ? "$" : ""}{(method.price * quantity).toLocaleString()} {method.currency}
                  </span>
                </div>
              );
            })()}

            <div className="pt-1">
              <ContinueButton 
                text={quantity === 1 ? t.picker.buyButton : t.picker.buyButtonPlural.replace("{count}", String(quantity))}
                onClick={handleProceedToInfo}
                disabled={quantity < 1}
              />
            </div>

          </motion.div>
        ) : null}
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
        <DialogHeader className="px-6 pt-3 pb-0">
          <div data-testid="text-dialog-title">
            <BrandHeader size="small" />
            <DialogTitle className="sr-only">GANACONMARE</DialogTitle>
            <DialogDescription className="sr-only">@maredorazio</DialogDescription>
          </div>
        </DialogHeader>
        <div className="px-6 pb-6 pt-1 min-h-[60vh]">
          {isOpen && <TicketPickerContent raffleId={raffleId} title={title} totalTickets={totalTickets} onClose={onClose} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
