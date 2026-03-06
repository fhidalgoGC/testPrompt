import { useState } from "react";
import { useRaffles } from "@/hooks/use-raffles";
import { RaffleCard } from "@/components/raffle-card";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Info, Search, Sparkles, Globe, Menu, X, LogIn, FileText, Trophy, HelpCircle, Zap, ShieldCheck, Sprout, MessageCircle, User } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { Link } from "wouter";

export default function Home() {
  const { data: raffles, isLoading } = useRaffles();
  const { t, locale, setLocale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground selection:bg-primary/30 selection:text-white">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
              <img src="/logos/mare-woman.jpg" alt="Gana Con Mare" className="h-full w-full object-cover" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-base sm:text-lg tracking-wide text-primary block">Gana Con Mare</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">@ganarconmare</span>
            </div>
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
            <div
              className="h-9 w-9 rounded-full border border-white/10 bg-secondary/50 flex items-center justify-center text-lg shrink-0"
              data-testid="flag-venezuela"
            >
              🇻🇪
            </div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="pt-24 sm:pt-32 pb-8 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-40 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16 space-y-4 sm:space-y-6 relative z-10">
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-5xl font-black font-display tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t.hero.title1}{" "}
            <span className="whitespace-nowrap"><span className="text-yellow-400" style={{textShadow: '0 0 20px rgba(250,204,21,0.4)'}}>{t.hero.titleHighlight}</span><span className="text-yellow-400" style={{fontSize: '0.6em', verticalAlign: 'middle'}}> {t.hero.titleEmoji}</span></span>{", "}
            <span className="whitespace-nowrap"><span className="text-green-400" style={{textShadow: '0 0 20px rgba(74,222,128,0.4)'}}>{t.hero.title2}</span><span className="text-green-400" style={{fontSize: '0.6em', verticalAlign: 'middle'}}> {t.hero.title2Emoji}</span></span>{" "}
            {t.hero.title2End}
          </motion.h1>
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


      <section className="mt-4 sm:mt-8 px-4 max-w-4xl mx-auto text-center border-t border-white/5 pt-4 sm:pt-8">
        <h3 className="font-display text-xl font-bold mb-8">{t.footer.title}</h3>
        <div className="flex justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center group" data-testid="lottery-CONALOT">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-full">
              <img src="/logos/conalot.jpg" alt="CONALOT" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-muted-foreground mt-2">CONALOT</span>
          </div>
          <div className="flex flex-col items-center group" data-testid="lottery-Super Gana">
            <div className="w-24 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
              <img src="/logos/supergana.png" alt="Super Gana" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs text-muted-foreground mt-2">Super Gana</span>
          </div>
          <div className="flex flex-col items-center group" data-testid="lottery-Loteria del Tachira">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-full">
              <img src="/logos/tachira.jpg" alt="Loteria del Tachira" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-muted-foreground mt-2">Loteria del Tachira</span>
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 mb-2"
            >
              <a
                href="https://wa.me/584226333703"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full pl-4 pr-5 py-3 shadow-lg transition-all hover:scale-105"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="h-5 w-5" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
              <a
                href="https://t.me/+584226333703"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-full pl-4 pr-5 py-3 shadow-lg transition-all hover:scale-105"
                data-testid="link-telegram"
              >
                <SiTelegram className="h-5 w-5" />
                <span className="text-sm font-medium">Telegram</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="h-20 w-20 rounded-full bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 p-2"
          data-testid="button-chat-fab"
        >
          {chatOpen ? <div className="h-full w-full rounded-full bg-black flex items-center justify-center p-3.5"><img src="/logos/chat-bubbles.png" alt="Chat" className="h-full w-full object-contain invert" /></div> : <div className="h-full w-full rounded-full bg-black flex items-center justify-center p-1.5"><img src="/logos/call-center.webp" alt="Soporte" className="h-full w-full rounded-full object-contain invert" /></div>}
        </button>
      </div>

    </div>
  );
}
