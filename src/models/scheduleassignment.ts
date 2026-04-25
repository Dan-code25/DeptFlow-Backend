import { supabase } from "../config/supabaseClient.ts";

export const fetchAllSchedules = async (periodId?: number) => {
  let query = supabase
    .from("schedule_assignments")
    .select(`
      schedule_id,
      faculty_id,
      subject_code,
      room_id,
      period_id,
      day_of_week,
      start_time,
      end_time,
      section,
      is_ai_generated,
      created_at,
      faculty_profiles (
        faculty_id,
        first_name,
        last_name,
        employment_type
      ),
      subjects (
        subject_code,
        subject_name,
        units
      ),
      rooms (
        room_id,
        room_no,
        is_lab
      ),
      academic_periods (
        period_id,
        semester,
        academic_year,
        is_current
      )
    `)
    .order("day_of_week", { ascending: true });

  if (periodId) {
    query = query.eq("period_id", periodId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map((s: any) => ({
    id: s.schedule_id,                        // uuid string
    facultyId: s.faculty_id,                  // uuid string
    facultyName: `${s.faculty_profiles?.first_name ?? ""} ${s.faculty_profiles?.last_name ?? ""}`.trim(),
    employmentType: s.faculty_profiles?.employment_type ?? "",
    subjectCode: s.subject_code,
    subjectName: s.subjects?.subject_name ?? "",
    units: s.subjects?.units ?? 0,
    roomId: s.room_id,                        // uuid string
    room: s.rooms?.room_no ?? "",
    isLab: s.rooms?.is_lab ?? false,
    periodId: s.period_id,                    // int8
    semester: s.academic_periods?.semester ?? "",
    academicYear: s.academic_periods?.academic_year ?? "",
    day: s.day_of_week,
    startTime: s.start_time,
    endTime: s.end_time,
    section: s.section,
    isAiGenerated: s.is_ai_generated,
    createdAt: s.created_at,
  }));
};

export const fetchSchedulesByFaculty = async (
  facultyId: string,
  periodId?: number
) => {
  let query = supabase
    .from("schedule_assignments")
    .select(`
      schedule_id,
      faculty_id,
      subject_code,
      room_id,
      period_id,
      day_of_week,
      start_time,
      end_time,
      section,
      is_ai_generated,
      created_at,
      subjects (
        subject_code,
        subject_name,
        units
      ),
      rooms (
        room_id,
        room_no,
        is_lab
      ),
      academic_periods (
        period_id,
        semester,
        academic_year,
        is_current
      )
    `)
    .eq("faculty_id", facultyId)
    .order("day_of_week", { ascending: true });

  if (periodId) {
    query = query.eq("period_id", periodId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map((s: any) => ({
    id: s.schedule_id,
    facultyId: s.faculty_id,
    subjectCode: s.subject_code,
    subjectName: s.subjects?.subject_name ?? "",
    units: s.subjects?.units ?? 0,
    roomId: s.room_id,
    room: s.rooms?.room_no ?? "",
    isLab: s.rooms?.is_lab ?? false,
    periodId: s.period_id,
    semester: s.academic_periods?.semester ?? "",
    academicYear: s.academic_periods?.academic_year ?? "",
    day: s.day_of_week,
    startTime: s.start_time,
    endTime: s.end_time,
    section: s.section,
    isAiGenerated: s.is_ai_generated,
    createdAt: s.created_at,
  }));
};

export const fetchScheduleById = async (scheduleId: string) => {  // uuid string
  const { data, error } = await supabase
    .from("schedule_assignments")
    .select(`
      schedule_id,
      faculty_id,
      subject_code,
      room_id,
      period_id,
      day_of_week,
      start_time,
      end_time,
      section,
      is_ai_generated,
      created_at,
      faculty_profiles (
        first_name,
        last_name,
        employment_type
      ),
      subjects (
        subject_code,
        subject_name,
        units
      ),
      rooms (
        room_id,
        room_no,
        is_lab
      ),
      academic_periods (
        period_id,
        semester,
        academic_year,
        is_current
      )
    `)
    .eq("schedule_id", scheduleId)
    .single();

  if (error) throw error;

  return {
    id: data.schedule_id,
    facultyId: data.faculty_id,
    facultyName: `${(data as any).faculty_profiles?.first_name ?? ""} ${(data as any).faculty_profiles?.last_name ?? ""}`.trim(),
    employmentType: (data as any).faculty_profiles?.employment_type ?? "",
    subjectCode: data.subject_code,
    subjectName: (data as any).subjects?.subject_name ?? "",
    units: (data as any).subjects?.units ?? 0,
    roomId: data.room_id,
    room: (data as any).rooms?.room_no ?? "",
    isLab: (data as any).rooms?.is_lab ?? false,
    periodId: data.period_id,
    semester: (data as any).academic_periods?.semester ?? "",
    academicYear: (data as any).academic_periods?.academic_year ?? "",
    day: data.day_of_week,
    startTime: data.start_time,
    endTime: data.end_time,
    section: data.section,
    isAiGenerated: data.is_ai_generated,
    createdAt: data.created_at,
  };
};

export const createSchedule = async (scheduleData: {
  faculty_id: string;    // uuid
  subject_code: string;  // text
  room_id: number | null;       // ← int8 or null (optional)
  period_id: number;     // int8
  day_of_week: string;
  start_time: string;
  end_time: string;
  section: string;
  is_ai_generated?: boolean;
}) => {
  const { data, error } = await supabase
    .from("schedule_assignments")
    .insert([{
      ...scheduleData,
      is_ai_generated: scheduleData.is_ai_generated ?? false,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSchedule = async (
  scheduleId: string,       // uuid
  scheduleData: Partial<{
    faculty_id: string;
    subject_code: string;
    room_id: number | null;
    period_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    section: string;
    is_ai_generated: boolean;
  }>
) => {
  const { data, error } = await supabase
    .from("schedule_assignments")
    .update(scheduleData)
    .eq("schedule_id", scheduleId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSchedule = async (scheduleId: string) => {  // uuid
  const { error } = await supabase
    .from("schedule_assignments")
    .delete()
    .eq("schedule_id", scheduleId);

  if (error) throw error;
  return true;
};

// ── Gemini context builder ─────────────────────────────────────────────────
export const fetchGeminiScheduleContext = async (periodId?: number) => {
  const schedules = await fetchAllSchedules(periodId);

  const { data: facultyData, error: facultyError } = await supabase
    .from("faculty_profiles")
    .select("faculty_id, first_name, last_name, employment_type")
    .eq("is_active", true);

  if (facultyError) throw facultyError;

  const { data: loadData, error: loadError } = await supabase
    .from("load_policies")
    .select("emp_type, max_units");

  if (loadError) throw loadError;

  const loadMap = new Map(loadData.map((l: any) => [l.emp_type, l.max_units]));

  const assignedUnitsMap = new Map<string, number>();
  for (const s of schedules) {
    const current = assignedUnitsMap.get(s.facultyId) ?? 0;
    assignedUnitsMap.set(s.facultyId, current + s.units);
  }

  const faculty = facultyData.map((f: any) => ({
    id: f.faculty_id,
    name: `${f.first_name} ${f.last_name}`.trim(),
    employmentType: f.employment_type,
    maxUnits: loadMap.get(f.employment_type) ?? 21,
    assignedUnits: assignedUnitsMap.get(f.faculty_id) ?? 0,
  }));

  const { data: subjectData, error: subjectError } = await supabase
    .from("subjects")
    .select("subject_code, subject_name, units");

  if (subjectError) throw subjectError;

  const subjects = subjectData.map((s: any) => ({
    id: s.subject_code,
    code: s.subject_code,
    name: s.subject_name,
    units: s.units,
  }));

  const geminiSchedules = schedules.map((s) => ({
    id: s.id,
    facultyName: s.facultyName,
    subjectCode: s.subjectCode,
    subjectName: s.subjectName,
    section: s.section,
    room: s.room,
    day: s.day,
    startTime: s.startTime,
    endTime: s.endTime,
    status: "active",
  }));

  return { faculty, subjects, schedules: geminiSchedules };
};