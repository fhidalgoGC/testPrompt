import { environment } from "@/enviroments/enviroment";

export interface RaffleConfig {
  [key: string]: any;
}

export interface PaymentMethod {
  [key: string]: any;
}

export async function fetchRaffleConfig(): Promise<RaffleConfig> {
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

  const json = await res.json();
  return json.data ?? json;
}

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const url = `${environment.apiBaseUrl}/payments-methods?limit=10`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error al obtener métodos de pago: ${res.status}`);
  }

  const json = await res.json();
  const result = json.data ?? json;
  return Array.isArray(result) ? result : [];
}
