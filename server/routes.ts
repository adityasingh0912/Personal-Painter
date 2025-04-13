import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerConversationRoutes } from "./controllers/conversation";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register API routes
  app.use("/api/conversation", registerConversationRoutes(storage));
  
  // Health check route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
