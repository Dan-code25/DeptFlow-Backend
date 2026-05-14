import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.js";
import * as Availability from "../models/availability.js";

export const saveAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;

    if (!facultyId) {
      res.status(400).json({ error: "Faculty ID is missing in token." });
      return;
    }

    const prefData = req.body;

    const result = await Availability.saveAvailability(
      facultyId,
      prefData,
    );

    const formattedResult = {
      facultyId: result.faculty_id,
      priority: result.priority,
      maxClassesPerDay: result.max_classes_per_day,
      maxConsecutiveHours: result.max_consecutive_hours,
      timeStart: result.time_start,
      timeEnd: result.time_end,
      preferredDays: result.preferred_days,
      unavailableDays: result.unavailable_days,
      preferredRoomTypes: result.preferred_room_types,
      unavailableTimeSlots: result.unavailable_time_slots,
      subjectSpecializations: result.subject_specializations
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
      facultyId: data.faculty_id,
      priority: data.priority,
      maxClassesPerDay: data.max_classes_per_day,
      maxConsecutiveHours: data.max_consecutive_hours,
      timeStart: data.time_start,
      timeEnd: data.time_end,
      preferredDays: data.preferred_days,
      unavailableDays: data.unavailable_days,
      preferredRoomTypes: data.preferred_room_types,
      unavailableTimeSlots: data.unavailable_time_slots,
      subjectSpecializations: data.subject_specializations
    };

    return res.status(200).json(formattedResponse);
  } catch (error: any) {
    console.error("Fetch Availability Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getFacultyAvailability = async (req: AuthRequest & { params: { facultyId: string } }, res: Response) => {
  try {
    const facultyId = req.user?.id;
    const requestedFacultyId = req.params.facultyId;

    if (!facultyId) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const data = await Availability.getAvailabilityByFacultyId(requestedFacultyId);

    if (!data) {
      return res.status(404).json({ message: "Availability profile not set." });
    }

    const formattedResponse = {
      facultyId: data.faculty_id,
      priority: data.priority,
      maxClassesPerDay: data.max_classes_per_day,
      maxConsecutiveHours: data.max_consecutive_hours,
      timeStart: data.time_start,
      timeEnd: data.time_end,
      preferredDays: data.preferred_days,
      unavailableDays: data.unavailable_days,
      preferredRoomTypes: data.preferred_room_types,
      unavailableTimeSlots: data.unavailable_time_slots,
      subjectSpecializations: data.subject_specializations
    };

    return res.status(200).json(formattedResponse);
  } catch (error: any) {
    console.error("Fetch Availability Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};
    