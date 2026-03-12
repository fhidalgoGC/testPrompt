import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { submitPurchase as submitPurchaseService, type PurchaseRequest } from "@/services/purchase-service";

export interface SubmitPurchaseParams {
  raffleId: number;
  raffleTitle: string;
  quantity: number;
  paymentMethod: string;
  paymentCurrency: string;
  precioUnitario: string;
  totalAmount: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerIdNumber: string;
}

interface PurchaseContextType {
  proofFile: File | null;
  setProofFile: (file: File | null) => void;
  submitPurchase: (params: SubmitPurchaseParams) => Promise<{ transactionId: string }>;
}

const PurchaseContext = createContext<PurchaseContextType | null>(null);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const proofFileRef = useRef<File | null>(null);
  const [, setFileVersion] = useState(0);

  const setProofFile = useCallback((file: File | null) => {
    proofFileRef.current = file;
    setFileVersion(v => v + 1);
  }, []);

  const submitPurchase = useCallback(async (params: SubmitPurchaseParams): Promise<{ transactionId: string }> => {
    const rifaId = "GM1";

    const request: PurchaseRequest = {
      rifaId,
      name: params.buyerName,
      email: params.buyerEmail,
      telefono: params.buyerPhone,
      cedula: params.buyerIdNumber,
      moneda: params.paymentCurrency,
      precioUnitario: params.precioUnitario,
      cantidad: String(params.quantity),
      total: params.totalAmount,
      metodoPago: params.paymentMethod,
      file: proofFileRef.current,
    };

    const response = await submitPurchaseService(request);
    return { transactionId: response.transactionId || response.message || "OK" };
  }, []);

  return (
    <PurchaseContext.Provider value={{
      proofFile: proofFileRef.current,
      setProofFile,
      submitPurchase,
    }}>
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (!context) throw new Error("usePurchase must be used within PurchaseProvider");
  return context;
}
