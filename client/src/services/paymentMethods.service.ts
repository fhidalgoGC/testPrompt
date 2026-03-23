import { environment } from "@/enviroments/enviroment";
import type { PaymentMethodData, PaymentMethodsApiResponse } from "@/services/types/paymentMethods.types";

const ALLOWED_METHOD_IDS = [
  "pagomovil",
  "transferSpei",
  "transferBancolombia",
  "binancePay",
];

const STATIC_PAYMENT_METHODS: PaymentMethodData[] = [
  {
    id: "zelle",
    methodPaymentId: "zelle",
    methodPaymentName: "Zelle",
    methodPaymentSlug: "zelle",
    coinId: "usd",
    coinSlug: "usd",
    createdAt: "",
    updatedAt: "",
  },
];

export async function fetchFilteredPaymentMethods(): Promise<PaymentMethodData[]> {
  const url = `${environment.apiBaseUrl}/payments-methods?limit=10`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error al obtener métodos de pago: ${res.status}`);
  }

  const json: PaymentMethodsApiResponse = await res.json();
  const items = json.data.items;

  const filtered = items.filter((item) => ALLOWED_METHOD_IDS.includes(item.methodPaymentId));
  return [...filtered, ...STATIC_PAYMENT_METHODS];
}
