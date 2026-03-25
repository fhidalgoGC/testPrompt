import type { GetResult } from "@fingerprintjs/fingerprintjs";

const REGISTER_ENDPOINT = "/api/device/register";
const VISIT_ENDPOINT = "/api/device/visit";

export async function registerDevice(fingerprintData: GetResult): Promise<void> {
  console.log(`[fingerprint.service] POST ${REGISTER_ENDPOINT}`, {
    visitorId: fingerprintData.visitorId,
    confidence: fingerprintData.confidence,
    components: fingerprintData.components,
  });
}

export async function registerVisit(visitorId: string): Promise<void> {
  console.log(`[fingerprint.service] POST ${VISIT_ENDPOINT}`, {
    visitorId,
    timestamp: new Date().toISOString(),
  });
}
