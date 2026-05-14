import { supabase } from "../config/supabaseClient.js";

export const fetchAllResearch = async (facultyId: string) => {
  const { data, error } = await supabase
    .from("faculty_research")
    .select("*")
    .eq("faculty_id", facultyId);

  if (error) {
    throw new Error(error.message);
  }

  console.log("Research:", data)

  return data;
};

export const createResearch = async (
  userId: string,
  researchData: Record<string, any>,
) => {
  const researchPayload = {
    faculty_id: userId,
    title: researchData.title,
    research_type: researchData.type,
    journal_conference: researchData.journalConference,
    published_year: researchData.year, 
  };

  const { data: newResearch, error: dbError } = await supabase
    .from("faculty_research")
    .insert([researchPayload])
    .select()
    .single();
  
  if (dbError) throw dbError;
  return newResearch;
}

export const deleteResearch = async (researchId: string) => {
  const { error } = await supabase
    .from("faculty_research")
    .delete()
    .eq("res_id", researchId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, message: "Research entry deleted successfully" };
};