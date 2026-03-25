import type { GetResult } from "@fingerprintjs/fingerprintjs";

const REGISTER_ENDPOINT = "/api/device/register";
const VISIT_ENDPOINT = "/api/device/visit";

export interface RegisterDevicePayload {
  visitorId: string;
  visitorIdTimestamp: string;
  lastVisitorId: string | null;
  lastVisitorIdTimestamp: string | null;
  confidence: GetResult["confidence"];
  components: GetResult["components"];
}

export interface RegisterVisitPayload {
  visitorId: string;
  timestamp: string;
}

export async function registerDevice(
  fingerprintData: GetResult,
  lastVisitorId: string | null,
  visitorIdTimestamp: string,
  lastVisitorIdTimestamp: string | null,
): Promise<void> {
  const payload: RegisterDevicePayload = {
    visitorId: fingerprintData.visitorId,
    visitorIdTimestamp,
    lastVisitorId,
    lastVisitorIdTimestamp,
    confidence: fingerprintData.confidence,
    components: fingerprintData.components,
  };
  console.log(`[fingerprint.service register] POST ${REGISTER_ENDPOINT}`, payload);
}

export async function registerVisit(visitorId: string, timestamp: string): Promise<void> {
  const payload: RegisterVisitPayload = {
    visitorId,
    timestamp,
  };
  console.log(`[fingerprint.service visit] POST ${VISIT_ENDPOINT}`, payload);
}
