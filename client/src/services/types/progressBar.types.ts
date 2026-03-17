export interface ApiMessage {
  code: string;
  name: string;
  value: string;
}

export interface RaffleStatsData {
  rifaId: string;
  total: number;
  vendidos: number;
  disponibles: number;
  porcentajeVendido: number;
  porcentajeDisponible: number;
}

export interface RaffleStatsApiResponse {
  path: string;
  status: number;
  messages: ApiMessage[];
  data: RaffleStatsData;
}