import type { RequestHandler } from "express";
import { OtherFacultyModel, OtherRoomModel } from "../../models/ManagScheModel/MSother.js";
import { supabase } from "../../config/supabaseClient.js";

export const createOtherFaculty: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body as { name: string };
    
    // 1. Check if this guest already exists
    const { data: existing } = await supabase
      .from("other_faculty")
      .select("id")
      .ilike("faculty_name", name) // Case-insensitive search
      .single();

    if (existing) {
      return res.status(200).json(existing); // Return existing ID
    }

    // 2. Otherwise, create new
    const { data: newData, error } = await supabase
      .from("other_faculty")
      .insert([{ faculty_name: name }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(newData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOtherRoom: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body as { name: string };
    
    // 1. Check if this guest already exists
    const { data: existing } = await supabase
      .from("other_rooms")
      .select("id")
      .ilike("room_name", name) // Case-insensitive search
      .single();

    if (existing) {
      return res.status(200).json(existing); // Return existing ID
    }

    // 2. Otherwise, create new
    const { data: newData, error } = await supabase
      .from("other_rooms")
      .insert([{ room_name: name }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(newData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Add these two functions to the bottom of the file
export const getOtherFaculty: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabase.from("other_faculty").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOtherRooms: RequestHandler = async (req, res) => {
  try {
    const { data, error } = await supabase.from("other_rooms").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};