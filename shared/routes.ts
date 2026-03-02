import { z } from "zod";
import { insertRaffleSchema, raffles } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  raffles: {
    list: {
      method: "GET" as const,
      path: "/api/raffles" as const,
      responses: {
        200: z.array(z.custom<typeof raffles.$inferSelect>()),
      },
    },
    buyTickets: {
      method: "POST" as const,
      path: "/api/raffles/:id/buy" as const,
      input: z.object({ amount: z.number().min(1).max(100) }),
      responses: {
        200: z.custom<typeof raffles.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type RaffleListResponse = z.infer<typeof api.raffles.list.responses[200]>;
export type BuyTicketsInput = z.infer<typeof api.raffles.buyTickets.input>;
