import { pgTable, text, serial, integer, uniqueIndex, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const raffles = pgTable("raffles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  totalTickets: integer("total_tickets").notNull().default(9999),
  soldTickets: integer("sold_tickets").notNull().default(0),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  raffleId: integer("raffle_id").notNull(),
  ticketNumber: integer("ticket_number").notNull(),
  buyerName: text("buyer_name").notNull(),
  buyerPhone: text("buyer_phone"),
  buyerEmail: text("buyer_email"),
  buyerIdNumber: text("buyer_id_number"),
}, (table) => [
  uniqueIndex("raffle_ticket_unique").on(table.raffleId, table.ticketNumber),
]);

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  credits: integer("credits").notNull(),
  used: boolean("used").notNull().default(false),
  usedByEmail: text("used_by_email"),
});

export const insertRaffleSchema = createInsertSchema(raffles).omit({ id: true });
export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true });
export const insertCouponSchema = createInsertSchema(coupons).omit({ id: true });

export type InsertRaffle = z.infer<typeof insertRaffleSchema>;
export type Raffle = typeof raffles.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
