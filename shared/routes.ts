import { z } from "zod";
import { insertRaffleSchema, raffles, tickets } from "./schema";

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
    soldTickets: {
      method: "GET" as const,
      path: "/api/raffles/:id/tickets" as const,
      responses: {
        200: z.array(z.number()),
        404: errorSchemas.notFound,
      },
    },
    buyTickets: {
      method: "POST" as const,
      path: "/api/raffles/:id/buy" as const,
      input: z.object({
        ticketNumbers: z.array(z.number().min(1).max(9999)),
        buyerName: z.string(),
        buyerPhone: z.string().min(8),
        buyerEmail: z.string().email(),
        buyerIdNumber: z.string(),
        otpCode: z.string().length(6).optional(),
      }),
      responses: {
        200: z.custom<typeof raffles.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  otp: {
    send: {
      method: "POST" as const,
      path: "/api/otp/send" as const,
      input: z.object({
        phone: z.string().min(8),
      }),
      responses: {
        200: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
      },
    },
    verify: {
      method: "POST" as const,
      path: "/api/otp/verify" as const,
      input: z.object({
        phone: z.string().min(8),
        code: z.string().length(6),
      }),
      responses: {
        200: z.object({ valid: z.boolean() }),
        400: errorSchemas.validation,
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
