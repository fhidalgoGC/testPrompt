import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { submitPurchase as submitPurchaseService, type PurchaseRequest } from "@/services/purchase-service";
import { environment } from "@/enviroments/enviroment";

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
  referencia: string;
  coinId: string;
  coinSlug: string;
  methodPaymentId: string;
  methodPaymentSlug: string;
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
    if (!proofFileRef.current) {
      throw new Error("Debes adjuntar el comprobante de pago");
    }

    const rifaId = environment.rifaId;

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
      referencia: params.referencia,
      coinId: params.coinId,
      coinSlug: params.coinSlug,
      methodPaymentId: params.methodPaymentId,
      methodPaymentSlug: params.methodPaymentSlug,
      file: proofFileRef.current,
    };

    const response = await submitPurchaseService(request);
    return { transactionId: response.transactionId };
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
