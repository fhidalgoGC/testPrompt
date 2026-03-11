import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Terms() {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

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
