import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";

function RichBody({ text, testId }: { text: string; testId: string }) {
  const tokens = text.split(/(\*\*.+?\*\*|__.+?__|%%[^%]+%%)/g);
  return (
    <p className="text-sm text-muted-foreground leading-relaxed" data-testid={testId}>
      {tokens.map((token, i) => {
        if (token.startsWith("**") && token.endsWith("**"))
          return <strong key={i} className="font-semibold text-foreground">{token.slice(2, -2)}</strong>;
        if (token.startsWith("__") && token.endsWith("__"))
          return <span key={i} className="underline">{token.slice(2, -2)}</span>;
        if (token.startsWith("%%") && token.endsWith("%%")) {
          const inner = token.slice(2, -2);
          const [label, anchor] = inner.split("|");
          return (
            <a
              key={i}
              href={anchor}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="underline text-primary font-medium cursor-pointer"
            >
              {label}
            </a>
          );
        }
        return token;
      })}
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
          <div className="mb-10" />

          <div className="space-y-3">
            {t.terms.sections.map((section, index) => (
              <motion.div
                key={index}
                id={`section-${index + 1}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="space-y-0 scroll-mt-28"
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
