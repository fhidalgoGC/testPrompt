import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme-context";
import { FingerprintProvider } from "@/providers/fingerprint-provider";
import { PurchaseProvider } from "@/providers/purchase-provider";
import { RaffleConfigProvider } from "@/providers/raffle-config-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Terms from "@/pages/terms";
import HowItWorks from "@/pages/how-it-works";
import Redeem from "@/pages/redeem";
import EmailPreview from "@/pages/email-preview";
import { DebugProviderButton } from "@/components/debug-provider-button";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms" component={Terms} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/redeem" component={Redeem} />
      <Route path="/email-preview" component={EmailPreview} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FingerprintProvider>
        <I18nProvider>
          <ThemeProvider>
            <RaffleConfigProvider>
              <PurchaseProvider>
              <TooltipProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Router />
              </div>
              <Toaster />
              <DebugProviderButton />
              </TooltipProvider>
              </PurchaseProvider>
            </RaffleConfigProvider>
          </ThemeProvider>
        </I18nProvider>
      </FingerprintProvider>
    </QueryClientProvider>
  );
}

export default App;
