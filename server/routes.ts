import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed initial data
  await seedDatabase();

  app.get(api.raffles.list.path, async (req, res) => {
    const allRaffles = await storage.getRaffles();
    res.json(allRaffles);
  });

  app.post(api.raffles.buyTickets.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.raffles.buyTickets.input.parse(req.body);
      
      const raffle = await storage.getRaffle(id);
      if (!raffle) {
        return res.status(404).json({ message: "Raffle not found" });
      }

      const updated = await storage.buyTickets(id, input.amount);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
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
      await storage.createRaffle({
        title: "2024 Porsche 911 GT3 RS",
        description: "Participate for a chance to win this spectacular high-performance sports car.",
        imageUrl: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop",
        totalTickets: 9999,
        soldTickets: 4200,
      });
      await storage.createRaffle({
        title: "Ducati Panigale V4 S",
        description: "The ultimate track weapon, now you can win it for just a few dollars.",
        imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop",
        totalTickets: 9999,
        soldTickets: 8900,
      });
      console.log("Database seeded successfully");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}
