import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.ts";
import { RoomModel } from "../../models/ManagScheModel/MSroom.ts";

export const getAllRooms = async (req: AuthRequest, res: Response) => {
  try {
    const data = await RoomModel.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetching rooms error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRoomById = async (
  req: AuthRequest & { params: { id: string } },
  res: Response
) => {
  try {
    const roomId = req.params.id;
    const data = await RoomModel.getById(roomId);
    
    if (!data) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Fetching room by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};