import type { Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Period from "../models/academicperiod.ts";

export const getAllPeriods = async (req: AuthRequest, res: Response) => {
  try {
    const periods = await Period.fetchAllPeriods();
    res.status(200).json(periods);
  } catch (error) {
    console.error("Fetching periods error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCurrentPeriod = async (req: AuthRequest, res: Response) => {
  try {
    const period = await Period.fetchCurrentPeriod();
    res.status(200).json(period);
  } catch (error) {
    console.error("Fetching current period error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addPeriod = async (req: AuthRequest, res: Response) => {
  try {
    const periodData = req.body;
    const result = await Period.createPeriod(periodData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Creating period error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const activatePeriod = async (
  req: AuthRequest & { params: { periodId: string } },
  res: Response
) => {
  try {
    const periodId = Number(req.params.periodId);
    const result = await Period.setCurrentPeriod(periodId);
    res.status(200).json({ message: "Academic period activated.", data: result });
  } catch (error) {
    console.error("Activating period error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};