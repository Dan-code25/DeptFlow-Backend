import { supabase } from "../../config/supabaseClient.ts";

export const CurriculumModel = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("curriculums")
      .select(`*,curriculum_sections!fk_curriculum (*),curriculum_term_subjects (*)`);
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("curriculums")
      .select(`*,curriculum_sections!fk_curriculum (*),curriculum_term_subjects (*)`)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  setupSections: async (schoolYear: string, semester: number, counts: Record<string, Record<number, number>>) => {
    const generatedSections = [];
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    // --- SCHOOL YEAR FORMATTER ---
    // Converts "2024-2025" -> "24" + "25" -> 2425 (as an integer)
    const [startYear, endYear] = schoolYear.split("-");
    const formattedSchoolYear = parseInt((startYear?.slice(-2) || "") + (endYear?.slice(-2) || ""));

    // 1. Fetch all curriculums (Selecting program)
    const { data: curriculums, error: currErr } = await supabase
      .from("curriculums")
      .select("id, program");
      
    if (currErr) throw currErr;

    // 2. Build the insert array
    for (const [program, yearData] of Object.entries(counts)) {
      // FIX: Check both program_ and program columns to guarantee a match
      const curriculum = curriculums.find((c: any) => 
        c.program === program
      );
      
      if (!curriculum) continue;

      for (const [yearStr, numSections] of Object.entries(yearData)) {
        // Only generate if the user put a number greater than 0
        for (let i = 0; i < (numSections as number); i++) {
          generatedSections.push({
            curriculum_id: curriculum.id,
            label: `${program}`, // e.g. "BSCS 1-A"
            section: letters[i], // e.g. "A"
            year_level: parseInt(yearStr), // e.g. 1
            school_year: formattedSchoolYear, // e.g. 2425
          });
        }
      }
    }

    if (generatedSections.length === 0) {
      throw new Error("No valid sections generated from the provided counts.");
    }

    // 3. Insert into database
    const { error: insertErr } = await supabase
      .from("curriculum_sections")
      .insert(generatedSections);

    if (insertErr) throw insertErr;

    return generatedSections;
  },
};