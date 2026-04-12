import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Availability from "../models/availability.ts";

export const saveAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;

    if (!facultyId) {
      res.status(400).json({ error: "Faculty ID is missing in token." });
      return;
    }

    const availabilityData = req.body;

    const result = await Availability.saveAvailability(
      facultyId!,
      availabilityData,
    );

    const formattedResult = {
      id: result.faculty_id,
      subjectIds: result.subject_ids,
      subjectNames: result.subject_names,
      dayTimeRanges: result.day_time_ranges,
      schedulingPriority: result.scheduling_priority,
      additionalNotes: result.additional_notes,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    };

    res
      .status(200)
      .json({
        message: "Availability saved successfully.",
        data: formattedResult,
      });
  } catch (error) {
    console.log("Saving Availability Error:", error);
    res.status(500).json({ error: "Failed to save availability." });
  }
};

export const getMyAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id; 

    if (!facultyId) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const data = await Availability.getAvailabilityByFacultyId(facultyId);

    if (!data) {
      return res.status(404).json({ message: "Availability profile not set." });
    }

    const formattedResponse = {
      id: `avail-${data.faculty_id.substring(0, 3)}`,
      subjectIds: data.subject_ids,
      subjectNames: data.subject_names,
      dayTimeRanges: data.day_time_ranges,
      schedulingPriority: data.scheduling_priority,
      additionalNotes: data.additional_notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return res.status(200).json(formattedResponse);
  } catch (error: any) {
    console.error("Fetch Availability Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};