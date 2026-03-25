import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import FingerprintJS, { type GetResult } from "@fingerprintjs/fingerprintjs";
import { registerDevice, registerVisit } from "@/services/fingerprint.service";

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
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const storedRaw = localStorage.getItem(STORAGE_KEY);
    let previousVisitorId: string | null = null;

    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw) as GetResult;
        previousVisitorId = parsed.visitorId;
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

        const isNewDevice = !previousVisitorId || previousVisitorId !== result.visitorId;

        if (isNewDevice) {
          registerDevice(result);
        } else {
          registerVisit(result.visitorId);
        }
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
