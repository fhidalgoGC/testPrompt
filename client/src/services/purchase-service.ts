import { environment } from "../enviroments/enviroment";

const AWS_ENDPOINT = `${environment.apiBaseUrl}/rifa/registro-completo`;

export interface PurchaseRequest {
  rifaId: string;
  name: string;
  email: string;
  telefono: string;
  cedula: string;
  moneda: string;
  precioUnitario: string;
  cantidad: string;
  total: string;
  metodoPago: string;
  referencia: string;
  file: File | null;
}

interface ApiResponseData {
  transactionId: string;
  id: string;
  rifaId: string;
  name: string;
  email: string;
  telefono: string;
  moneda: string;
  precioUnitario: number;
  cantidad: number;
  total: number;
  metodoPago: string;
  status: string;
  img_url: string;
  img_key: string;
}

interface ApiResponse {
  path: string;
  status: number;
  messages: { code: string; name: string; value: string }[];
  data: ApiResponseData;
}

export interface PurchaseResponse {
  transactionId: string;
  id: string;
  status: string;
}

export async function submitPurchase(data: PurchaseRequest): Promise<PurchaseResponse> {
  const formData = new FormData();
  formData.append("rifaId", data.rifaId);
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("telefono", data.telefono);
  formData.append("cedula", data.cedula);
  formData.append("moneda", data.moneda);
  formData.append("precioUnitario", data.precioUnitario);
  formData.append("cantidad", data.cantidad);
  formData.append("total", data.total);
  formData.append("metodoPago", data.metodoPago);
  formData.append("referencia", data.referencia);
  if (data.file) {
    formData.append("file", data.file);
  }

  const res = await fetch(AWS_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = "Error al procesar la compra";
    try {
      const err = await res.json();
      errorMessage = err.data?.message || err.message || errorMessage;
    } catch {
      errorMessage = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const apiResponse: ApiResponse = await res.json();

  return {
    transactionId: apiResponse.data.transactionId,
    id: apiResponse.data.id,
    status: apiResponse.data.status,
  };
}
