import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { Express, Request, Response, NextFunction } from "express";

import { supabase } from "./config/supabaseClient.ts";

import authRoutes from "./routes/authRoutes.ts";
import profileRoutes from "./routes/profileRoutes.ts";
import educationRoutes from "./routes/educationRoutes.ts";
import credentialRoutes from "./routes/credentialRoutes.ts";
import researchRoutes from "./routes/researchRoutes.ts";
import announcementRoutes from "./routes/announcementRoutes.ts";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ credentials: true, origin: /^http:\/\/localhost:\d{4}$/ }));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/education", educationRoutes);

app.use("/api/credentials", credentialRoutes);

app.use("/api/research", researchRoutes);

app.use("/api/announcements", announcementRoutes);

app.use("/test", (req: Request, res: Response) => {
  res.json({ message: "API is working!" });
});

//db connection test
try {
  const { data, error } = await supabase.from("auth_google").select("*");
  if (error) throw error;
  console.log("--Connected to Supabase");
} catch (error) {
  console.error("--Supabase connection failed:", error);
}


app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});

export default app;
