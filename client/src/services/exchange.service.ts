import { environment } from "@/enviroments/enviroment";
import type { ExchangeData, ExchangeApiResponse } from "@/services/types/exchange.types";

export async function fetchExchangeRate(coinId: string, cantidad: number): Promise<ExchangeData | null> {
  const url = `${environment.apiBaseUrl}/exchange/convert?coinId=${encodeURIComponent(coinId)}&cantidad=${cantidad}`;

  const res = await fetch(url);

  if (!res.ok) {
    return null;
  }

  const json: ExchangeApiResponse = await res.json();
  return json.data;
}
