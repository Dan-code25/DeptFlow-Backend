import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Analytics from "../models/analytics.ts";


export const getCoreGroupsDistribution = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;

    if (!facultyId) return res.status(400).json({ error: "Faculty ID is missing in token." });

    const distributionData = await Analytics.countByCoreGroup();
    res.status(200).json(distributionData);

  } catch (error) {
    console.log("Fetching Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics data." });
  }

}


export const getGenderDistribution = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;

    if (!facultyId) return res.status(400).json({ error: "Faculty ID is missing in token." });

    const distributionData = await Analytics.countByGender();
    res.status(200).json(distributionData);
  } catch (error) {
    console.log("Fetching Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics data." });
  }
}

export const getEmploymentTypesDistribution = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;

    if (!facultyId) return res.status(400).json({ error: "Faculty ID is missing in token." });

    const distributionData = await Analytics.countByEmploymentType();
    res.status(200).json(distributionData);
  } catch (error) {
    console.log("Fetching Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics data." });
  }
}

export const fetchRoomUtilization = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;

    if (!facultyId){
      return res.status(400).json({ error: "Faculty ID is missing in token." });
    } 

    const roomUtilizationData = await Analytics.getRoomUtilization();
    res.status(200).json(roomUtilizationData);
    
  } catch (error) {
    console.log("Fetching Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics data." });
  }
};