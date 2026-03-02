import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const raffles = pgTable("raffles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  totalTickets: integer("total_tickets").notNull().default(9999),
  soldTickets: integer("sold_tickets").notNull().default(0),
});

export const insertRaffleSchema = createInsertSchema(raffles).omit({ id: true });

export type InsertRaffle = z.infer<typeof insertRaffleSchema>;
export type Raffle = typeof raffles.$inferSelect;
