import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface PaymentDetail {
  label: string;
  value: string;
}

const PAYMENT_DETAILS: Record<string, PaymentDetail[]> = {
  pagomovil: [
    { label: "Cédula", value: "20242594" },
    { label: "Celular", value: "0422-6333703" },
    { label: "Banco", value: "Banco de Venezuela 0102" },
  ],
  transferSpei: [
    { label: "Banco", value: "MercadoPago" },
    { label: "CLABE", value: "722969010417786326" },
  ],
  transferBancolombia: [
    { label: "Banco", value: "Bancolombia" },
    { label: "Cuenta", value: "91200009440" },
    { label: "Tipo", value: "Ahorros" },
  ],
  binancePay: [
    { label: "Binance ID", value: "894529714" },
  ],
};

interface PaymentMethodDetailsProps {
  methodPaymentId: string;
}

export function PaymentMethodDetails({ methodPaymentId }: PaymentMethodDetailsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const details = PAYMENT_DETAILS[methodPaymentId];

  if (!details || details.length === 0) return null;

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-1.5 mt-2">
      {details.map((detail) => (
        <div key={detail.label} className="flex items-center justify-between text-sm px-1">
          <span className="text-muted-foreground">{detail.label}</span>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-foreground">{detail.value}</span>
            <button
              onClick={() => handleCopy(detail.value, detail.label)}
              className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
              data-testid={`button-copy-${methodPaymentId}-${detail.label.toLowerCase()}`}
            >
              {copiedField === detail.label ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
