import { useState } from "react";
import { Bug, X } from "lucide-react";
import { useRaffleConfig } from "@/providers/raffle-config-provider";

export function DebugProviderButton() {
  const [open, setOpen] = useState(false);
  const state = useRaffleConfig();

  const isDebug = new URLSearchParams(window.location.search).get("debug") === "true";
  if (!isDebug) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full bg-red-600 text-white shadow-lg items-center justify-center hover:bg-red-700 transition-colors"
        data-testid="button-debug-provider"
      >
        <Bug className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
          <div
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-[90vw] max-w-3xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Provider State (Debug)</h2>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <pre className="text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
