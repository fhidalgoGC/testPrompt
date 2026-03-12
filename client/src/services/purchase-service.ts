export interface PurchaseRequest {
  raffleId: number;
  quantity: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerIdNumber: string;
  paymentMethod: string;
  paymentCurrency: string;
  totalAmount: string;
  proofFilename: string;
}

export interface PurchaseResponse {
  transactionId: string;
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  originalName: string;
  size: number;
}

export async function submitPurchase(data: PurchaseRequest): Promise<PurchaseResponse> {
  const res = await fetch("/api/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Error al procesar la compra");
  }
  return await res.json();
}

export async function uploadComprobante(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("comprobante", file);
  const res = await fetch("/api/upload-comprobante", { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Upload failed");
  }
  return await res.json();
}
