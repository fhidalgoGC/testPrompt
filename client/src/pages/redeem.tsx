import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import seedIconImg from "@assets/d3777354-d33b-4874-a37a-5c7585262666_1773507161470.JPG";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function Redeem() {
  const { t } = useI18n();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ credits: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !email.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await apiRequest("POST", "/api/coupons/redeem", { code: code.trim(), email: email.trim() });
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      try {
        const body = err?.message || "";
        if (body.includes("INVALID_CODE")) {
          setError("INVALID_CODE");
        } else if (body.includes("ALREADY_USED")) {
          setError("ALREADY_USED");
        } else {
          setError("GENERIC");
        }
      } catch {
        setError("GENERIC");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link href="/">
            <span className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors cursor-pointer" data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4" />
              {t.coupon.backHome}
            </span>
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <div className="h-7 w-7 bg-gradient-to-br from-primary to-yellow-600 rounded-sm flex items-center justify-center transform rotate-45">
              <span className="font-display font-black text-black -rotate-45 text-base">G</span>
            </div>
            <span className="font-display font-bold text-lg tracking-wider uppercase text-glow">
              G<span className="text-primary">Mare</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <img src={seedIconImg} alt="Semilla" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground mb-2" data-testid="text-redeem-title">
            {t.coupon.title}
          </h1>
          <p className="text-muted-foreground" data-testid="text-redeem-subtitle">
            {t.coupon.subtitle}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card border border-green-500/20 rounded-2xl p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-2" data-testid="text-success-title">
                {t.coupon.successTitle}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-4xl font-display font-black text-primary" data-testid="text-credits-amount">
                  +{result.credits}
                </span>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6" data-testid="text-success-desc">
                {t.coupon.successDesc.replace("{credits}", String(result.credits))}
              </p>
              <Link href="/">
                <Button className="w-full bg-white text-black hover:bg-primary" data-testid="button-back-home">
                  {t.coupon.backHome}
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="bg-card border border-white/5 rounded-2xl p-6 space-y-4"
            >
              <div>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder={t.coupon.codePlaceholder}
                  className="bg-background/50 border-white/10 text-center text-lg font-mono tracking-widest uppercase h-14"
                  data-testid="input-coupon-code"
                />
              </div>
              <div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.coupon.emailPlaceholder}
                  className="bg-background/50 border-white/10"
                  data-testid="input-coupon-email"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-400" data-testid="text-error-title">
                        {error === "INVALID_CODE" ? t.coupon.errorInvalid : error === "ALREADY_USED" ? t.coupon.errorUsed : t.coupon.errorGeneric}
                      </p>
                      <p className="text-xs text-red-400/70" data-testid="text-error-desc">
                        {error === "INVALID_CODE" ? t.coupon.errorInvalidDesc : error === "ALREADY_USED" ? t.coupon.errorUsedDesc : t.coupon.errorGeneric}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-primary font-bold h-12"
                disabled={isLoading || !code.trim() || !email.trim()}
                data-testid="button-apply-coupon"
              >
                {isLoading ? t.coupon.applying : t.coupon.applyBtn}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
