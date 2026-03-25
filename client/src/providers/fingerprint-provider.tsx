import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import FingerprintJS, { type GetResult } from "@fingerprintjs/fingerprintjs";
import { registerDevice, registerVisit } from "@/services/fingerprint.service";

const STORAGE_KEY = "device_fingerprint";
const VISITOR_ID_KEY = "visitorId";
const LAST_VISITOR_ID_KEY = "lastVisitorId";

interface FingerprintContextType {
  visitorId: string | null;
  lastVisitorId: string | null;
  fingerprintData: GetResult | null;
  isLoading: boolean;
}

const FingerprintContext = createContext<FingerprintContextType>({
  visitorId: null,
  lastVisitorId: null,
  fingerprintData: null,
  isLoading: true,
});

export function FingerprintProvider({ children }: { children: ReactNode }) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [lastVisitorId, setLastVisitorId] = useState<string | null>(null);
  const [fingerprintData, setFingerprintData] = useState<GetResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const storedRaw = localStorage.getItem(STORAGE_KEY);
    const storedVisitorId = localStorage.getItem(VISITOR_ID_KEY);
    const storedLastVisitorId = localStorage.getItem(LAST_VISITOR_ID_KEY);

    if (storedLastVisitorId) {
      setLastVisitorId(storedLastVisitorId);
    }

    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw) as GetResult;
        setVisitorId(parsed.visitorId);
        setFingerprintData(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        const newVisitorId = result.visitorId;
        const isChanged = storedVisitorId && storedVisitorId !== newVisitorId;
        const isFirstTime = !storedVisitorId;

        if (isChanged) {
          localStorage.setItem(LAST_VISITOR_ID_KEY, storedVisitorId);
          setLastVisitorId(storedVisitorId);
        }

        localStorage.setItem(VISITOR_ID_KEY, newVisitorId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        setVisitorId(newVisitorId);
        setFingerprintData(result);
        setIsLoading(false);

        if (isFirstTime || isChanged) {
          registerDevice(result, isChanged ? storedVisitorId : null);
        } else {
          registerVisit(newVisitorId);
        }
      })
      .catch((err) => {
        console.error("Fingerprint error:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <FingerprintContext.Provider value={{ visitorId, lastVisitorId, fingerprintData, isLoading }}>
      {children}
    </FingerprintContext.Provider>
  );
}

export function useFingerprint() {
  return useContext(FingerprintContext);
}
