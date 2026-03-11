import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/navbar";
import { ChevronLeft, Sprout, CreditCard, Upload, Clock, Trophy } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const stepIcons = [Sprout, CreditCard, Upload, Clock, Trophy];

export default function HowItWorks() {
  const { t } = useI18n();

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
          <h1 className="text-3xl sm:text-4xl font-display font-black mb-2" data-testid="text-how-title">
            {t.howItWorks.title}
          </h1>
          <p className="text-sm text-muted-foreground mb-10" data-testid="text-how-subtitle">
            {t.howItWorks.subtitle}
          </p>

          <div className="space-y-6">
            {t.howItWorks.steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex gap-4 p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm"
                  data-testid={`card-step-${index}`}
                >
                  <div className="shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg font-display font-bold text-foreground" data-testid={`text-step-heading-${index}`}>
                      {step.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-step-body-${index}`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
