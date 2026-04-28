import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.ts";
import { ScheduleModel } from "../../models/ManagScheModel/MSschedule.ts";

export const getAllSchedules = async (req: AuthRequest, res: Response) => {
  try {
    const data = await ScheduleModel.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetching schedules error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const entry = {
      id: `gen-${Date.now()}`,
      faculty_id:       req.body.faculty_id,
      subject_id:       req.body.subject_id,
      room_id:          req.body.room_id,
      day:              req.body.day,
      start_time:       req.body.start_time,
      end_time:         req.body.end_time,
      section:          req.body.section,
      status:           req.body.status ?? "draft",
      session_group_id: req.body.session_group_id,
      session_hours:    req.body.session_hours,
    };
    const data = await ScheduleModel.create(entry);
    res.status(201).json(data);
  } catch (error) {
    console.error("Creating schedule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSchedule = async (
  req: AuthRequest & { params: { id: string } },
  res: Response
) => {
  try {
    const data = await ScheduleModel.update(req.params.id, req.body);
    res.status(200).json(data);
  } catch (error) {
    console.error("Updating schedule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSchedule = async (
  req: AuthRequest & { params: { id: string } },
  res: Response
) => {
  try {
    await ScheduleModel.delete(req.params.id);
    res.status(200).json({ success: true, message: "Schedule deleted." });
  } catch (error) {
    console.error("Deleting schedule error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};