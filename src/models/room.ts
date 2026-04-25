import { supabase } from "../config/supabaseClient.ts";

export const fetchAllRooms = async () => {
  const { data, error } = await supabase
    .from("rooms")
    .select(`
      room_id,
      room_no,
      is_lab
    `)
    .order("room_no", { ascending: true });

  if (error) throw error;

  return data.map((r) => ({
    id: r.room_id,
    roomNo: r.room_no,
    isLab: r.is_lab,
    type: r.is_lab ? "lab" : "lecture",
  }));
};

export const fetchRoomById = async (roomId: number) => {
  const { data, error } = await supabase
    .from("rooms")
    .select(`
      room_id,
      room_no,
      is_lab
    `)
    .eq("room_id", roomId)
    .single();

  if (error) throw error;

  return {
    id: data.room_id,
    roomNo: data.room_no,
    isLab: data.is_lab,
    type: data.is_lab ? "lab" : "lecture",
  };
};

export const createRoom = async (roomData: {
  room_no: string;
  is_lab: boolean;
}) => {
  const { data, error } = await supabase
    .from("rooms")
    .insert([roomData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateRoom = async (
  roomId: number,
  roomData: Partial<{ room_no: string; is_lab: boolean }>
) => {
  const { data, error } = await supabase
    .from("rooms")
    .update(roomData)
    .eq("room_id", roomId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRoom = async (roomId: number) => {
  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("room_id", roomId);

  if (error) throw error;
  return true;
};