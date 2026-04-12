import { supabase } from "../config/supabaseClient.ts";

export const fetchSubjects = async () => {
  const { data: subjectData, error } = await supabase.from("subjects").select("*");
  if (error) throw error;
  return [...subjectData];
}