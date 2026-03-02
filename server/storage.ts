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
  buyTickets(raffleId: number, ticketNumbers: number[], buyerName: string, buyerPhone?: string, buyerEmail?: string, buyerIdNumber?: string): Promise<Raffle>;
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

  async buyTickets(raffleId: number, ticketNumbers: number[], buyerName: string, buyerPhone?: string, buyerEmail?: string, buyerIdNumber?: string): Promise<Raffle> {
    const raffle = await this.getRaffle(raffleId);
    if (!raffle) {
      throw new Error("Campaign not found");
    }

    const existingSold = await this.getSoldTicketNumbers(raffleId);
    const alreadySold = ticketNumbers.filter(n => existingSold.includes(n));
    if (alreadySold.length > 0) {
      throw new Error(`Numbers already sold: ${alreadySold.join(", ")}`);
    }

    const validNumbers = ticketNumbers.filter(n => n >= 1 && n <= raffle.totalTickets);
    if (validNumbers.length !== ticketNumbers.length) {
      throw new Error("Some ticket numbers are out of range");
    }

    const ticketValues = validNumbers.map(num => ({
      raffleId,
      ticketNumber: num,
      buyerName,
      buyerPhone: buyerPhone || null,
      buyerEmail: buyerEmail || null,
      buyerIdNumber: buyerIdNumber || null,
    }));

    await db.insert(tickets).values(ticketValues);

    const newSoldCount = Math.min(raffle.soldTickets + validNumbers.length, raffle.totalTickets);
    const [updated] = await db.update(raffles)
      .set({ soldTickets: newSoldCount })
      .where(eq(raffles.id, raffleId))
      .returning();

    return updated;
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
