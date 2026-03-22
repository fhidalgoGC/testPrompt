import { useState } from "react";
import { BrandHeader } from "@/components/general/brand-header";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText, Trophy, MessageCircle, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme-context";
import { Link } from "wouter";

export function Navbar() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass border-b border-border px-3 sm:px-6 py-3.5 sm:py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="shrink-0">
            <BrandHeader />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70 dark:text-muted-foreground">
              <Link href="/">
                <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-home">Home</span>
              </Link>
              <Link href="/terms">
                <span className="hover:text-foreground transition-colors cursor-pointer" data-testid="link-terms">{t.nav.terms}</span>
              </Link>
              <a href="#contacto" className="hover:text-foreground transition-colors" data-testid="link-contact">Contáctanos</a>
            </div>
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
              <Link href="/">
                <span
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                  data-testid="mobile-link-home"
                >
                  <Trophy className="h-4 w-4 text-primary/70" />
                  Home
                </span>
              </Link>
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
    </>
  );
}
