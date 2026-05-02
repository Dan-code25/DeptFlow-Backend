import { supabase } from "../config/supabaseClient.ts";

// HELPER: This translates the 3 database tables back into the 1 JSON block the frontend expects
const formatCurriculumData = (data: any[]) => {
  return data.map((curr) => ({
    id: curr.id,
    program: curr.program,
    sections: curr.sections.map((sec: any) => ({
      // CHANGE 1: Dynamically glue the label back together for the frontend (e.g., "BSCS 1-A")
      label: `${sec.label} ${sec.year_level}-${sec.section}`, 
      section: sec.section,
      semester: sec.semester,
      yearLevel: sec.year_level, 
      subjectIds: sec.subjects.map((sub: any) => sub.subject_id), 
    })),
  }));
};

// 1. Fetch all curriculums (Grabs data from all 3 tables at once)
export const fetchAllCurriculums = async () => {
  const { data, error } = await supabase
    .from("curriculums")
    .select(`
      id,
      program,
      sections:curriculum_sections (
        id,
        label,
        section,
        semester,
        year_level,
        subjects:curriculum_section_subjects (
          subject_id
        )
      )
    `)
    .order("program", { ascending: true });

  if (error) {
    console.error("Supabase error fetching all curriculums:", error);
    throw error;
  }
  
  return formatCurriculumData(data);
};

// 2. Fetch a single curriculum
export const fetchCurriculumByProgram = async (program: string) => {
  const { data, error } = await supabase
    .from("curriculums")
    .select(`
      id,
      program,
      sections:curriculum_sections (
        id,
        label,
        section,
        semester,
        year_level,
        subjects:curriculum_section_subjects (
          subject_id
        )
      )
    `)
    .eq("program", program)
    .single();

  if (error) {
    console.error(`Supabase error fetching curriculum for program ${program}:`, error);
    throw error;
  }
  
  return formatCurriculumData([data])[0];
};

// 3. Create a new curriculum (The 3-Step Split)
export const createCurriculum = async (curriculumData: {
  program: string;
  sections: any[]; 
}) => {
  // STEP 1: Insert the parent program
  const { data: programData, error: programError } = await supabase
    .from("curriculums")
    .insert([{ program: curriculumData.program }])
    .select()
    .single();

  if (programError) throw programError;

  // STEP 2: Loop and insert the child sections
  if (curriculumData.sections && curriculumData.sections.length > 0) {
    for (const section of curriculumData.sections) {
      const { data: sectionData, error: sectionError } = await supabase
        .from("curriculum_sections")
        .insert([{
          curriculum_id: programData.id,
          // CHANGE 2: Chop "BSCS 1-A" at the space and only save "BSCS" to satisfy the database ENUM
          label: section.label.split(" ")[0], 
          section: section.section,
          semester: section.semester,
          year_level: section.yearLevel
        }])
        .select()
        .single();

      if (sectionError) throw sectionError;

      // STEP 3: Loop and insert the grandchild subjects
      if (section.subjectIds && section.subjectIds.length > 0) {
        const subjectsToInsert = section.subjectIds.map((subId: string) => ({
          section_id: sectionData.id,
          subject_id: subId,
        }));

        const { error: subjectsError } = await supabase
          .from("curriculum_section_subjects")
          .insert(subjectsToInsert);

        if (subjectsError) throw subjectsError;
      }
    }
  }

  return fetchCurriculumByProgram(curriculumData.program);
};

// 4. Update an existing curriculum (Wipe the old sections, insert the new ones)
export const updateCurriculum = async (
  program: string,
  curriculumData: Partial<{ program: string; sections: any[] }>
) => {
  const existing = await fetchCurriculumByProgram(program);
  
  if (!existing) {
  throw new Error(`Curriculum ${program} not found.`);
  }

  if (curriculumData.program && curriculumData.program !== program) {
    await supabase.from("curriculums").update({ program: curriculumData.program }).eq("program", program);
  }

  if (curriculumData.sections) {
    // Delete old sections (which auto-deletes old subjects)
    await supabase.from("curriculum_sections").delete().eq("curriculum_id", existing.id);
    
    // Re-run the 3-step insert logic for the new sections
    for (const section of curriculumData.sections) {
      const { data: sectionData } = await supabase
        .from("curriculum_sections")
        .insert([{
          curriculum_id: existing.id,
          // CHANGE 3: Apply the same chopping logic here for updates
          label: section.label.split(" ")[0], 
          section: section.section,
          semester: section.semester,
          year_level: section.yearLevel
        }])
        .select()
        .single();

      if (section.subjectIds && section.subjectIds.length > 0) {
        const subjectsToInsert = section.subjectIds.map((subId: string) => ({
          section_id: sectionData!.id,
          subject_id: subId,
        }));
        await supabase.from("curriculum_section_subjects").insert(subjectsToInsert);
      }
    }
  }

  return fetchCurriculumByProgram(curriculumData.program || program);
};

// 5. Delete a curriculum
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