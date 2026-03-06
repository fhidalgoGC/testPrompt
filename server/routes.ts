import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.join(process.cwd(), "server", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `comprobante_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de archivo no permitido. Solo imagenes (JPG, PNG, WEBP) o PDF."));
    }
  },
});

const otpStore = new Map<string, { code: string; expiresAt: number }>();
const verifiedPhones = new Map<string, number>();

function generateOtp(): string {
  // TODO: Replace with random generation when connecting real SMS provider
  return "123456";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedDatabase();

  app.get("/robots.txt", (req, res) => {
    res.type("text/plain").send("User-agent: *\nDisallow: /\n");
  });

  app.get(api.raffles.list.path, async (req, res) => {
    const allRaffles = await storage.getRaffles();
    res.json(allRaffles);
  });

  app.get(api.raffles.soldTickets.path, async (req, res) => {
    const id = Number(req.params.id);
    const raffle = await storage.getRaffle(id);
    if (!raffle) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    const soldNumbers = await storage.getSoldTicketNumbers(id);
    res.json(soldNumbers);
  });

  app.post(api.otp.send.path, async (req, res) => {
    try {
      const input = api.otp.send.input.parse(req.body);
      const code = generateOtp();
      const expiresAt = Date.now() + 5 * 60 * 1000;
      otpStore.set(input.phone, { code, expiresAt });

      // TODO: Replace with real SMS provider (Twilio, etc.)
      console.log(`[SMS] Verification code for ${input.phone}: ${code}`);

      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.otp.verify.path, async (req, res) => {
    try {
      const input = api.otp.verify.input.parse(req.body);
      const stored = otpStore.get(input.phone);

      if (!stored) {
        return res.json({ valid: false });
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(input.phone);
        return res.json({ valid: false });
      }

      const valid = stored.code === input.code;
      if (valid) {
        otpStore.delete(input.phone);
        verifiedPhones.set(input.phone, Date.now() + 10 * 60 * 1000);
      }

      res.json({ valid });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.raffles.buyTickets.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.raffles.buyTickets.input.parse(req.body);

      const raffle = await storage.getRaffle(id);
      if (!raffle) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      const result = await storage.buyRandomTickets(
        id,
        input.quantity,
        input.buyerEmail,
        input.buyerPhone,
        input.buyerEmail,
        input.buyerIdNumber,
      );
      res.json(result);
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

  app.post("/api/upload-comprobante", upload.single("comprobante"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No se recibio ningun archivo." });
    }
    console.log(`[Upload] Comprobante saved: ${req.file.filename}`);
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  });

  app.post("/api/coupons/redeem", async (req, res) => {
    try {
      const input = z.object({
        code: z.string().min(1),
        email: z.string().email(),
      }).parse(req.body);

      const result = await storage.redeemCoupon(input.code, input.email);
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      if (err instanceof Error) {
        if (err.message === "INVALID_CODE") {
          return res.status(404).json({ message: "INVALID_CODE" });
        }
        if (err.message === "ALREADY_USED") {
          return res.status(400).json({ message: "ALREADY_USED" });
        }
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
        title: "GANA CON MARE #1",
        description: "",
        imageUrls: [
          "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=2000&auto=format&fit=crop",
        ],
        totalTickets: 9999,
        soldTickets: 0,
      });
      const r2 = await storage.createRaffle({
        title: "GANA CON MARE#2",
        description: "",
        imageUrls: [
          "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2000&auto=format&fit=crop",
        ],
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

      await storage.createCoupon("APEX2024", 5);
      await storage.createCoupon("DREAM100", 10);
      await storage.createCoupon("WINNER50", 3);

      console.log("Database seeded successfully");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}
