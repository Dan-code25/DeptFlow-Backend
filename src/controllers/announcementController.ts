import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.js";
import * as Announcements from "../models/announcement.js";

type Params <T extends string> = {
  [K in T]: string;
};

type AnnouncementParams = Params<"announcementId">;


export const getAllAnnouncements = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const announcements = await Announcements.fetchAllAnnouncements();
    res.status(200).json(announcements);
    
  } catch (error) {
    console.log("Fetching announcement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const addAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const announcementData = req.body;
    console.log("Announcement Data:", announcementData);
    const files = req.files as Express.Multer.File[] | undefined;

    const result = await Announcements.createAnnouncement(facultyId, announcementData, files);
    console.log("Announcement add:", result);

    res.status(201).json(result);
  } catch (error) {
    console.log("Adding announcement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteAnnouncement = async (req: AuthRequest & {params: AnnouncementParams}, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });
    const announcementId = req.params.announcementId;

    console.log("announcement ID:", announcementId)

    const result = await Announcements.deleteAnnouncement(facultyId, announcementId);

    res.status(200).json(result);
  } catch (error) {
    console.log("Deleting announcement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const editAnnouncement = async (req: AuthRequest & {params: AnnouncementParams}, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });
    const announcementId = req.params.announcementId;
    const updateData = req.body;
    const files = req.files as Express.Multer.File[] | undefined;
    
    const result = await Announcements.updateAnnouncement(facultyId, announcementId, updateData, files);
    res.status(200).json(result);
  } catch (error) {
    console.log("Editing announcement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}