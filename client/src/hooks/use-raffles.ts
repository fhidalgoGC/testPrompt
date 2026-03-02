import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useRaffles() {
  return useQuery({
    queryKey: [api.raffles.list.path],
    queryFn: async () => {
      const res = await fetch(api.raffles.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch raffles");
      return await res.json();
    },
  });
}

export function useSoldTickets(raffleId: number) {
  return useQuery({
    queryKey: [api.raffles.soldTickets.path, raffleId],
    queryFn: async () => {
      const url = buildUrl(api.raffles.soldTickets.path, { id: raffleId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sold tickets");
      return (await res.json()) as number[];
    },
    enabled: raffleId > 0,
  });
}

export function useBuyTickets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ticketNumbers, buyerName, buyerPhone, buyerEmail, buyerIdNumber, otpCode }: {
      id: number;
      ticketNumbers: number[];
      buyerName: string;
      buyerPhone: string;
      buyerEmail: string;
      buyerIdNumber: string;
      otpCode: string;
    }) => {
      const url = buildUrl(api.raffles.buyTickets.path, { id });
      const res = await fetch(url, {
        method: api.raffles.buyTickets.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumbers, buyerName, buyerPhone, buyerEmail, buyerIdNumber, otpCode }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to buy tickets");
      }

      return await res.json();
    },
    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.raffles.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.raffles.soldTickets.path, variables.id] });
    },
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: async ({ phone }: { phone: string }) => {
      const res = await fetch(api.otp.send.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send code");
      }

      return (await res.json()) as { success: boolean };
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async ({ phone, code }: { phone: string; code: string }) => {
      const res = await fetch(api.otp.verify.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to verify code");
      }

      return (await res.json()) as { valid: boolean };
    },
  });
}
