import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import FingerprintJS, { type GetResult } from "@fingerprintjs/fingerprintjs";
import { registerDevice, registerVisit } from "@/services/fingerprint.service";

const STORAGE_KEY = "device_fingerprint";
const VISITOR_ID_KEY = "visitorId";
const LAST_VISITOR_ID_KEY = "lastVisitorId";
const VISIT_COUNT_KEY = "visitCount";
const DEBOUNCE_MS = 1000;

interface FingerprintContextType {
  visitorId: string | null;
  lastVisitorId: string | null;
  fingerprintData: GetResult | null;
  visitCount: number;
  isLoading: boolean;
}

const FingerprintContext = createContext<FingerprintContextType>({
  visitorId: null,
  lastVisitorId: null,
  fingerprintData: null,
  visitCount: 0,
  isLoading: true,
});

export function FingerprintProvider({ children }: { children: ReactNode }) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [lastVisitorId, setLastVisitorId] = useState<string | null>(null);
  const [fingerprintData, setFingerprintData] = useState<GetResult | null>(null);
  const [visitCount, setVisitCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initRef = useRef(false);
  const visitCalledRef = useRef(false);

  const handleFingerprintResult = useCallback((result: GetResult, isInitialLoad: boolean) => {
    const currentVisitorId = localStorage.getItem(VISITOR_ID_KEY);
    const newVisitorId = result.visitorId;
    const isChanged = !!currentVisitorId && currentVisitorId !== newVisitorId;
    const isFirstTime = !currentVisitorId;

    console.log(`[fingerprint] check -> current: ${currentVisitorId} | new: ${newVisitorId} | changed: ${isChanged}`);

    if (isChanged) {
      localStorage.setItem(LAST_VISITOR_ID_KEY, currentVisitorId);
      setLastVisitorId(currentVisitorId);
      localStorage.setItem(VISIT_COUNT_KEY, "1");
      setVisitCount(1);
    }

    localStorage.setItem(VISITOR_ID_KEY, newVisitorId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    setVisitorId(newVisitorId);
    setFingerprintData(result);

    if (isFirstTime || isChanged) {
      registerDevice(result, isChanged ? currentVisitorId : null);
      visitCalledRef.current = true;
    } else if (isInitialLoad && !visitCalledRef.current) {
      const count = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10) + 1;
      localStorage.setItem(VISIT_COUNT_KEY, String(count));
      setVisitCount(count);
      registerVisit(newVisitorId);
      visitCalledRef.current = true;
    }
  }, []);

  const refreshFingerprint = useCallback(async () => {
    console.log("[fingerprint] screen change detected, recalculating...");
    try {
      const agent = await FingerprintJS.load();
      const result = await agent.get();
      handleFingerprintResult(result, false);
    } catch (err) {
      console.error("Fingerprint refresh error:", err);
    }
  }, [handleFingerprintResult]);

  const debouncedRefresh = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      refreshFingerprint();
    }, DEBOUNCE_MS);
  }, [refreshFingerprint]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const storedLastVisitorId = localStorage.getItem(LAST_VISITOR_ID_KEY);
    if (storedLastVisitorId) setLastVisitorId(storedLastVisitorId);

    const storedCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10);
    setVisitCount(storedCount);

    const storedRaw = localStorage.getItem(STORAGE_KEY);
    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw) as GetResult;
        setVisitorId(parsed.visitorId);
        setFingerprintData(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    FingerprintJS.load().then(async (agent) => {
      try {
        const result = await agent.get();
        handleFingerprintResult(result, true);
      } catch (err) {
        console.error("Fingerprint error:", err);
      }
      setIsLoading(false);
    });
  }, [handleFingerprintResult]);

  useEffect(() => {
    const handleResize = () => {
      console.log(`[fingerprint] resize detected -> ${window.innerWidth}x${window.innerHeight}`);
      debouncedRefresh();
    };

    const handleOrientation = () => {
      const orientation = screen.orientation?.type || "unknown";
      console.log(`[fingerprint] orientation change detected -> ${orientation}`);
      debouncedRefresh();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientation);

    const mql = window.matchMedia("(orientation: portrait)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      console.log(`[fingerprint] media orientation change -> ${e.matches ? "portrait" : "landscape"}`);
      debouncedRefresh();
    };
    mql.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientation);
      mql.removeEventListener("change", handleMediaChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [debouncedRefresh]);

  return (
    <FingerprintContext.Provider value={{ visitorId, lastVisitorId, fingerprintData, visitCount, isLoading }}>
      {children}
    </FingerprintContext.Provider>
  );
}

export function useFingerprint() {
  return useContext(FingerprintContext);
}
