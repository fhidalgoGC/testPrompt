export interface ApiMessage {
  code: string;
  name: string;
  value: string;
}

export interface ExchangeData {
  coinId: string;
  priceUnit: number;
  cantidad: number;
  priceTotal: number;
}

export interface ExchangeApiResponse {
  path: string;
  status: number;
  messages: ApiMessage[];
  data: ExchangeData;
}
