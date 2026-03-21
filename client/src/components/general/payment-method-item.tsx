import { CheckCircle2 } from "lucide-react";
import type { ExchangeData } from "@/services/types/exchange.types";

interface PaymentMethodItemProps {
  logo: string;
  name: string;
  priceSeed: number;
  coinId: string;
  exchangeData?: ExchangeData | null;
  selected: boolean;
  onClick: () => void;
  testId?: string;
}

export function PaymentMethodItem({ logo, name, priceSeed, coinId, exchangeData, selected, onClick, testId }: PaymentMethodItemProps) {
  const displayPrice = exchangeData ? exchangeData.priceTotal : priceSeed;
  const displayCoin = exchangeData ? exchangeData.coinId.toUpperCase() : coinId.toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${selected ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]' : 'border-border hover:bg-muted/50'}`}
      data-testid={testId}
    >
      <img src={logo} alt={name} className="w-7 h-7 rounded object-contain" />
      <div className="flex-1 text-left">
        <span className="font-medium text-foreground">{name}</span>
        <span className="block text-xs text-muted-foreground">Precio por semilla: {displayPrice} {displayCoin}</span>
      </div>
      {selected ? (
        <CheckCircle2 className="h-5 w-5 text-primary" />
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-border" />
      )}
    </button>
  );
}
