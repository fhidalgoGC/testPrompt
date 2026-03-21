import { environment } from "@/enviroments/enviroment";
import type {
  RaffleConfigData,
  RaffleConfigApiResponse,
} from "@/services/types/raffleConfig.types";
import type {
  PaymentMethodData,
  PaymentMethodsApiResponse,
} from "@/services/types/paymentMethods.types";

export async function fetchRaffleConfig(): Promise<RaffleConfigData> {
  const url = `${environment.apiBaseUrl}/admin-raffle-config/${encodeURIComponent(environment.rifaId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener configuración de rifa: ${res.status}`);
  }

  const json: RaffleConfigApiResponse = await res.json();
  return json.data;
}

export async function fetchPaymentMethods(): Promise<PaymentMethodData[]> {
  const url = `${environment.apiBaseUrl}/payments-methods?limit=10`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error al obtener métodos de pago: ${res.status}`);
  }

  const json: PaymentMethodsApiResponse = await res.json();
  return json.data.items;
}
