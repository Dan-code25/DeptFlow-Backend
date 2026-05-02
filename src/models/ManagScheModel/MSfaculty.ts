import { supabase } from "../../config/supabaseClient.ts";

// HELPER: Translates the REAL database columns back into the nested JSON
const formatFacultyData = (item: any) => {
  // 1. Rebuild the 'personal' JSON object using the REAL profiles table
  const personal = {
    firstName: item.first_name,
    lastName: item.last_name,
    // Translate the boolean back into the string the frontend expects
    status: item.is_active ? "Active" : "Inactive", 
    employmentType: item.employment_type,
  };

  // 2. Rebuild the 'preferences' JSON object
  const prefRow = Array.isArray(item.preferences) ? item.preferences[0] : item.preferences;
  
  let preferences = null;
  if (prefRow) {
    preferences = {
      priority: prefRow.priority,
      maxClassesPerDay: prefRow.max_classes_per_day,
      maxConsecutiveHours: prefRow.max_consecutive_hours,
      preferredTimeRange: {
        start: prefRow.time_start,
        end: prefRow.time_end,
      },
      preferredDays: prefRow.preferred_days || [],
      unavailableDays: prefRow.unavailable_days || [],
      preferredRoomTypes: prefRow.preferred_room_types || [],
      unavailableTimeSlots: prefRow.unavailable_time_slots || [],
      subjectSpecializations: prefRow.subject_specializations || [],
    };
  }

  // 3. Return the exact shape the frontend expects
  return {
    id: item.faculty_id, // Grab the primary ID from the new table
    personal,
    preferences,
  };
};

export const getAll = async () => {
  // Join the REAL profile table with the preferences table
  const { data, error } = await supabase
    .from("faculty_profiles")
    .select(`
      faculty_id,
      first_name,
      last_name,
      is_active,
      employment_type,
      preferences:faculty_preferences (
        priority,
        max_classes_per_day,
        max_consecutive_hours,
        time_start,
        time_end,
        preferred_days,
        unavailable_days,
        preferred_room_types,
        unavailable_time_slots,
        subject_specializations
      )
    `);

  if (error) throw error;
  return data.map(formatFacultyData);
};

export const getById = async (id: string) => {
  const { data, error } = await supabase
    .from("faculty_profiles")
    .select(`
      faculty_id,
      first_name,
      last_name,
      is_active,
      employment_type,
      preferences:faculty_preferences (
        priority,
        max_classes_per_day,
        max_consecutive_hours,
        time_start,
        time_end,
        preferred_days,
        unavailable_days,
        preferred_room_types,
        unavailable_time_slots,
        subject_specializations
      )
    `)
    .eq("faculty_id", id)
    .single();

  if (error) throw error;
  return formatFacultyData(data);
};