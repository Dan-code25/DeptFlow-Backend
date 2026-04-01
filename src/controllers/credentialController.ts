import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Credentials from "../models/credentials.ts";


type Params <T extends string> = {
  [K in T]: string;
};

type CertificationParams = Params<"certificationId">;
type LicenseParams = Params<"licenseId">;
type SeminarParams = Params<"seminarId">;
type WorkExperienceParams = Params<"workExperienceId">;

export const getAllCredentials = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const credentials = await Credentials.fetchAllCredentials(facultyId);
    res.status(200).json(credentials);

  } catch (error) {
    console.log("Fetching all credentials error:", error);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
}

export const addCertification = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const certificationData = req.body;
    console.log(certificationData);

    const newCredential = await Credentials.createCertification(facultyId, certificationData);
    res.status(201).json(newCredential);

  } catch (error) {
    console.log("Adding certification error:", error);
    res.status(500).json({ error: "Failed to add certification" });
  }
}


export const deleteCertification = async (req: AuthRequest & { params: CertificationParams }, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const certificationId = req.params.certificationId;
    console.log(certificationId);

    const deleteResult = await Credentials.deleteCertification(facultyId, certificationId);
    res.status(200).json(deleteResult);

  } catch (error) {
    console.log("Deleting certification error:", error);
    res.status(500).json({ error: "Failed to delete certification" });
  }
}

export const addLicense = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const licenseData = req.body;
    console.log("LICENSE DATA:", licenseData);

    const newLicense = await Credentials.createLicense(facultyId, licenseData);
    res.status(201).json(newLicense);

  } catch (error) {
    console.log("Adding license error:", error);
    res.status(500).json({ error: "Failed to add license" });
  }
}

export const deleteLicense = async (req: AuthRequest & { params: LicenseParams }, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const licenseId = req.params.licenseId;
    console.log("LICENSE ID TO DELETE:", licenseId);

    const deleteResult = await Credentials.deleteLicense(facultyId, licenseId);
    res.status(200).json(deleteResult);

  } catch (error) {
    console.log("Deleting license error:", error);
    res.status(500).json({ error: "Failed to delete license" });
  }
}

export const addSeminar = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const seminarData = req.body;
    console.log("SEMINAR DATA:", seminarData);

    const newSeminar = await Credentials.createSeminar(facultyId, seminarData);
    res.status(201).json(newSeminar);

  } catch (error) {
    console.log("Adding seminar error:", error);
    res.status(500).json({ error: "Failed to add seminar" });
  }
}

export const deleteSeminar = async (req: AuthRequest & { params: SeminarParams }, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const seminarId = req.params.seminarId;
    console.log("SEMINAR ID TO DELETE:", seminarId);

    const deleteResult = await Credentials.deleteSeminar(facultyId, seminarId);
    res.status(200).json(deleteResult);

  } catch (error) {
    console.log("Deleting seminar error:", error);
    res.status(500).json({ error: "Failed to delete seminar" });
  }
}

export const addWorkExperience = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const workExperienceData = req.body;
    console.log("WORK EXPERIENCE DATA:", workExperienceData);

    const newWorkExperience = await Credentials.createWorkExperience(facultyId, workExperienceData);
    res.status(201).json(newWorkExperience);

  } catch (error) {
    console.log("Adding work experience error:", error);
    res.status(500).json({ error: "Failed to add work experience" });
  }
}

export const deleteWorkExperience = async (req: AuthRequest & { params: WorkExperienceParams }, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const workExperienceId = req.params.workExperienceId;
    console.log("WORK EXPERIENCE ID TO DELETE:", workExperienceId);

    const deleteResult = await Credentials.deleteWorkExperience(facultyId, workExperienceId);
    res.status(200).json(deleteResult);

  } catch (error) {
    console.log("Deleting work experience error:", error);
    res.status(500).json({ error: "Failed to delete work experience" });
  }
}