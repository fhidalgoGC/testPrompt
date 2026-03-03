import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Globe, ChevronLeft, Menu } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Terms() {
  const { t, locale, setLocale } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Link href="/">
            <div className="flex items-center gap-2 shrink-0 cursor-pointer" data-testid="link-home-logo">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-primary to-yellow-600 rounded-sm flex items-center justify-center transform rotate-45">
                <span className="font-display font-black text-black -rotate-45 text-base sm:text-lg">G</span>
              </div>
              <span className="font-display font-bold text-lg sm:text-xl tracking-wider uppercase text-glow">
                G<span className="text-primary">Mare</span>
              </span>
            </div>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocale(locale === "es" ? "en" : "es")}
            className="border-white/10 text-xs font-bold gap-1.5 shrink-0"
            data-testid="button-lang-switch"
          >
            <Globe className="h-3.5 w-3.5" />
            {t.langSwitch}
          </Button>
        </div>
      </nav>

      <div className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <Link href="/">
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer mb-6" data-testid="link-back-home">
            <ChevronLeft className="h-4 w-4" />
            GMare
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-display font-black mb-2" data-testid="text-terms-title">
            {t.terms.title}
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            {t.terms.lastUpdated}: {new Date().toLocaleDateString(locale === "es" ? "es-ES" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <div className="space-y-8">
            {t.terms.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="space-y-2"
              >
                <h2 className="text-lg font-display font-bold text-foreground" data-testid={`text-terms-heading-${index}`}>
                  {section.heading}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-terms-body-${index}`}>
                  {section.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
