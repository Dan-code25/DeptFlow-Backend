import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { Express, Request, Response, NextFunction } from "express";

import { supabase } from "./config/supabaseClient.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import credentialRoutes from "./routes/credentialRoutes.js";
import researchRoutes from "./routes/researchRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import FacultyRoutes from "./routes/facultyRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import academicPeriodRoutes from "./routes/academicperiodRoutes.js";    
import curriculumsRoutes from "./routes/curriculumRoutes.js";
import otherRoutes from "./routes/MangeScheDRoute/OthRoute.js";

//Dummy routes for testing
import curRoutes from "./routes/MangeScheDRoute/CurRoute.js";
import facRoutes from "./routes/MangeScheDRoute/FacRoute.js";
import romRoutes from "./routes/MangeScheDRoute/RomRoute.js";
import schRoutes from "./routes/MangeScheDRoute/SchRoutes.js";
import subRoutes from "./routes/MangeScheDRoute/subRoute.js";

const app: Express = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://depflow.vercel.app",
      "depflow-ellm8smwa-dan-code25s-projects.vercel.app",
    ],
    credentials: true,
  }),
);
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

app.use("/api/faculty", FacultyRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/availability", availabilityRoutes);

app.use("/api/subjects", subjectRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/schedules", scheduleRoutes);    

app.use("/api/academic-periods", academicPeriodRoutes);

app.use("/api/curriculums", curriculumsRoutes);

app.use("/api/manage-schedule", otherRoutes);



// Dummy routes for testing
app.use("/api/manage-schedule/curriculums", curRoutes);
app.use("/api/manage-schedule/faculty", facRoutes);
app.use("/api/manage-schedule/rooms", romRoutes);
app.use("/api/manage-schedule/schedules", schRoutes);
app.use("/api/manage-schedule/subjects", subRoutes);


// test middleware

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
// ENV validation
const requiredEnvVars = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "JWT_SECRET",
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing environment variables:", missingEnvVars.join(", "));
  process.exit(1); // Stop the server immediately
} else {
  console.log("✅ All environment variables loaded");
}

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});

export default app;