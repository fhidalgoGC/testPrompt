import { useState } from "react";
import { useSendOtp, useVerifyOtp } from "@/hooks/use-raffles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useI18n } from "@/lib/i18n";

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OtpStep = "phone" | "code" | "done";

export function VerifyOtpModal({ isOpen, onClose }: VerifyOtpModalProps) {
  const [otpStep, setOtpStep] = useState<OtpStep>("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const { toast } = useToast();
  const { t } = useI18n();
  const isMobile = useIsMobile();

  const handleClose = () => {
    setOtpStep("phone");
    setPhone("");
    setOtpCode("");
    onClose();
  };

  const handleSendCode = async () => {
    if (!phone.trim() || phone.trim().length < 7) {
      toast({ variant: "destructive", title: t.verifyOtp.invalidPhone, description: t.verifyOtp.invalidPhoneDesc });
      return;
    }
    try {
      await sendOtpMutation.mutateAsync({ phone: phone.trim() });
      toast({ title: t.picker.codeSent, description: t.picker.codeSentDesc });
      setOtpStep("code");
    } catch (error) {
      toast({ variant: "destructive", title: t.picker.errorTitle, description: error instanceof Error ? error.message : t.picker.errorGeneric });
    }
  };

  const handleVerify = async () => {
    if (otpCode.length !== 6) return;
    try {
      const result = await verifyOtpMutation.mutateAsync({ phone: phone.trim(), code: otpCode });
      if (result.valid) {
        setOtpStep("done");
        toast({ title: t.verifyOtp.verifiedTitle, description: t.verifyOtp.verifiedDesc });
        setTimeout(() => handleClose(), 2000);
      } else {
        toast({ variant: "destructive", title: t.picker.codeInvalid, description: t.picker.codeInvalidDesc });
      }
    } catch (error) {
      toast({ variant: "destructive", title: t.picker.errorTitle, description: error instanceof Error ? error.message : t.picker.errorGeneric });
    }
  };

  const handleResend = async () => {
    setOtpCode("");
    try {
      await sendOtpMutation.mutateAsync({ phone: phone.trim() });
      toast({ title: t.picker.codeSent, description: t.picker.codeSentDesc });
    } catch (error) {
      toast({ variant: "destructive", title: t.picker.errorTitle, description: error instanceof Error ? error.message : t.picker.errorGeneric });
    }
  };

  const content = (
    <AnimatePresence mode="wait">
      {otpStep === "done" ? (
        <motion.div
          key="done"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-center space-y-4 py-6"
        >
          <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground" data-testid="text-otp-verified">{t.verifyOtp.verifiedTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.verifyOtp.verifiedDesc}</p>
          </div>
        </motion.div>
      ) : otpStep === "code" ? (
        <motion.div
          key="code"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-5 py-2"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-foreground" data-testid="text-otp-enter-title">
                {t.verifyOtp.enterCodeTitle}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-xs mx-auto">
                {t.verifyOtp.enterCodeDesc.replace("{phone}", phone)}
              </p>
            </div>
          </div>

          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t.picker.otpPlaceholder}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="bg-secondary/50 border-white/10 text-center text-2xl font-mono tracking-[0.5em] h-14"
            data-testid="input-otp-code"
          />

          <Button
            className="w-full font-bold h-12 bg-gradient-to-r from-accent to-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 active:scale-[0.98]"
            onClick={handleVerify}
            disabled={otpCode.length !== 6 || verifyOtpMutation.isPending}
            data-testid="button-verify-otp"
          >
            {verifyOtpMutation.isPending ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                {t.picker.verifying}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                {t.picker.verifyCode}
              </span>
            )}
          </Button>

          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={sendOtpMutation.isPending}
              className="text-accent"
              data-testid="button-resend-otp"
            >
              {sendOtpMutation.isPending ? t.picker.sendingCode : t.picker.resendCode}
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="phone"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-4 py-2"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.verifyOtp.phoneDesc}
          </p>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder={t.picker.phonePlaceholder}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
              className="bg-secondary/50 border-white/10 pl-10"
              data-testid="input-verify-phone"
            />
          </div>

          <div className="glass rounded-lg p-3 flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t.verifyOtp.alreadyHaveCode}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 font-bold h-12 bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 active:scale-[0.98]"
              onClick={handleSendCode}
              disabled={sendOtpMutation.isPending || !phone.trim()}
              data-testid="button-send-otp"
            >
              {sendOtpMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {t.picker.sendingCode}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t.picker.sendCode}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              className="border-white/10 h-12 px-4"
              onClick={() => {
                if (!phone.trim() || phone.trim().length < 7) {
                  toast({ variant: "destructive", title: t.verifyOtp.invalidPhone, description: t.verifyOtp.invalidPhoneDesc });
                  return;
                }
                setOtpStep("code");
              }}
              data-testid="button-already-have-code"
            >
              {t.verifyOtp.haveCode}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DrawerContent className="bg-card border-primary/20 max-h-[85dvh]">
          <DrawerHeader className="text-left px-4 pt-2 pb-0">
            <DrawerTitle className="font-display text-lg flex items-center gap-2" data-testid="text-verify-otp-title">
              <ShieldCheck className="text-accent h-5 w-5" />
              {t.verifyOtp.title}
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground text-sm">
              {t.verifyOtp.subtitle}
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
          <DialogTitle className="font-display text-xl flex items-center gap-2" data-testid="text-verify-otp-title">
            <ShieldCheck className="text-accent h-5 w-5" />
            {t.verifyOtp.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t.verifyOtp.subtitle}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
