import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import FingerprintJS, { type GetResult } from "@fingerprintjs/fingerprintjs";

const STORAGE_KEY = "device_fingerprint";

interface FingerprintContextType {
  visitorId: string | null;
  fingerprintData: GetResult | null;
  isLoading: boolean;
}

const FingerprintContext = createContext<FingerprintContextType>({
  visitorId: null,
  fingerprintData: null,
  isLoading: true,
});

export function FingerprintProvider({ children }: { children: ReactNode }) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [fingerprintData, setFingerprintData] = useState<GetResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as GetResult;
        setVisitorId(parsed.visitorId);
        setFingerprintData(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        setVisitorId(result.visitorId);
        setFingerprintData(result);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fingerprint error:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <FingerprintContext.Provider value={{ visitorId, fingerprintData, isLoading }}>
      {children}
    </FingerprintContext.Provider>
  );
}

export function useFingerprint() {
  return useContext(FingerprintContext);
}
