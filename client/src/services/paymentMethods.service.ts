import { environment } from "@/enviroments/enviroment";
import type { PaymentMethodData, PaymentMethodsApiResponse } from "@/services/types/paymentMethods.types";

const ALLOWED_METHOD_IDS = [
  "pagomovil",
  "transferSpei",
  "transferBancolombia",
  "binancePay",
];

export async function fetchFilteredPaymentMethods(): Promise<PaymentMethodData[]> {
  const url = `${environment.apiBaseUrl}/payments-methods?limit=10`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error al obtener métodos de pago: ${res.status}`);
  }

  const json: PaymentMethodsApiResponse = await res.json();
  const items = json.data.items;

  return items.filter((item) => ALLOWED_METHOD_IDS.includes(item.methodPaymentId));
}
