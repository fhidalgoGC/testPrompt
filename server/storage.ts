import { db } from "./db";
import {
  raffles,
  type Raffle,
  type InsertRaffle
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getRaffles(): Promise<Raffle[]>;
  getRaffle(id: number): Promise<Raffle | undefined>;
  createRaffle(raffle: InsertRaffle): Promise<Raffle>;
  updateRaffle(id: number, updates: Partial<InsertRaffle>): Promise<Raffle>;
  buyTickets(id: number, amount: number): Promise<Raffle>;
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

  async updateRaffle(id: number, updates: Partial<InsertRaffle>): Promise<Raffle> {
    const [updated] = await db.update(raffles)
      .set(updates)
      .where(eq(raffles.id, id))
      .returning();
    return updated;
  }

  async buyTickets(id: number, amount: number): Promise<Raffle> {
    const raffle = await this.getRaffle(id);
    if (!raffle) {
      throw new Error("Raffle not found");
    }
    
    const newSoldTickets = Math.min(raffle.soldTickets + amount, raffle.totalTickets);
    
    const [updated] = await db.update(raffles)
      .set({ soldTickets: newSoldTickets })
      .where(eq(raffles.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
