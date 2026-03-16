import { useState } from "react";
import { RaffleCard } from "@/components/raffle-card";
import { RaffleTitle } from "@/components/raffle-title";
import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Search, Sparkles, Zap, ShieldCheck, MessageCircle, User, Mail } from "lucide-react";
import seedIconImg from "@/assets/seed-icon-nobg.png";
import { SiWhatsapp, SiTelegram } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import conalotImg from "@/assets/logos/conalot.jpg";
import superganaImg from "@/assets/logos/supergana.png";
import tachiraImg from "@/assets/logos/tachira.jpg";
import callCenterImg from "@/assets/logos/call-center.png";
import chatBubblesImg from "@/assets/logos/chat-bubbles.png";

const staticRaffles = [
  {
    id: 1,
    title: "Tus Lechuguitas # 1",
    description: "",
    imageUrls: [
      new URL("@assets/WhatsApp_Image_2026-03-15_at_14.31.59_1773672854861.jpeg", import.meta.url).href,
    ],
    totalTickets: 10000,
    soldTickets: 9989,
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
  const { t } = useI18n();
  const [chatOpen, setChatOpen] = useState(false);

  const featuredRaffle = staticRaffles[0];

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground selection:bg-primary/30 selection:text-white">
      <Navbar />

      <section className="pt-32 sm:pt-48 pb-16 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute top-40 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-black mb-8 text-center">Actívate con tus Semillas</h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <RaffleCard raffle={featuredRaffle} featured={true} badgeLabel={t.raffle.badgeLabels[0]} />
        </motion.div>
      </section>


      <section className="mt-16 sm:mt-24 px-4 max-w-4xl mx-auto text-center border-t border-border pt-4 sm:pt-8">
        <h3 className="font-display text-xl font-bold mb-8">{t.footer.title}</h3>
        <div className="flex justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center group w-24" data-testid="lottery-CONALOT">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-full mx-auto">
              <img src={conalotImg} alt="CONALOT" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-muted-foreground mt-2">CONALOT</span>
          </div>
          <div className="flex flex-col items-center group w-24" data-testid="lottery-Super Gana">
            <div className="w-20 h-16 bg-muted/50 border border-border rounded-lg flex items-center justify-center overflow-hidden mx-auto">
              <img src={superganaImg} alt="Super Gana" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs text-muted-foreground mt-2">Super Gana</span>
          </div>
          <div className="flex flex-col items-center group w-24" data-testid="lottery-Loteria del Tachira">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-full mx-auto">
              <img src={tachiraImg} alt="Loteria del Tachira" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-muted-foreground mt-2 text-center">Loteria del Tachira</span>
          </div>
        </div>
      </section>

      <section id="contacto" className="mt-4 sm:mt-8 px-4 max-w-4xl mx-auto border-t border-border pt-4 sm:pt-8 pb-8">
        <h3 className="font-display text-xl font-bold mb-6 text-center">Contáctanos</h3>
        <div className="flex flex-col items-center justify-center gap-4">
          <a href="mailto:info@maredorazio.com" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-email">info@maredorazio.com</a>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="h-20 w-20 rounded-full bg-gradient-to-r from-primary to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 p-2 shrink-0"
            data-testid="button-chat-fab"
          >
            <div className="h-full w-full rounded-full bg-background flex items-center justify-center p-1.5">
              <img src={chatOpen ? chatBubblesImg : callCenterImg} alt="Soporte" className="h-full w-full object-contain dark:invert" />
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
                href="https://t.me/ganaconmare"
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
