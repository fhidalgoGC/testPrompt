import { useState } from "react";
import { Navbar } from "@/components/navbar";

import approvedHtml from "@/email/purchase-approved.html?raw";
import pendingHtml from "@/email/purchase-pending.html?raw";
import rejectedHtml from "@/email/purchase-rejected.html?raw";

const sampleData: Record<string, string> = {
  "{{BUYER_NAME}}": "Aron Hidalgo",
  "{{TRANSACTION_ID}}": "102840",
  "{{TOTAL_AMOUNT}}": "Bs. 5,400.00",
  "{{CURRENCY}}": "VES",
  "{{PAYMENT_METHOD}}": "Pago M\u00f3vil",
  "{{PURCHASE_DATE}}": "25/02/2026 11:56",
  "{{QUANTITY}}": "12",
  "{{SEEDS_LIST}}":
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">0371</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">1284</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">2059</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">3492</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">4817</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">5623</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">6001</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">7345</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">8190</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">8776</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">9201</div>' +
    '<div style="display:inline-flex;align-items:center;justify-content:center;min-width:64px;height:40px;background:linear-gradient(135deg,#d4a017 0%,#b8860b 100%);color:#1a1a1a;font-size:15px;font-weight:700;border-radius:8px;letter-spacing:1px;margin:4px">9988</div>',
  "{{REJECTION_REASON}}":
    "El comprobante de pago no coincide con el monto indicado. Por favor, verifica los datos e int\u00e9ntalo nuevamente.",
};

function fillTemplate(html: string): string {
  let result = html;
  for (const [key, value] of Object.entries(sampleData)) {
    result = result.replaceAll(key, value);
  }
  return result;
}

const tabs = [
  { id: "approved", label: "Aprobada", color: "bg-green-600" },
  { id: "pending", label: "Pendiente", color: "bg-amber-600" },
  { id: "rejected", label: "Rechazada", color: "bg-red-600" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const templates: Record<TabId, string> = {
  approved: approvedHtml,
  pending: pendingHtml,
  rejected: rejectedHtml,
};

export default function EmailPreview() {
  const [activeTab, setActiveTab] = useState<TabId>("approved");

  const rendered = fillTemplate(templates[activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1
          className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white"
          data-testid="text-email-preview-title"
        >
          Vista previa de correos
        </h1>
        <p
          className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6"
          data-testid="text-email-preview-subtitle"
        >
          Previsualizaci&oacute;n con datos de ejemplo
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-testid={`button-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-lg scale-105`
                  : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white"
          data-testid="container-email-preview"
        >
          <iframe
            srcDoc={rendered}
            title={`Email preview: ${activeTab}`}
            className="w-full border-0"
            style={{ height: "800px" }}
            data-testid={`iframe-email-${activeTab}`}
          />
        </div>
      </div>
    </div>
  );
}
