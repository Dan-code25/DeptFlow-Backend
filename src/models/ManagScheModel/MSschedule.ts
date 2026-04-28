import { supabase } from "../../config/supabaseClient.ts";

export const ScheduleModel = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("schedule_assignments")
      .select("*");
    if (error) throw error;
    return data;
  },

  create: async (entry: {
    id: string;
    faculty_id: string;
    subject_id: string;
    room_id: string;
    day: string;
    start_time: string;
    end_time: string;
    section: string;
    status: "draft" | "finalized";
    session_group_id?: string;
    session_hours?: number;
  }) => {
    const { data, error } = await supabase
      .from("schedule_assignments")   // ✅ removed trailing space
      .insert(entry)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, fields: Partial<{
    faculty_id: string;
    subject_id: string;
    room_id: string;
    day: string;
    start_time: string;
    end_time: string;
    section: string;
    status: "draft" | "finalized";
    session_group_id: string;
    session_hours: number;
  }>) => {
    const { data, error } = await supabase
      .from("schedule_assignments")   // ✅ fixed dash → underscore
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("schedule_assignments")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};