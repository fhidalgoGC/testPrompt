export interface ExchangeRequest {
  country: "VE" | "MX" | "CO";
  paymentMethod: string;
  priceUSD: number;
  quantity: number;
}

export interface ExchangeResponse {
  country: string;
  currency: string;
  pricePerSeed: number;
  totalPrice: number;
  quantity: number;
}

const EXCHANGE_RATES: Record<string, { currency: string; rate: number }> = {
  VE: { currency: "USD", rate: 1 },
  MX: { currency: "MXN", rate: 18 },
  CO: { currency: "COP", rate: 3700 },
};

export async function getExchangeRate(request: ExchangeRequest): Promise<ExchangeResponse> {
  const exchangeData = EXCHANGE_RATES[request.country];

  if (!exchangeData) {
    throw new Error(`País no soportado: ${request.country}`);
  }

  const pricePerSeed = request.priceUSD * exchangeData.rate;
  const totalPrice = pricePerSeed * request.quantity;

  return {
    country: request.country,
    currency: exchangeData.currency,
    pricePerSeed,
    totalPrice,
    quantity: request.quantity,
  };
}
