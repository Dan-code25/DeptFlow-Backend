import { supabase } from "../config/supabaseClient.js";
import type { Education } from "../types/educ.ts";

export const addEducation = async (facultyId: string, educationData: Education) => {
  const { data: newEducationRecord, error } = await supabase
  .from("faculty_education")
    .insert([
      {
        faculty_id: facultyId,
        degree_level: educationData.degreeLevel,
        degree_type: educationData.degreeType,
        major: educationData.major,
        university: educationData.university,
        year_graduated: educationData.yearGraduated,
      },
    ]);

  if (error) {
    throw error;
  }

  return newEducationRecord;
}

export const getEducationById = async (facultyId: string) => {
  const {data: educationData, error} = await supabase
    .from("faculty_education")
    .select("*")
    .eq("faculty_id", facultyId);

  if (error) {
    throw error;
  }

  const formattedEducationData = educationData.map((record) => ({
    edId: record.ed_id,
    degreeLevel: record.degree_level,
    degreeType: record.degree_type,
    major: record.major,
    university: record.university,
    yearGraduated: record.year_graduated
  }));


  return formattedEducationData;
}

export const deleteEducationById = async (educationId: string) => {
  const { error } = await supabase
    .from("faculty_education")
    .delete()
    .eq("ed_id", educationId);

  if (error) {
    throw error;
  }
}