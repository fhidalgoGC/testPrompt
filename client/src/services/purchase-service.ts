const AWS_ENDPOINT = "https://4v82xof559.execute-api.us-east-1.amazonaws.com/dev/rifa/registro-completo";

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
  file: File | null;
}

export interface PurchaseResponse {
  transactionId?: string;
  message?: string;
  [key: string]: unknown;
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
      errorMessage = err.message || errorMessage;
    } catch {
      errorMessage = `Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return await res.json();
}
