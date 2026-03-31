import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { Express, Request, Response, NextFunction } from "express";

import { supabase } from "./config/supabaseClient.ts";

import authRoutes from "./routes/authRoutes.ts";
import profileRoutes from "./routes/profileRoutes.ts";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ credentials: true, origin: /^http:\/\/localhost:\d{4}$/ }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

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
