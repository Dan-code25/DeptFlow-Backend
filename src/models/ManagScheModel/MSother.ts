import { supabase } from "../../config/supabaseClient.js";

// Model for Guest Faculty
export const OtherFacultyModel = {
  create: async (name: string) => {
    const { data, error } = await supabase
      .from("other_faculty")
      .insert([{ faculty_name: name }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// Model for Guest Rooms
export const OtherRoomModel = {
  create: async (name: string) => {
    const { data, error } = await supabase
      .from("other_rooms")
      .insert([{ room_name: name }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};