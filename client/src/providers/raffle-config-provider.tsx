import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { fetchRaffleConfig, fetchPaymentMethods } from "@/services/raffleConfig.service";
import type { RaffleConfigData } from "@/services/types/raffleConfig.types";
import type { PaymentMethodData } from "@/services/types/paymentMethods.types";

interface RaffleConfigState {
  raffle_config: RaffleConfigData | null;
  method_payments: PaymentMethodData[];
  loading: boolean;
  error: string | null;
}

const RaffleConfigContext = createContext<RaffleConfigState | null>(null);

export function RaffleConfigProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RaffleConfigState>({
    raffle_config: null,
    method_payments: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function loadConfig() {
      const results = await Promise.allSettled([
        fetchRaffleConfig(),
        fetchPaymentMethods(),
      ]);

      const raffleResult = results[0];
      const paymentsResult = results[1];

      const errors: string[] = [];

      const raffleConfig: RaffleConfigData | null = raffleResult.status === "fulfilled"
        ? raffleResult.value
        : (() => { errors.push(raffleResult.reason?.message || "Error al obtener configuración de rifa"); return null; })();

      const paymentMethods: PaymentMethodData[] = paymentsResult.status === "fulfilled"
        ? paymentsResult.value
        : (() => { errors.push(paymentsResult.reason?.message || "Error al obtener métodos de pago"); return []; })();

      if (errors.length > 0) {
        console.error("Error cargando configuración de rifa:", errors.join("; "));
      }

      setState({
        raffle_config: raffleConfig,
        method_payments: paymentMethods,
        loading: false,
        error: errors.length > 0 ? errors.join("; ") : null,
      });
    }

    loadConfig();
  }, []);

  return (
    <RaffleConfigContext.Provider value={state}>
      {children}
    </RaffleConfigContext.Provider>
  );
}

export function useRaffleConfig() {
  const context = useContext(RaffleConfigContext);
  if (!context) throw new Error("useRaffleConfig must be used within RaffleConfigProvider");
  return context;
}
