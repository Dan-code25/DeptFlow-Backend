import { supabase } from "../../config/supabaseClient.js";

export const ScheduleModel = {
  getAll: async (schoolYear?: string, sem?: string) => {
    
    // 1. Build a dynamic filter object
    const filters: Record<string, any> = {};
    
    if (schoolYear) {
      filters.school_year = schoolYear;
    }
    
    if (sem) {
      filters.semester = Number(sem);
    }
    
    const { data, error } = await supabase
      .from("schedule_assignments")
      .select("*")
      .match(filters);
    
    if (error) throw error;
    return data;
  },

  create: async (entry: {
    schedule_id: string;
    faculty_id?: string | null;
    other_faculty_id?: string;
    subject_id: string;
    room_id?: string | null;
    other_room_id?: string | null;
    day: string;
    start_time: string;
    end_time: string;
    section: string;
    status: "draft" | "finalized" | "published";
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
    faculty_id?: string | null;
    other_faculty_id?: string | null;
    subject_id: string;
    room_id?: string | null;
    other_room_id?: string | null;
    day: string;
    start_time: string;
    end_time: string;
    section: string;
    status: "draft" | "finalized" | "published";
    session_group_id: string;
    session_hours: number;
  }>) => {
    const { data, error } = await supabase
      .from("schedule_assignments")   // ✅ fixed dash → underscore
      .update(fields)
      .eq("schedule_id", id)
      .select()
    if (error) throw error;
    console.log(`[MSschedule] update result for ${id}:`, data);
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from("schedule_assignments")
      .delete()
      .eq("schedule_id", id);
    if (error) throw error;
  },
};