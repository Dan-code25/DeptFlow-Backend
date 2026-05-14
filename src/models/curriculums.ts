import { supabase } from "../config/supabaseClient.js";

// Fetch all curriculums (Programs and their nested sections)
export const fetchAllCurriculums = async () => {
  const { data, error } = await supabase
    .from("curriculums")
    .select("*")
    .order("program", { ascending: true });

  if (error) {
    console.error("Supabase error fetching all curriculums:", error);
    throw error;
  }
  return data;
};

// Fetch a single curriculum by Program Name (e.g., 'BSCS')
export const fetchCurriculumByProgram = async (program: string) => {
  const { data, error } = await supabase
    .from("curriculums")
    .select("*")
    .eq("program", program)
    .single();

  if (error) {
    console.error(`Supabase error fetching curriculum for program ${program}:`, error);
    throw error;
  }
  return data;
};

// Create a new curriculum entry
export const createCurriculum = async (curriculumData: {
  program: string;
  sections: any[]; // Using any[] for the JSONB structure, or define an interface
}) => {
  const { data, error } = await supabase
    .from("curriculums")
    .insert([curriculumData])
    .select()
    .single();

  if (error) {
    console.error("Supabase error creating curriculum:", error);
    throw error;
  }
  return data;
};

// Update an existing curriculum (e.g., adding/removing subjects from a section)
export const updateCurriculum = async (
  program: string,
  curriculumData: Partial<{ program: string; sections: any[] }>
) => {
  const { data, error } = await supabase
    .from("curriculums")
    .update(curriculumData)
    .eq("program", program)
    .select()
    .single();

  if (error) {
    console.error(`Supabase error updating curriculum for program ${program}:`, error);
    throw error;
  }
  return data;
};

// Delete a curriculum
export const deleteCurriculum = async (program: string) => {
  const { error } = await supabase
    .from("curriculums")
    .delete()
    .eq("program", program);

  if (error) {
    console.error(`Supabase error deleting curriculum for program ${program}:`, error);
    throw error;
  }
  return true;
};