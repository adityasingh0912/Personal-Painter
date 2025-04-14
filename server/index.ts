import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the path to the .env file
const envPath = path.resolve(__dirname, '../.env'); // Assuming .env is one directory level up from server directory

console.log("Configuring dotenv..."); // Added log before dotenv.config()
dotenv.config({ path: envPath });
console.log("dotenv configuration complete."); // Added log after dotenv.config()

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

console.log(process.env); // Debugging: Print all environment variables - AFTER dotenv.config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// ... (previous code remains the same)

(async () => {
  const server = await registerRoutes(app);

  // ... (error handler middleware)

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({
    port,
    host: "127.0.0.1",
    // removed reusePort: true
  }, () => {
    // Update log message to reflect the specific address
    log(`serving on http://127.0.0.1:${port}`);
  });
})();