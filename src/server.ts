import "dotenv/config.js";
import express from "express";
import cors from "cors";
import type { Express, Request, Response, NextFunction } from "express";

import { supabase } from "./config/supabaseClient.ts";

import authRoutes from "./routes/authRoutes.ts";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes); 

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

