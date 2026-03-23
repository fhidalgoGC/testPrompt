import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { fetchRaffleConfig } from "@/services/raffleConfig.service";
import { fetchFilteredPaymentMethods } from "@/services/paymentMethods.service";
import { fetchExchangeRate } from "@/services/exchange.service";
import type { RaffleConfigData } from "@/services/types/raffleConfig.types";
import type { PaymentMethodData } from "@/services/types/paymentMethods.types";
import type { ExchangeData } from "@/services/types/exchange.types";

interface RaffleConfigState {
  raffle_config: RaffleConfigData | null;
  method_payments: PaymentMethodData[];
  exchange: Record<string, ExchangeData>;
  loading: boolean;
  error: string | null;
}

export const RaffleConfigContext = createContext<RaffleConfigState | null>(null);

export function RaffleConfigProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RaffleConfigState>({
    raffle_config: null,
    method_payments: [],
    exchange: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function loadConfig() {
      const results = await Promise.allSettled([
        fetchRaffleConfig(),
        fetchFilteredPaymentMethods(),
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

      const priceSeed = raffleConfig?.priceSeed ?? 1;
      const uniqueCoinIds = [...new Set(paymentMethods.map((m) => m.coinId))];

      const exchangeResults = await Promise.allSettled(
        uniqueCoinIds.map((coinId) => fetchExchangeRate(coinId, priceSeed))
      );

      const exchangeMap: Record<string, ExchangeData> = {};
      exchangeResults.forEach((result, index) => {
        const coinId = uniqueCoinIds[index];
        if (result.status === "fulfilled" && result.value) {
          exchangeMap[coinId] = result.value;
        }
      });

      if (errors.length > 0) {
        console.error("Error cargando configuración de rifa:", errors.join("; "));
      }

      setState({
        raffle_config: raffleConfig,
        method_payments: paymentMethods,
        exchange: exchangeMap,
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
