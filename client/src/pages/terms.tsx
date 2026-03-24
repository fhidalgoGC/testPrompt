import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { SiInstagram, SiTelegram, SiX, SiWhatsapp } from "react-icons/si";
import { Mail } from "lucide-react";

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
          const isExternal = anchor.startsWith("http");
          return (
            <a
              key={i}
              href={anchor}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              onClick={!isExternal ? (e) => {
                e.preventDefault();
                document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
              } : undefined}
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

const platformMeta: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  instagram: { icon: <SiInstagram  className="h-4 w-4" />, label: "Instagram:",           color: "text-pink-500"   },
  telegram:  { icon: <SiTelegram   className="h-4 w-4" />, label: "Telegram:",            color: "text-sky-500"    },
  x:         { icon: <SiX          className="h-4 w-4" />, label: "Twitter X:",           color: "text-foreground" },
  whatsapp:  { icon: <SiWhatsapp   className="h-4 w-4" />, label: "WhatsApp:",            color: "text-green-500"  },
  email:     { icon: <Mail         className="h-4 w-4" />, label: "Correo electronico:",  color: "text-foreground" },
};

export default function Terms() {
  const { t } = useI18n();

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
                {"socials" in section && section.socials && (() => {
                  const socials = section.socials as { platform: string; handle: string; url: string }[];
                  const grouped: Record<string, typeof socials> = {};
                  socials.forEach(s => { (grouped[s.platform] ??= []).push(s); });
                  return (
                    <div className="pt-2 space-y-2">
                      {Object.entries(grouped).map(([platform, items]) => {
                        const meta = platformMeta[platform];
                        return (
                          <div key={platform} className="text-sm text-muted-foreground">
                            <span className={`inline-flex items-center gap-1.5 font-semibold text-foreground`}>
                              <span className={meta?.color}>{meta?.icon}</span>
                              {meta?.label}
                            </span>
                            <div className="ml-6 mt-0.5 space-y-0.5">
                              {items.map((s, si) => (
                                <div key={si}>{s.handle}</div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
                {"footer" in section && section.footer && (
                  <p className="text-sm leading-relaxed pt-1 font-semibold text-foreground">{section.footer as string}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
