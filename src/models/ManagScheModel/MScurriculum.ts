import { supabase } from "../../config/supabaseClient.ts";

export const CurriculumModel = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("curriculums")
      .select("*");
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("curriculums")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
};