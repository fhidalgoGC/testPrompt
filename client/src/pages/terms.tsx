import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";

function RichBody({ text, testId }: { text: string; testId: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <p className="text-sm text-muted-foreground leading-relaxed" data-testid={testId}>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
      )}
    </p>
  );
}

export default function Terms() {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
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

          <div className="space-y-3">
            {t.terms.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="space-y-1"
              >
                <h2 className="text-lg font-display font-bold text-foreground" data-testid={`text-terms-heading-${index}`}>
                  {section.heading}
                </h2>
                <RichBody text={section.body} testId={`text-terms-body-${index}`} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
