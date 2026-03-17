import { environment } from "@/enviroments/enviroment";
import type { RaffleStatsData, RaffleStatsApiResponse } from "@/services/types/progressBar.types";

export async function fetchRaffleStats(): Promise<RaffleStatsData> {
  const url = `${environment.apiBaseUrl}/rifa/estadisticas?rifaId=${encodeURIComponent(environment.rifaId)}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error al obtener estadísticas: ${res.status}`);
  }

  const json: RaffleStatsApiResponse = await res.json();
  return json.data;
}