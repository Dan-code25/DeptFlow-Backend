import { supabase } from "../../config/supabaseClient.ts";
export const SubjectModel = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*");
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("subject_code", id)
      .single();
    if (error) throw error;
    return data;
  },
};