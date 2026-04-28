import { supabase } from "../../config/supabaseClient.ts";

export const RoomModel = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("id, room, type, capacity");
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("rooms")
      .select("id, room, type, capacity")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
};