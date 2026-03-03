import { useState } from "react";
import { useRaffles } from "@/hooks/use-raffles";
import { RaffleCard } from "@/components/raffle-card";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Info, Search, Sparkles, Globe, Menu, X, LogIn, FileText, Trophy, HelpCircle, Zap, ShieldCheck, Sprout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useI18n, COUNTRY_FLAGS, COUNTRY_NAMES, type AppCountry } from "@/lib/i18n";
import { Link } from "wouter";

export default function Home() {
  const { data: raffles, isLoading } = useRaffles();
  const { t, locale, setLocale, country, setCountry } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(() => {
    return !localStorage.getItem("country_selected");
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-2 border-accent rounded-full animate-[spin_1.5s_linear_reverse_infinite]"></div>
            <div className="absolute inset-4 border-b-2 border-white/20 rounded-full animate-[spin_2s_linear_infinite]"></div>
            <Flame className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary w-8 h-8 animate-pulse text-glow" />
          </div>
        </div>
      </div>
    );
  }

  const featuredRaffle = raffles?.[0];
  const gridRaffles = raffles?.slice(1) || [];

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground selection:bg-primary/30 selection:text-white">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-primary to-yellow-600 rounded-sm flex items-center justify-center transform rotate-45">
              <span className="font-display font-black text-black -rotate-45 text-base sm:text-lg">G</span>
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-wider uppercase text-glow">
              G<span className="text-primary">Mare</span>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
              <a href="#" className="text-white hover:text-primary transition-colors" data-testid="link-campaigns">{t.nav.campaigns}</a>
              <a href="#" className="hover:text-white transition-colors" data-testid="link-winners">{t.nav.winners}</a>
              <a href="#" className="hover:text-white transition-colors" data-testid="link-how">{t.nav.howItWorks}</a>
              <Link href="/terms">
                <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-terms">{t.nav.terms}</span>
              </Link>
              <Link href="/redeem">
                <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5" data-testid="link-redeem">
                  <Sprout className="h-3.5 w-3.5 text-primary" />
                  {t.nav.redeemSeeds}
                </span>
              </Link>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-9 w-9 rounded-full border border-white/10 bg-secondary/50 hover:bg-white/10 flex items-center justify-center transition-colors shrink-0"
                  data-testid="button-lang-switch"
                >
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px] bg-card border-white/10">
                <DropdownMenuItem
                  onClick={() => setLocale("es")}
                  className={`gap-2 text-sm cursor-pointer ${locale === "es" ? "text-primary font-bold" : ""}`}
                  data-testid="button-lang-es"
                >
                  <span className="text-base">🇪🇸</span> Español
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocale("en")}
                  className={`gap-2 text-sm cursor-pointer ${locale === "en" ? "text-primary font-bold" : ""}`}
                  data-testid="button-lang-en"
                >
                  <span className="text-base">🇺🇸</span> English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-9 w-9 rounded-full border border-white/10 bg-secondary/50 hover:bg-white/10 flex items-center justify-center text-lg transition-colors shrink-0"
                  data-testid="button-country-switch"
                >
                  {COUNTRY_FLAGS[country]}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px] bg-card border-white/10">
                {(Object.keys(COUNTRY_FLAGS) as AppCountry[]).map((code) => (
                  <DropdownMenuItem
                    key={code}
                    onClick={() => setCountry(code)}
                    className={`gap-2 text-sm cursor-pointer ${country === code ? "text-primary font-bold" : ""}`}
                    data-testid={`button-country-${code}`}
                  >
                    <span className="text-base">{COUNTRY_FLAGS[code]}</span> {COUNTRY_NAMES[code]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex border-primary/30 text-primary hover:bg-primary/10 gap-1.5"
              data-testid="button-login-desktop"
            >
              <LogIn className="h-3.5 w-3.5" />
              {t.nav.login}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setMenuOpen(!menuOpen)}
              data-testid="button-menu-toggle"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[57px] left-0 right-0 z-40 glass border-b border-white/5 md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-white hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-link-campaigns"
              >
                <Zap className="h-4 w-4 text-primary" />
                {t.nav.campaigns}
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-link-winners"
              >
                <Trophy className="h-4 w-4 text-primary/70" />
                {t.nav.winners}
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-link-how"
              >
                <HelpCircle className="h-4 w-4 text-primary/70" />
                {t.nav.howItWorks}
              </a>
              <Link href="/terms">
                <span
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                  data-testid="mobile-link-terms"
                >
                  <FileText className="h-4 w-4 text-primary/70" />
                  {t.nav.terms}
                </span>
              </Link>
              <Link href="/redeem">
                <span
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-primary hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                  data-testid="mobile-link-redeem"
                >
                  <Sprout className="h-4 w-4" />
                  {t.nav.redeemSeeds}
                </span>
              </Link>
              <div className="border-t border-white/5 pt-2 mt-2">
                <button
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold text-primary hover:bg-primary/10 transition-colors w-full"
                  onClick={() => setMenuOpen(false)}
                  data-testid="mobile-link-login"
                >
                  <LogIn className="h-4 w-4" />
                  {t.nav.login}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="pt-24 sm:pt-32 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-40 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16 space-y-4 sm:space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3 h-3" />
            <span>{t.hero.badge}</span>
          </motion.div>
          
          <motion.h1 
            className="text-3xl sm:text-5xl md:text-7xl font-black font-display tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.hero.title1} <span style={{fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif', fontSize: '0.85em'}}>{t.hero.titleHighlight}</span>{" "}
            <span style={{fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif', fontSize: '0.85em'}}>{t.hero.titleEmoji}</span>{" "}
            {t.hero.title2}
          </motion.h1>
          
          <motion.p 
            className="text-sm sm:text-lg text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t.hero.subtitle}
          </motion.p>
        </div>

        {featuredRaffle && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <Flame className="text-primary w-5 h-5" /> 
                {t.raffle.priorityCampaign}
              </h2>
            </div>
            <RaffleCard raffle={featuredRaffle} featured={true} badgeLabel={t.raffle.badgeLabels[0]} />
          </motion.div>
        )}
      </section>

      {gridRaffles.length > 0 && (
        <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wider">
              {t.raffle.activeAllocations}
            </h2>
            
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={t.raffle.searchAssets}
                className="pl-10 bg-secondary/50 border-white/10 focus-visible:border-primary/50 focus-visible:ring-primary/20 h-10"
                data-testid="input-search-vehicles"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {gridRaffles.map((raffle, index) => (
              <motion.div
                key={raffle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <RaffleCard raffle={raffle} badgeLabel={t.raffle.badgeLabels[(index + 1) % t.raffle.badgeLabels.length]} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 sm:mt-16 px-4 max-w-4xl mx-auto text-center border-t border-white/5 pt-8 sm:pt-16">
        <h3 className="font-display text-xl font-bold mb-8">{t.footer.title}</h3>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
          {(!country || country === "VE" ? [
            { name: "Loteria del Tachira", emoji: "🎰" },
            { name: "Kino Tachira", emoji: "🎲" },
            { name: "Loteria del Zulia", emoji: "🎯" },
          ] : []).concat(
            !country || country === "MX" ? [
              { name: "Loteria Nacional", emoji: "🏛️" },
              { name: "Melate", emoji: "💰" },
              { name: "Pronosticos", emoji: "⚽" },
            ] : []
          ).concat(
            !country || country === "CO" ? [
              { name: "Loteria de Bogota", emoji: "🎪" },
              { name: "Baloto", emoji: "🌟" },
              { name: "Loteria de Medellin", emoji: "🎭" },
            ] : []
          ).map((lottery) => (
            <div key={lottery.name} className="flex flex-col items-center gap-2 group" data-testid={`lottery-${lottery.name}`}>
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                {lottery.emoji}
              </div>
              <span className="text-xs text-muted-foreground max-w-[80px] leading-tight">{lottery.name}</span>
            </div>
          ))}
        </div>
      </section>

      <Dialog open={showCountryPicker} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-[400px] bg-card border-primary/20 shadow-2xl shadow-primary/10"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          hideClose
        >
          <DialogHeader className="text-center">
            <DialogTitle className="font-display text-2xl" data-testid="text-country-picker-title">
              {t.picker.selectCountry}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm" data-testid="text-country-picker-desc">
              {t.picker.selectCountryDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-8 py-6">
            {(Object.keys(COUNTRY_FLAGS) as AppCountry[]).map((code) => (
              <button
                key={code}
                onClick={() => {
                  setCountry(code);
                  localStorage.setItem("country_selected", "true");
                  setShowCountryPicker(false);
                }}
                className="flex flex-col items-center gap-3 group"
                data-testid={`button-initial-country-${code}`}
              >
                <div className="w-20 h-20 rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-all flex items-center justify-center text-5xl bg-secondary/30 group-hover:bg-primary/10 group-hover:scale-110 duration-200">
                  {COUNTRY_FLAGS[code]}
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">{COUNTRY_NAMES[code]}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
