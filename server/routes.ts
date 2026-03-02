import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedDatabase();

  app.get(api.raffles.list.path, async (req, res) => {
    const allRaffles = await storage.getRaffles();
    res.json(allRaffles);
  });

  app.get(api.raffles.soldTickets.path, async (req, res) => {
    const id = Number(req.params.id);
    const raffle = await storage.getRaffle(id);
    if (!raffle) {
      return res.status(404).json({ message: "Raffle not found" });
    }
    const soldNumbers = await storage.getSoldTicketNumbers(id);
    res.json(soldNumbers);
  });

  app.post(api.raffles.buyTickets.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.raffles.buyTickets.input.parse(req.body);

      const raffle = await storage.getRaffle(id);
      if (!raffle) {
        return res.status(404).json({ message: "Raffle not found" });
      }

      const updated = await storage.buyTickets(id, input.ticketNumbers, input.buyerName);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}

async function seedDatabase() {
  try {
    const existing = await storage.getRaffles();
    if (existing.length === 0) {
      const r1 = await storage.createRaffle({
        title: "2024 Porsche 911 GT3 RS",
        description: "Participa por la oportunidad de ganar este espectacular deportivo de alto rendimiento.",
        imageUrl: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop",
        totalTickets: 9999,
        soldTickets: 0,
      });
      const r2 = await storage.createRaffle({
        title: "Ducati Panigale V4 S",
        description: "La moto definitiva, ahora puedes ganarla por solo unos pocos dolares.",
        imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop",
        totalTickets: 9999,
        soldTickets: 0,
      });

      const randomTickets = (count: number) => {
        const nums = new Set<number>();
        while (nums.size < count) {
          nums.add(Math.floor(Math.random() * 9999) + 1);
        }
        return Array.from(nums);
      };

      await storage.seedTickets(r1.id, randomTickets(420), 420);
      await storage.seedTickets(r2.id, randomTickets(890), 890);

      console.log("Database seeded successfully");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}
