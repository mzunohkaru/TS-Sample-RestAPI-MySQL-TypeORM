import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import authRoutes from "./routes/authRoutes";
import {
  securityMiddleware,
  generalLimiter,
  corsOptions,
  requestLoggingMiddleware,
} from "./middleware/security.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use(securityMiddleware);
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use(requestLoggingMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "🔐 Secure API Server",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

const gracefulShutdown = () => {
  console.log("Received shutdown signal, shutting down gracefully...");

  AppDataSource.destroy()
    .then(() => {
      console.log("Database connection closed.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error during database shutdown:", error);
      process.exit(1);
    });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is Running!!! http://localhost:${PORT}`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error("❌ Server error:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
