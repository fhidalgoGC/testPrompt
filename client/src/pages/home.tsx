import { useState } from "react";
import { RaffleCard } from "@/components/raffle-card";
import { BrandHeader } from "@/components/brand-header";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Info, Search, Sparkles, Globe, Menu, X, LogIn, FileText, Trophy, HelpCircle, Zap, ShieldCheck, MessageCircle, User, Mail, Sun, Moon } from "lucide-react";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme-context";
import { Link } from "wouter";

const staticRaffles = [
  {
    id: 1,
    title: "Mare Te Premia #1",
    description: "",
    imageUrls: [
      "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2000&auto=format&fit=crop",
    ],
    totalTickets: 9999,
    soldTickets: 437,
  },
  {
    id: 2,
    title: "GANA CON MARE#2",
    description: "",
    imageUrls: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2000&auto=format&fit=crop",
    ],
    totalTickets: 9999,
    soldTickets: 898,
  },
];

export default function Home() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const featuredRaffle = staticRaffles[0];

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground selection:bg-primary/30 selection:text-white">
      <nav className="fixed top-0 w-full z-50 glass border-b border-border px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="shrink-0">
            <BrandHeader />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70 dark:text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors" data-testid="link-winners">{t.nav.winners}</a>
              <a href="#" className="hover:text-foreground transition-colors" data-testid="link-how">{t.nav.howItWorks}</a>
              <Link href="/terms">
                <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-terms">{t.nav.terms}</span>
              </Link>
              <a href="#contacto" className="hover:text-foreground transition-colors" data-testid="link-contact">Contáctanos</a>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-9 w-9 rounded-full border border-border bg-secondary/50 hover:bg-muted flex items-center justify-center transition-colors shrink-0"
                  data-testid="button-lang-switch"
                >
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px] bg-card border-border">
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
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full border border-border bg-secondary/50 hover:bg-muted flex items-center justify-center transition-colors shrink-0"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
            </button>
            <div
              className="h-9 w-9 rounded-full border border-border bg-secondary/50 flex items-center justify-center text-lg shrink-0"
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
            className="fixed top-[57px] left-0 right-0 z-40 glass border-b border-border md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-link-winners"
              >
                <Trophy className="h-4 w-4 text-primary/70" />
                {t.nav.winners}
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-link-how"
              >
                <HelpCircle className="h-4 w-4 text-primary/70" />
                {t.nav.howItWorks}
              </a>
              <Link href="/terms">
                <span
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                  data-testid="mobile-link-terms"
                >
                  <FileText className="h-4 w-4 text-primary/70" />
                  {t.nav.terms}
                </span>
              </Link>
              <a
                href="#contacto"
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => setMenuOpen(false)}
                data-testid="mobile-link-contact"
              >
                <MessageCircle className="h-4 w-4 text-primary/70" />
                Contáctanos
              </a>
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
            <span className="whitespace-nowrap"><span className="text-yellow-400" style={{textShadow: '0 0 20px rgba(250,204,21,0.4)'}}>{t.hero.titleHighlight}</span><span className="text-yellow-400 inline-flex items-center" style={{fontSize: '1em', verticalAlign: 'middle'}}> <Flame className="inline h-[1.2em] w-[1.2em]" style={{fontSize: 'inherit'}} /></span></span>{", "}
            <span className="whitespace-nowrap">{t.hero.title2} <span className="text-green-400" style={{textShadow: '0 0 20px rgba(74,222,128,0.4)'}}>{t.hero.title2Highlight}</span><span style={{fontSize: '0.6em', verticalAlign: 'middle'}}> {t.hero.title2Emoji1}</span><span className="text-green-400" style={{fontSize: '0.6em', verticalAlign: 'middle'}}> {t.hero.title2Emoji2}</span></span>{" "}
            {t.hero.title2End}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-display font-bold uppercase tracking-wider flex items-center gap-2">
              <Flame className="text-primary w-5 h-5" /> 
              {t.raffle.priorityCampaign}
            </h2>
          </div>
          <RaffleCard raffle={featuredRaffle} featured={true} badgeLabel={t.raffle.badgeLabels[0]} />
        </motion.div>
      </section>


      <section className="mt-4 sm:mt-8 px-4 max-w-4xl mx-auto text-center border-t border-border pt-4 sm:pt-8">
        <h3 className="font-display text-xl font-bold mb-8">{t.footer.title}</h3>
        <div className="flex justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center group w-24" data-testid="lottery-CONALOT">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-full mx-auto">
              <img src="/logos/conalot.jpg" alt="CONALOT" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-muted-foreground mt-2">CONALOT</span>
          </div>
          <div className="flex flex-col items-center group w-24" data-testid="lottery-Super Gana">
            <div className="w-20 h-16 bg-muted/50 border border-border rounded-lg flex items-center justify-center overflow-hidden mx-auto">
              <img src="/logos/supergana.png" alt="Super Gana" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs text-muted-foreground mt-2">Super Gana</span>
          </div>
          <div className="flex flex-col items-center group w-24" data-testid="lottery-Loteria del Tachira">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-full mx-auto">
              <img src="/logos/tachira.jpg" alt="Loteria del Tachira" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-muted-foreground mt-2 text-center">Loteria del Tachira</span>
          </div>
        </div>
      </section>

      <section id="contacto" className="mt-4 sm:mt-8 px-4 max-w-4xl mx-auto border-t border-border pt-4 sm:pt-8 pb-8">
        <h3 className="font-display text-xl font-bold mb-6 text-center">Contáctanos</h3>
        <div className="flex flex-col items-center justify-center gap-4">
          <a href="mailto:ganaconmare@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-email">ganaconmare@gmail.com</a>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="h-20 w-20 rounded-full bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 p-2 shrink-0"
            data-testid="button-chat-fab"
          >
            <div className="h-full w-full rounded-full bg-background flex items-center justify-center p-1.5">
              <img src={chatOpen ? "/logos/chat-bubbles.png" : "/logos/call-center.png"} alt="Soporte" className="h-full w-full object-contain dark:invert" />
            </div>
          </button>
        </div>
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center gap-4 mt-4"
            >
              <a
                href="https://wa.me/584226333703"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full pl-4 pr-5 py-3 shadow-lg transition-all hover:scale-105"
                data-testid="link-whatsapp-chat"
              >
                <SiWhatsapp className="h-5 w-5" />
                <span className="text-sm font-medium">WhatsApp</span>
              </a>
              <a
                href="https://t.me/+584226333703"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-full pl-4 pr-5 py-3 shadow-lg transition-all hover:scale-105"
                data-testid="link-telegram-chat"
              >
                <SiTelegram className="h-5 w-5" />
                <span className="text-sm font-medium">Telegram</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    </div>
  );
}
