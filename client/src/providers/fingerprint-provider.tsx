import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import FingerprintJS, { type GetResult, type Agent } from "@fingerprintjs/fingerprintjs";
import { registerDevice, registerVisit } from "@/services/fingerprint.service";

const STORAGE_KEY = "device_fingerprint";
const VISITOR_ID_KEY = "visitorId";
const LAST_VISITOR_ID_KEY = "lastVisitorId";
const DEBOUNCE_MS = 1000;

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

function processResult(result: GetResult) {
  const currentVisitorId = localStorage.getItem(VISITOR_ID_KEY);
  const newVisitorId = result.visitorId;
  const isChanged = currentVisitorId && currentVisitorId !== newVisitorId;
  const isFirstTime = !currentVisitorId;

  let prevId: string | null = null;

  if (isChanged) {
    localStorage.setItem(LAST_VISITOR_ID_KEY, currentVisitorId);
    prevId = currentVisitorId;
  }

  localStorage.setItem(VISITOR_ID_KEY, newVisitorId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));

  if (isFirstTime || isChanged) {
    registerDevice(result, prevId);
  } else {
    registerVisit(newVisitorId);
  }

  return { newVisitorId, prevId, isChanged };
}

export function FingerprintProvider({ children }: { children: ReactNode }) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [lastVisitorId, setLastVisitorId] = useState<string | null>(null);
  const [fingerprintData, setFingerprintData] = useState<GetResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const agentRef = useRef<Agent | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initRef = useRef(false);

  const refreshFingerprint = useCallback(async () => {
    if (!agentRef.current) return;
    try {
      const result = await agentRef.current.get();
      const { newVisitorId, prevId, isChanged } = processResult(result);

      setVisitorId(newVisitorId);
      setFingerprintData(result);
      if (isChanged && prevId) {
        setLastVisitorId(prevId);
      }
    } catch (err) {
      console.error("Fingerprint refresh error:", err);
    }
  }, []);

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
      agentRef.current = agent;
      try {
        const result = await agent.get();
        const { newVisitorId, prevId, isChanged } = processResult(result);

        setVisitorId(newVisitorId);
        setFingerprintData(result);
        if (isChanged && prevId) setLastVisitorId(prevId);
      } catch (err) {
        console.error("Fingerprint error:", err);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => debouncedRefresh();

    const handleOrientation = () => debouncedRefresh();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientation);

    const mqlPortrait = window.matchMedia("(orientation: portrait)");
    const handleMediaChange = () => debouncedRefresh();
    mqlPortrait.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientation);
      mqlPortrait.removeEventListener("change", handleMediaChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [debouncedRefresh]);

  return (
    <FingerprintContext.Provider value={{ visitorId, lastVisitorId, fingerprintData, isLoading }}>
      {children}
    </FingerprintContext.Provider>
  );
}

export function useFingerprint() {
  return useContext(FingerprintContext);
}
