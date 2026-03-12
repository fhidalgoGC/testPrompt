import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { submitPurchase as submitPurchaseService, type PurchaseRequest } from "@/services/purchase-service";

interface PurchaseData {
  raffleId: number;
  raffleTitle: string;
  quantity: number;
  paymentMethod: string;
  paymentCurrency: string;
  totalAmount: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerIdNumber: string;
  proofFilename: string;
}

interface PurchaseContextType {
  purchaseData: PurchaseData;
  setRaffleInfo: (raffleId: number, raffleTitle: string) => void;
  setPaymentInfo: (method: string, currency: string) => void;
  setQuantityInfo: (quantity: number, totalAmount: string) => void;
  setBuyerInfo: (name: string, phone: string, email: string, idNumber: string) => void;
  setProofFile: (filename: string) => void;
  submitPurchase: () => Promise<{ transactionId: string }>;
  resetPurchase: () => void;
}

const defaultData: PurchaseData = {
  raffleId: 0,
  raffleTitle: "",
  quantity: 4,
  paymentMethod: "",
  paymentCurrency: "",
  totalAmount: "",
  buyerName: "",
  buyerPhone: "",
  buyerEmail: "",
  buyerIdNumber: "",
  proofFilename: "",
};

const PurchaseContext = createContext<PurchaseContextType | null>(null);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [purchaseData, setPurchaseData] = useState<PurchaseData>({ ...defaultData });

  const setRaffleInfo = useCallback((raffleId: number, raffleTitle: string) => {
    setPurchaseData(prev => ({ ...prev, raffleId, raffleTitle }));
  }, []);

  const setPaymentInfo = useCallback((method: string, currency: string) => {
    setPurchaseData(prev => ({ ...prev, paymentMethod: method, paymentCurrency: currency }));
  }, []);

  const setQuantityInfo = useCallback((quantity: number, totalAmount: string) => {
    setPurchaseData(prev => ({ ...prev, quantity, totalAmount }));
  }, []);

  const setBuyerInfo = useCallback((name: string, phone: string, email: string, idNumber: string) => {
    setPurchaseData(prev => ({ ...prev, buyerName: name, buyerPhone: phone, buyerEmail: email, buyerIdNumber: idNumber }));
  }, []);

  const setProofFile = useCallback((filename: string) => {
    setPurchaseData(prev => ({ ...prev, proofFilename: filename }));
  }, []);

  const submitPurchase = useCallback(async (): Promise<{ transactionId: string }> => {
    const request: PurchaseRequest = {
      raffleId: purchaseData.raffleId,
      quantity: purchaseData.quantity,
      buyerName: purchaseData.buyerName,
      buyerPhone: purchaseData.buyerPhone,
      buyerEmail: purchaseData.buyerEmail,
      buyerIdNumber: purchaseData.buyerIdNumber,
      paymentMethod: purchaseData.paymentMethod,
      paymentCurrency: purchaseData.paymentCurrency,
      totalAmount: purchaseData.totalAmount,
      proofFilename: purchaseData.proofFilename,
    };
    return await submitPurchaseService(request);
  }, [purchaseData]);

  const resetPurchase = useCallback(() => {
    setPurchaseData({ ...defaultData });
  }, []);

  return (
    <PurchaseContext.Provider value={{
      purchaseData,
      setRaffleInfo,
      setPaymentInfo,
      setQuantityInfo,
      setBuyerInfo,
      setProofFile,
      submitPurchase,
      resetPurchase,
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
