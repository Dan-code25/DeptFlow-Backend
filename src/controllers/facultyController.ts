import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Faculty from "../models/profile.ts";
import * as Education from "../models/education.ts";
import * as Credentials from "../models/credentials.ts";
import * as Research from "../models/research.ts";

export const  getFacultyDashboard = async (req: AuthRequest, res: Response) => {
  try {
    // const facultyId = req.user?.id;
    // if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const facultyProfile = await Faculty.fetchAllFacultyProfiles();
    res.status(200).json(facultyProfile);

  } catch (error) {
    console.log("Fetching faculty error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const whitelistFaculty = async (req: AuthRequest, res: Response) => {
  try {
    // const facultyId = req.user?.id;
    // if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const facultyData = req.body;
    console.log("FACULTY DATA:", facultyData)
    const result = await Faculty.addNewFaculty(facultyData);
    res.status(201).json(result);
    
  } catch (error) {
    console.log("Adding new faculty error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteFaculty = async (req: AuthRequest & { params: { facultyId: string } }, res: Response) => {
  try {
    // const facultyId = req.user?.id;
    // if (!facultyId) return res.status(401).json({ error: "Unauthorized" });
    
    const { facultyId } = req.params;
    await Faculty.deleteFaculty(facultyId);
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.log("Deleting faculty error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const fetchFacultyProfilePicture = async (req: AuthRequest & { params: { facultyId: string } }, res: Response) => {
  try {
    const { facultyId } = req.params;
    console.log("Faculty Id", facultyId)
    const photoUrl = await Faculty.getProfilePicture(facultyId);
    res.status(200).json({ photoUrl });
  } catch (error) { 
    console.log("Fetching profile picture error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const fetchFacultyProfile = async (req: AuthRequest & { params: { facultyId: string } }, res: Response) => {
  try {
    const { facultyId } = req.params;
    console.log("Faculty Id", facultyId)
    const profile = await Faculty.fetchUserProfileById(facultyId);
    res.status(200).json(profile);
  } catch (error) {
    console.log("Fetching faculty profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const fetchFacultyEducation = async (req: AuthRequest & { params: { facultyId: string } }, res: Response) => {
  try {
    const { facultyId } = req.params;
    console.log("Faculty Id", facultyId)
    const education = await Education.getEducationById(facultyId);
    console.log("Education:", education);
    res.status(200).json(education);
  } catch (error) {
    console.log("Fetching faculty education error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getFacultyCredentials = async (req: AuthRequest & { params: { facultyId: string } }, res: Response) => {
  try {
    const { facultyId } = req.params;
    const credentials = await Credentials.fetchAllCredentials(facultyId);
    res.status(200).json(credentials);
  } catch (error) {
    console.log("Fetching faculty credentials error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getFacultyResearch = async (req: AuthRequest & { params: { facultyId: string } }, res: Response) => {
  try {
    const { facultyId } = req.params;
    const research = await Research.fetchAllResearch(facultyId);
    res.status(200).json(research);
  } catch (error) {
    console.log("Fetching faculty research error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
