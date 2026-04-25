import { supabase } from  "../config/supabaseClient.ts";


export const fetchAllAnnouncements = async () => {
  const { data, error } = await supabase
    .from("announcements")
    .select(
      `
      *,
      faculty_profiles (
        first_name,
        last_name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Fetch Error:", error.message);
    throw new Error("Failed to fetch announcements");
  }

  return data;
};


export const createAnnouncement = async (
  userId: string,
  announcementData: Record<string, any>,
  files: Express.Multer.File[] | undefined,
) => {
  let fileUrls: string[] = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const filePath = `announcements/${userId}/${Date.now()}_${file.originalname}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("announcement_files")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });
      
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("announcement_files")
        .getPublicUrl(filePath);

      fileUrls.push(publicUrlData.publicUrl);
    } 
  }

  const announcementPayload = {
    faculty_id: userId,
    title: announcementData.title,
    content: announcementData.content,
    announcement_date: announcementData.announcement_date,
    file_urls: fileUrls,
  };

  const { data: newAnnouncement, error } = await supabase
    .from("announcements")
    .insert(announcementPayload)
    .select(
      `
      *,
      faculty_profiles (
        first_name,
        last_name
      )
      `,
    )
    .single();
    

  if (error) throw error;

  return newAnnouncement;
}

export const deleteAnnouncement = async (facultyId: string, announcementId: string) => {
  const {data: announcement, error: fetchError } = await supabase
    .from("announcements")
    .select("*")
    .eq("announcement_id", announcementId)
    .eq("faculty_id", facultyId)
    .single();
  
  if (fetchError || !announcement) throw fetchError;

  if (announcement.file_urls && announcement.file_urls.length > 0) {

    const filePaths = announcement.file_urls.map((url: string) => {
      const urlParts = url.split("announcement_files/");
      return urlParts[1];
    });

    const { error: deleteError } = await supabase.storage
      .from("announcement_files")
      .remove(filePaths);
    
    if (deleteError) throw deleteError;
  }

  const { error: deleteDbError } = await supabase
    .from("announcements")
    .delete()
    .eq("announcement_id", announcementId)
    .eq("faculty_id", facultyId);

  if (deleteDbError) throw deleteDbError;

  return {success: true, message: "Announcement deleted successfully"};
}
export const updateAnnouncement = async (
  facultyId: string,
  announcementId: string,
  updateData: Record<string, any>,
  files: Express.Multer.File[] | undefined,
) => {
  const { data: oldAnnouncement, error: fetchError } = await supabase
    .from("announcements")
    .select("file_urls")
    .eq("announcement_id", announcementId)
    .eq("faculty_id", facultyId)
    .single();

  if (fetchError || !oldAnnouncement)
    throw new Error("Announcement not found or unauthorized");

  const keptUrls = updateData.keptUrls || [];

  const filesToDelete = oldAnnouncement.file_urls.filter(
    (url: string) => !keptUrls.includes(url),
  );

  if (filesToDelete.length > 0) {
    const paths = filesToDelete.map(
      (url: string) => url.split("announcement_files/")[1],
    );
    await supabase.storage.from("announcement_files").remove(paths);
  }


  let newFileUrls: string[] = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const filePath = `announcements/${facultyId}/${Date.now()}_${file.originalname}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("announcement_files")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("announcement_files")
        .getPublicUrl(filePath);

      newFileUrls.push(publicUrlData.publicUrl);
    }
  }

  const finalUrls = [...keptUrls, ...newFileUrls];

  const { data: updatedAnnouncement, error } = await supabase
    .from("announcements")
    .update({
      title: updateData.title,
      content: updateData.content, 
      announcement_date: updateData.announcement_date,
      file_urls: finalUrls,
    })
    .eq("announcement_id", announcementId)
    .eq("faculty_id", facultyId)
    .select(
      `
      *,
      faculty_profiles (first_name, last_name)
    `,
    ) 
    .single();

  if (error) throw error;

  return updatedAnnouncement;
};



