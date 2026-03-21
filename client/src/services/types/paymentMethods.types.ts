export interface ApiMessage {
  code: string;
  name: string;
  value: string;
}

export interface PaymentMethodData {
  id: string;
  methodPaymentId: string;
  methodPaymentName: string;
  methodPaymentSlug: string;
  coinId: string;
  coinSlug: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentMethodsApiResponse {
  path: string;
  status: number;
  messages: ApiMessage[];
  data: {
    items: PaymentMethodData[];
    _meta: PaymentMethodsMeta;
  };
}
