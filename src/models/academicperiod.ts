import { supabase } from "../config/supabaseClient.ts";

export const fetchAllPeriods = async () => {
  const { data, error } = await supabase
    .from("academic_periods")
    .select(`
      period_id,
      semester,
      academic_year,
      is_current
    `)
    .order("period_id", { ascending: false });

  if (error) throw error;

  return data.map((p) => ({
    id: p.period_id,
    semester: p.semester,
    academicYear: p.academic_year,
    isCurrent: p.is_current,
  }));
};

export const fetchCurrentPeriod = async () => {
  const { data, error } = await supabase
    .from("academic_periods")
    .select(`
      period_id,
      semester,
      academic_year,
      is_current
    `)
    .eq("is_current", true)
    .single();

  if (error) throw error;

  return {
    id: data.period_id,
    semester: data.semester,
    academicYear: data.academic_year,
    isCurrent: data.is_current,
  };
};

export const createPeriod = async (periodData: {
  semester: string;
  academic_year: string;
  is_current?: boolean;
}) => {
  // If new period is current, unset all others first
  if (periodData.is_current) {
    await supabase
      .from("academic_periods")
      .update({ is_current: false })
      .eq("is_current", true);
  }

  const { data, error } = await supabase
    .from("academic_periods")
    .insert([{ ...periodData, is_current: periodData.is_current ?? false }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const setCurrentPeriod = async (periodId: number) => {
  // Unset all
  await supabase
    .from("academic_periods")
    .update({ is_current: false })
    .eq("is_current", true);

  // Set new current
  const { data, error } = await supabase
    .from("academic_periods")
    .update({ is_current: true })
    .eq("period_id", periodId)
    .select()
    .single();

  if (error) throw error;
  return data;
};