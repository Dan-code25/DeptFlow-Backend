import { supabase } from "../config/supabaseClient.ts";

export const authenticateUser = async (googleId: string, email: string) => {
  const { data: user, error: fetchError } = await supabase
    .from("faculty_profiles")
    .select("role")
    .eq("email", email)
    .single();

  if (fetchError || !user) {
    console.error("Error fetching user by email:", fetchError);
    return null;
  }

  // -- COMMENTED OUT FOR NOW --

  // if(!user.google_id) {
  //   const { data: updatedUser, error: updateError } = await supabase
  //     .from("faculty_profiles")
  //     .update({ google_id: googleId })
  //     .eq("email", email)
  //     .single();

  //   if (updateError || !updatedUser) {
  //     console.error("Error updating user with Google ID:", updateError);
  //     return null;
  //   }
    
  //   return updatedUser;
  // }

  return user;
}