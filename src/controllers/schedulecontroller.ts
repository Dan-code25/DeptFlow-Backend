import type { Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Schedule from "../models/scheduleassignment.ts";

export const getAllSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const periodId = req.query.periodId ? Number(req.query.periodId) : undefined;
    const schedules = await Schedule.fetchAllSchedules(periodId);
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Fetching schedules error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSchedulesByFaculty = async (
  req: AuthRequest & { params: { facultyId: string } },
  res: Response
) => {
  try {
    const { facultyId } = req.params;
    const periodId = req.query.periodId ? Number(req.query.periodId) : undefined;
    const schedules = await Schedule.fetchSchedulesByFaculty(facultyId);
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Fetching faculty schedules error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMySchedules = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized." });

    const periodId = req.query.periodId ? Number(req.query.periodId) : undefined;
    const schedules = await Schedule.fetchSchedulesByFaculty(facultyId);
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Fetching my schedules error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getScheduleById = async (
  req: AuthRequest & { params: { scheduleId: string } },
  res: Response
) => {
  try {
    const { scheduleId } = req.params;
    const schedule = await Schedule.fetchScheduleById(scheduleId);
    res.status(200).json(schedule);
  } catch (error) {
    console.error("Fetching schedule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const {
      faculty_id,
      other_faculty_id, // optional — nullable
      subject_code,
      room_id,        // optional — nullable
      other_room_id,  // optional — nullable
      period_id,
      day_of_week,
      start_time,
      end_time,
      section,
      status, 
      school_year, // 👈 Must be destructured here
      semester
    } = req.body;

    // room_id is NOT required — it's nullable
    if (!faculty_id && !other_faculty_id || !subject_code || !period_id || !day_of_week || !start_time || !end_time || !section) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const result = await Schedule.createSchedule({
      faculty_id : faculty_id || null,  // Convert to number or null
      other_faculty_id: other_faculty_id || null, // Convert to number or null
      subject_code,
      room_id: room_id ? Number(room_id) : null,   // Convert to number or null
      other_room_id: other_room_id || null,  // Convert to number or null
      period_id: Number(period_id),
      day_of_week,
      start_time,
      end_time,
      section,
      status, 
      school_year: school_year || null,
      semester: semester ? Number(semester) : null
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Creating schedule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editSchedule = async (
  req: AuthRequest & { params: { scheduleId: string } },
  res: Response
) => {
  try {
    const { scheduleId } = req.params;
    const scheduleData = req.body;
    
    // Convert room_id to number or null if provided
    if (scheduleData.room_id !== undefined) {
      scheduleData.room_id = scheduleData.room_id ? Number(scheduleData.room_id) : null;
    }
    
    // Convert period_id to number if provided
    if (scheduleData.period_id !== undefined) {
      scheduleData.period_id = Number(scheduleData.period_id);
    }
    
    const result = await Schedule.updateSchedule(scheduleId, scheduleData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Updating schedule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeSchedule = async (
  req: AuthRequest & { params: { scheduleId: string } },
  res: Response
) => {
  try {
    const { scheduleId } = req.params;
    await Schedule.deleteSchedule(scheduleId);
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Deleting schedule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGeminiContext = async (req: AuthRequest, res: Response) => {
  try {
    const periodId = req.query.periodId ? Number(req.query.periodId) : undefined;
    const context = await Schedule.fetchGeminiScheduleContext(periodId);
    res.status(200).json(context);
  } catch (error: any) {
    console.error("Fetching Gemini context error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};