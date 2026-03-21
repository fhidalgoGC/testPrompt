import { environment } from "@/enviroments/enviroment";
import type {
  RaffleConfigData,
  RaffleConfigApiResponse,
} from "@/services/types/raffleConfig.types";

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
