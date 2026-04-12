import { supabase } from "../config/supabaseClient.ts";

export const saveAvailability = async (
  facultyId: string,
  availabilityData: any,
) => {
  const { data, error } = await supabase
    .from("faculty_availability")
    .upsert({
      faculty_id: facultyId,
      subject_ids: availabilityData.subjectIds,
      subject_names: availabilityData.subjectNames,
      day_time_ranges: availabilityData.dayTimeRanges,
      scheduling_priority: availabilityData.schedulingPriority,
      additional_notes: availabilityData.additionalNotes,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAvailabilityByFacultyId = async (facultyId: string) => {
  const { data, error } = await supabase
    .from("faculty_availability")
    .select("*")
    .eq("faculty_id", facultyId)
    .maybeSingle();

  if (error) throw error;
  return data;
};