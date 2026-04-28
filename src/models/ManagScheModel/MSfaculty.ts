import { supabase } from "../../config/supabaseClient.ts";

export const getAll = async () => {
  const { data, error } = await supabase
    .from("faculty")
    .select("*");
  if (error) throw error;
  return data;
};

export const getById = async (id: string) => {
  const { data, error } = await supabase
    .from("faculty")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};