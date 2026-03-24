import type { Request, Response } from "express";

export const googleAuth = async (req: Request, res: Response) => {

  res.status(200).json({ message: "Google authentication successful" });
};