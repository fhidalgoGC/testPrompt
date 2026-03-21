export interface ApiMessage {
  code: string;
  name: string;
  value: string;
}

export interface PrizeMetadata {
  label: string;
}

export interface Prize {
  prize: number;
  metadata: PrizeMetadata;
  spot: number;
}

export interface RaffleConfigData {
  id: string;
  raffleId: string;
  raffleSlug: string;
  priceSeed: number;
  prizes: Prize[];
  coinId: string;
  coinSlug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RaffleConfigApiResponse {
  path: string;
  status: number;
  messages: ApiMessage[];
  data: RaffleConfigData;
}
