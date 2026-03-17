import { environment } from "@/enviroments/enviroment";

export interface RaffleStatsData {
  rifaId: string;
  total: number;
  vendidos: number;
  disponibles: number;
  porcentajeVendido: number;
  porcentajeDisponible: number;
}

interface ApiResponse {
  path: string;
  status: number;
  messages: { code: string; name: string; value: string }[];
  data: RaffleStatsData;
}

export async function fetchRaffleStats(): Promise<RaffleStatsData> {
  const url = `${environment.apiBaseUrl}/rifa/estadisticas?rifaId=${encodeURIComponent(environment.rifaId)}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error al obtener estadísticas: ${res.status}`);
  }

  const json: ApiResponse = await res.json();
  return json.data;
}