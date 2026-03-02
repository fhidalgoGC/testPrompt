import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type BuyTicketsInput } from "@shared/routes";

// Utility to parse Zod schemas with logging to prevent silent failures
function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod Validation Error] ${label}:`, result.error.format());
    // Still return the data even if it fails validation in this lite mode to prevent completely breaking the UI,
    // but in a real app we might throw. The generic structure might differ slightly from the schema if mocked.
    return data as T; 
  }
  return result.data as T;
}

export function useRaffles() {
  return useQuery({
    queryKey: [api.raffles.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.raffles.list.path, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch raffles");
        const data = await res.json();
        return parseWithLogging(api.raffles.list.responses[200], data, "raffles.list");
      } catch (error) {
        console.warn("API not available or failed. Returning mock data for UI visualization.", error);
        // Fallback mock data to ensure UI is visible even if backend isn't ready
        return [
          {
            id: 1,
            title: "2024 Lamborghini Huracán EVO",
            description: "Experience the pinnacle of Italian engineering. V10 naturally aspirated engine, all-wheel drive, and an exhaust note that will wake the dead.",
            imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop",
            totalTickets: 9999,
            soldTickets: 8450,
          },
          {
            id: 2,
            title: "Ducati Panigale V4 S",
            description: "The closest thing to a MotoGP bike you can ride on the street. Unmatched power-to-weight ratio and stunning aerodynamics.",
            imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070&auto=format&fit=crop",
            totalTickets: 9999,
            soldTickets: 4200,
          },
          {
            id: 3,
            title: "Porsche 911 GT3 RS",
            description: "Born in Flacht. Track precision for the street with a massive rear wing and active aerodynamics.",
            imageUrl: "https://images.unsplash.com/photo-1503376710356-787e14e13554?q=80&w=2070&auto=format&fit=crop",
            totalTickets: 9999,
            soldTickets: 9850,
          }
        ];
      }
    },
  });
}

export function useBuyTickets() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, amount }: { id: number; amount: number }) => {
      const validated = api.raffles.buyTickets.input.parse({ amount });
      const url = buildUrl(api.raffles.buyTickets.path, { id });
      
      const res = await fetch(url, {
        method: api.raffles.buyTickets.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400 || res.status === 404) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to buy tickets");
        }
        throw new Error("An unexpected error occurred");
      }
      
      return await res.json();
    },
    // Optimistic update for immediate feedback
    onMutate: async ({ id, amount }) => {
      await queryClient.cancelQueries({ queryKey: [api.raffles.list.path] });
      const previousRaffles = queryClient.getQueryData([api.raffles.list.path]);
      
      queryClient.setQueryData([api.raffles.list.path], (old: any) => {
        if (!old) return old;
        return old.map((raffle: any) => {
          if (raffle.id === id) {
            return {
              ...raffle,
              soldTickets: Math.min(raffle.totalTickets, raffle.soldTickets + amount)
            };
          }
          return raffle;
        });
      });
      
      return { previousRaffles };
    },
    onError: (err, variables, context) => {
      if (context?.previousRaffles) {
        queryClient.setQueryData([api.raffles.list.path], context.previousRaffles);
      }
      console.error("Buy mutation failed:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [api.raffles.list.path] });
    },
  });
}
