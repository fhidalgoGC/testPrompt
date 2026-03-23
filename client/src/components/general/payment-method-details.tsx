import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { environment } from "@/enviroments/enviroment";

interface PaymentMethodDetailsProps {
  methodPaymentId: string;
}

export function PaymentMethodDetails({ methodPaymentId }: PaymentMethodDetailsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const method = environment.methodsPayments.find((m) => m.id === methodPaymentId);
  const details = method?.details ?? [];

  if (details.length === 0) return null;

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
