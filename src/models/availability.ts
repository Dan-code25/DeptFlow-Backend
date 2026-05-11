import { supabase } from  "../config/supabaseClient.ts";

export const saveAvailability = async (
  facultyId: string,
  prefData: any,
) => {
  const { data, error } = await supabase
    .from("faculty_preferences")
    .upsert({
      faculty_id: facultyId,
      priority: prefData.priority || "medium",
      max_classes_per_day: prefData.maxClassesPerDay || 3,
      max_consecutive_hours: prefData.maxConsecutiveHours || 4,
      time_start: prefData.timeStart || "07:00",
      time_end: prefData.timeEnd || "19:00",
      preferred_days: prefData.preferredDays || [],
      unavailable_days: prefData.unavailableDays || [],
      preferred_room_types: prefData.preferredRoomTypes || ["lecture", "lab"],
      unavailable_time_slots: prefData.unavailableTimeSlots || [],
      subject_specializations: prefData.subjectSpecializations || []
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAvailabilityByFacultyId = async (facultyId: string) => {
  const { data, error } = await supabase
    .from("faculty_preferences")
    .select("*")
    .eq("faculty_id", facultyId)
    .maybeSingle();

  if (error) throw error;
  return data;
};