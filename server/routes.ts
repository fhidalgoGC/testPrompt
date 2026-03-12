import type { Express } from "express";
import type { Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";

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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain").send("User-agent: *\nDisallow: /\n");
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

  app.post("/api/purchase", upload.single("comprobante"), async (req, res) => {
    try {
      const { raffleId, quantity, buyerName, buyerPhone, buyerEmail, buyerIdNumber, paymentMethod, paymentCurrency, totalAmount, proofFilename } = req.body;

      if (!raffleId || !quantity || !buyerName || !buyerPhone || !buyerEmail || !paymentMethod || !paymentCurrency || !totalAmount || !proofFilename) {
        return res.status(400).json({ message: "Faltan campos requeridos." });
      }

      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let transactionId = "TX-";
      for (let i = 0; i < 8; i++) transactionId += chars[Math.floor(Math.random() * chars.length)];

      const purchase = await storage.createPurchase({
        transactionId,
        raffleId: parseInt(raffleId, 10),
        quantity: parseInt(quantity, 10),
        buyerName,
        buyerPhone,
        buyerEmail,
        buyerIdNumber: buyerIdNumber || null,
        paymentMethod,
        paymentCurrency,
        totalAmount: String(totalAmount),
        proofFilename,
        status: "pending",
      });

      console.log(`[Purchase] New purchase created: ${transactionId} | ${buyerEmail} | ${quantity} seeds`);

      res.json({ transactionId: purchase.transactionId });
    } catch (err) {
      console.error("[Purchase] Error:", err);
      res.status(500).json({ message: "Error al procesar la compra." });
    }
  });

  return httpServer;
}
