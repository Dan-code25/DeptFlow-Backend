import { supabase } from "../config/supabaseClient.ts";

export const authenticateUser = async (googleId: string, email: string) => {
  const { data: profile, error: profileError } = await supabase
    .from("faculty_profiles")
    .select("faculty_id, role, is_active")
    .eq("email", email)
    .single();

  if (profileError || !profile) {
    console.error("Access Denied: Email not whitelisted.");
    return null;
  }

  if (!profile.is_active) {
    console.error("Access Denied: Account is deactivated.");
    return null;
  }

  const { data: authRecord, error: authError } = await supabase
    .from("auth_google")
    .select("google_id")
    .eq("faculty_id", profile.faculty_id)
    .single();

  if (!authRecord) {
    const { error: linkError } = await supabase.from("auth_google").insert([
      {
        google_id: googleId,
        faculty_id: profile.faculty_id,
        last_login: new Date().toISOString(),
      },
    ]);

    if (linkError) {
      console.error("Error linking Google account:", linkError);
      return null;
    }
  } else {
    await supabase
      .from("auth_google")
      .update({ last_login: new Date().toISOString() })
      .eq("faculty_id", profile.faculty_id);
  }

  return {
    id: profile.faculty_id,
    role: profile.role,
    email: email,
  };
};

export const fetchUserProfileById = async (facultyId: string) => {
  const { data, error } = await supabase
    .from("faculty_profiles")
    .select(
      `
      faculty_id,
      employee_id,
      first_name,
      middle_name,
      last_name,
      email,
      gender,
      city,
      province,
      employment_type,
      role,
      age,
      birthdate,
      date_hired,
      designation,
      photo_url,
      contact_number
    `,
    )
    .eq("faculty_id", facultyId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }

  const formattedProfile = {
    facultyId: data.faculty_id,
    employeeId: data.employee_id,
    firstName: data.first_name,
    middleName: data.middle_name,
    lastName: data.last_name,
    email: data.email,
    gender: data.gender,
    city: data.city,
    province: data.province,
    employmentType: data.employment_type,
    role: data.role,
    age: data.age,
    birthdate: data.birthdate,
    dateHired: data.date_hired,
    designation: data.designation,
    photoUrl: data.photo_url,
    contactNumber: data.contact_number,
  };

  return formattedProfile;
};

export const updateProfileData = async (facultyId: string, data: object) => {

  const { data: updatedRecord, error } = await supabase
    .from("faculty_profiles")
    .update(data)
    .eq("faculty_id", facultyId)
    .select()
    .single();

  if (error) throw error;
  return updatedRecord;
};

export const updateProfilePicture = async (
  facultyId: string,
  photoUrl: string,
) => {
  const { data: updatedRecord, error } = await supabase
    .from("faculty_profiles")
    .update({ photo_url: photoUrl })
    .eq("faculty_id", facultyId)
    .select()
    .single();

  if (error) throw error;
  console.log("PHOTO URL: ", updatedRecord.photo_url);
  return updatedRecord.photo_url;
};

export const uploadImageToBucket = async (
  facultyId: string,
  file: Express.Multer.File,
) => {

  const filePath = `profiles/${facultyId}`;

  const { data, error } = await supabase.storage
    .from("profile_photos")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from("profile_photos")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};