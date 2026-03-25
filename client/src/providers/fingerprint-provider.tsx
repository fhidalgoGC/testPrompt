import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import FingerprintJS, { type GetResult } from "@fingerprintjs/fingerprintjs";
import { registerDevice, registerVisit } from "@/services/fingerprint.service";

const STORAGE_KEY = "device_fingerprint";
const VISITOR_ID_KEY = "visitorId";
const VISITOR_ID_TIMESTAMP_KEY = "visitorIdTimestamp";
const LAST_VISITOR_ID_KEY = "lastVisitorId";
const LAST_VISITOR_ID_TIMESTAMP_KEY = "lastVisitorIdTimestamp";
const VISIT_COUNT_KEY = "visitCount";
const DEBOUNCE_MS = 1000;

interface FingerprintContextType {
  visitorId: string | null;
  visitorIdTimestamp: string | null;
  lastVisitorId: string | null;
  lastVisitorIdTimestamp: string | null;
  fingerprintData: GetResult | null;
  visitCount: number;
  isLoading: boolean;
}

const FingerprintContext = createContext<FingerprintContextType>({
  visitorId: null,
  visitorIdTimestamp: null,
  lastVisitorId: null,
  lastVisitorIdTimestamp: null,
  fingerprintData: null,
  visitCount: 0,
  isLoading: true,
});

export function FingerprintProvider({ children }: { children: ReactNode }) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [visitorIdTimestamp, setVisitorIdTimestamp] = useState<string | null>(null);
  const [lastVisitorId, setLastVisitorId] = useState<string | null>(null);
  const [lastVisitorIdTimestamp, setLastVisitorIdTimestamp] = useState<string | null>(null);
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
    const now = new Date().toISOString();

    if (isChanged) {
      const currentTimestamp = localStorage.getItem(VISITOR_ID_TIMESTAMP_KEY);
      localStorage.setItem(LAST_VISITOR_ID_KEY, currentVisitorId);
      localStorage.setItem(LAST_VISITOR_ID_TIMESTAMP_KEY, currentTimestamp || now);
      setLastVisitorId(currentVisitorId);
      setLastVisitorIdTimestamp(currentTimestamp || now);
      localStorage.setItem(VISIT_COUNT_KEY, "1");
      setVisitCount(1);
    }

    if (isFirstTime || isChanged) {
      localStorage.setItem(VISITOR_ID_TIMESTAMP_KEY, now);
      setVisitorIdTimestamp(now);
    }

    localStorage.setItem(VISITOR_ID_KEY, newVisitorId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    setVisitorId(newVisitorId);
    setFingerprintData(result);

    if (isFirstTime || isChanged) {
      const lastTs = isChanged ? (localStorage.getItem(LAST_VISITOR_ID_TIMESTAMP_KEY) || null) : null;
      registerDevice(result, isChanged ? currentVisitorId : null, now, lastTs);
      visitCalledRef.current = true;
    } else if (isInitialLoad && !visitCalledRef.current) {
      const count = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10) + 1;
      localStorage.setItem(VISIT_COUNT_KEY, String(count));
      setVisitCount(count);
      registerVisit(newVisitorId, now);
      visitCalledRef.current = true;
    }
  }, []);

  const refreshFingerprint = useCallback(async () => {
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

    const storedVisitorIdTimestamp = localStorage.getItem(VISITOR_ID_TIMESTAMP_KEY);
    if (storedVisitorIdTimestamp) setVisitorIdTimestamp(storedVisitorIdTimestamp);

    const storedLastVisitorIdTimestamp = localStorage.getItem(LAST_VISITOR_ID_TIMESTAMP_KEY);
    if (storedLastVisitorIdTimestamp) setLastVisitorIdTimestamp(storedLastVisitorIdTimestamp);

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
    const handler = () => debouncedRefresh();

    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);

    const mql = window.matchMedia("(orientation: portrait)");
    mql.addEventListener("change", handler);

    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
      mql.removeEventListener("change", handler);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [debouncedRefresh]);

  return (
    <FingerprintContext.Provider value={{ visitorId, visitorIdTimestamp, lastVisitorId, lastVisitorIdTimestamp, fingerprintData, visitCount, isLoading }}>
      {children}
    </FingerprintContext.Provider>
  );
}

export function useFingerprint() {
  return useContext(FingerprintContext);
}
