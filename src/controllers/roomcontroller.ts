import type { Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Room from "../models/room.ts";

export const getAllRooms = async (req: AuthRequest, res: Response) => {
  try {
    const rooms = await Room.fetchAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Fetching rooms error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRoomById = async (
  req: AuthRequest & { params: { roomId: string } },
  res: Response
) => {
  try {
    const roomId = Number(req.params.roomId);
    const room = await Room.fetchRoomById(roomId);
    res.status(200).json(room);
  } catch (error) {
    console.error("Fetching room error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addRoom = async (req: AuthRequest, res: Response) => {
  try {
    const roomData = req.body;
    const result = await Room.createRoom(roomData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Creating room error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editRoom = async (
  req: AuthRequest & { params: { roomId: string } },
  res: Response
) => {
  try {
    const roomId = Number(req.params.roomId);
    const roomData = req.body;
    const result = await Room.updateRoom(roomId, roomData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Updating room error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeRoom = async (
  req: AuthRequest & { params: { roomId: string } },
  res: Response
) => {
  try {
    const roomId = Number(req.params.roomId);
    await Room.deleteRoom(roomId);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Deleting room error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};