import { db } from "./db";
import {
  raffles,
  tickets,
  type Raffle,
  type InsertRaffle,
  type Ticket,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getRaffles(): Promise<Raffle[]>;
  getRaffle(id: number): Promise<Raffle | undefined>;
  createRaffle(raffle: InsertRaffle): Promise<Raffle>;
  getSoldTicketNumbers(raffleId: number): Promise<number[]>;
  buyRandomTickets(raffleId: number, quantity: number, buyerName: string, buyerPhone?: string, buyerEmail?: string, buyerIdNumber?: string): Promise<{ raffle: Raffle; assignedNumbers: number[] }>;
  seedTickets(raffleId: number, ticketNumbers: number[], soldCount: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getRaffles(): Promise<Raffle[]> {
    return await db.select().from(raffles);
  }

  async getRaffle(id: number): Promise<Raffle | undefined> {
    const [raffle] = await db.select().from(raffles).where(eq(raffles.id, id));
    return raffle;
  }

  async createRaffle(insertRaffle: InsertRaffle): Promise<Raffle> {
    const [raffle] = await db.insert(raffles).values(insertRaffle).returning();
    return raffle;
  }

  async getSoldTicketNumbers(raffleId: number): Promise<number[]> {
    const rows = await db.select({ ticketNumber: tickets.ticketNumber })
      .from(tickets)
      .where(eq(tickets.raffleId, raffleId));
    return rows.map(r => r.ticketNumber);
  }

  async buyRandomTickets(raffleId: number, quantity: number, buyerName: string, buyerPhone?: string, buyerEmail?: string, buyerIdNumber?: string): Promise<{ raffle: Raffle; assignedNumbers: number[] }> {
    const raffle = await this.getRaffle(raffleId);
    if (!raffle) {
      throw new Error("Campaign not found");
    }

    const soldNumbers = await this.getSoldTicketNumbers(raffleId);
    const soldSet = new Set(soldNumbers);

    const available: number[] = [];
    for (let i = 1; i <= raffle.totalTickets; i++) {
      if (!soldSet.has(i)) available.push(i);
    }

    if (available.length < quantity) {
      throw new Error(`Solo quedan ${available.length} numeros disponibles`);
    }

    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }
    const assignedNumbers = available.slice(0, quantity).sort((a, b) => a - b);

    const ticketValues = assignedNumbers.map(num => ({
      raffleId,
      ticketNumber: num,
      buyerName,
      buyerPhone: buyerPhone || null,
      buyerEmail: buyerEmail || null,
      buyerIdNumber: buyerIdNumber || null,
    }));

    await db.insert(tickets).values(ticketValues);

    const newSoldCount = Math.min(raffle.soldTickets + assignedNumbers.length, raffle.totalTickets);
    const [updated] = await db.update(raffles)
      .set({ soldTickets: newSoldCount })
      .where(eq(raffles.id, raffleId))
      .returning();

    return { raffle: updated, assignedNumbers };
  }

  async seedTickets(raffleId: number, ticketNumbers: number[], soldCount: number): Promise<void> {
    const batchSize = 500;
    for (let i = 0; i < ticketNumbers.length; i += batchSize) {
      const batch = ticketNumbers.slice(i, i + batchSize);
      const values = batch.map(num => ({
        raffleId,
        ticketNumber: num,
        buyerName: "Demo",
      }));
      await db.insert(tickets).values(values);
    }
    await db.update(raffles).set({ soldTickets: soldCount }).where(eq(raffles.id, raffleId));
  }
}

export const storage = new DatabaseStorage();
