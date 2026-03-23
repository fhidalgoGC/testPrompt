import { environment } from "@/enviroments/enviroment";
import type { PaymentMethodData } from "@/services/types/paymentMethods.types";

export async function fetchFilteredPaymentMethods(): Promise<PaymentMethodData[]> {
  return environment.methodsPayments.map((m) => ({
    id: m.id,
    methodPaymentId: m.id,
    methodPaymentName: m.name,
    methodPaymentSlug: m.id,
    coinId: m.coinId,
    coinSlug: m.coinId,
    createdAt: "",
    updatedAt: "",
  }));
}
