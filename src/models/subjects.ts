import { supabase } from "../config/supabaseClient.ts";

export const fetchSubjects = async () => {
  const { data: subjectData, error } = await supabase.from("subjects").select("*");
  if (error) throw error;
  return [...subjectData];
}


// Added Line for Manage Schedule Page (Backend) 

export const fetchAllSubjects = async () => {
  const { data, error } = await supabase
    .from("subjects")
    .select(
      `
      subject_code,
      subject_name,
      units
      `
    )
    .or(
      "subject_code.like.CS%,subject_code.like.CC%,subject_code.like.IS%,subject_code.like.IT%"
    )
    .order("subject_code", { ascending: true });

  if (error) throw error;

  return [...data];
};

export const fetchSubjectByCode = async (subjectCode: string) => {
  const { data, error } = await supabase
    .from("subjects")
    .select(`
      subject_code,
      subject_name,
      units,
      created_at
    `)
    .eq("subject_code", subjectCode)
    .single();

  if (error) throw error;

  return {
    code: data.subject_code,
    name: data.subject_name,
    units: data.units,
    createdAt: data.created_at,
  };
};

export const createSubject = async (subjectData: {
  subject_code: string;
  subject_name: string;
  units: number;
}) => {
  const { data, error } = await supabase
    .from("subjects")
    .insert([subjectData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSubject = async (
  subjectCode: string,
  subjectData: Partial<{ subject_name: string; units: number }>
) => {
  const { data, error } = await supabase
    .from("subjects")
    .update(subjectData)
    .eq("subject_code", subjectCode)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSubject = async (subjectCode: string) => {
  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("subject_code", subjectCode);

  if (error) throw error;
  return true;
};