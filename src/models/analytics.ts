import { supabase } from "../config/supabaseClient.js";

export interface RoomUtilization {
  room_id: string;
  room_name: string;
  used_hours: number;
}

export const countByCoreGroup = async () => {
  const { data, error } = await supabase.from("core_group_counts").select("*");

  if (error) throw error;

  const groups = ["IS CORE", "IT CORE", "CS CORE", "General Education"];

  return groups.map((groupName) => {
    const match = data.find((item) => item.core_group === groupName);
    return {
      coreGroup: groupName,
      count: match ? Number(match.total_count) : 0,
    };
  });
};
export function getCoreGroupsDistribution() {
  throw new Error("Function not implemented.");
}

export const countByGender = async () => {
  const { data, error } = await supabase.from("gender_counts").select("*");

  if (error) throw error;

  return data.map((item: any) => ({
    name: item.gender || "Unassigned",
    value: Number(item.total_count),
  }));
};

export const countByEmploymentType = async () => {
  const { data, error } = await supabase
    .from("employment_type_counts")
    .select("*");

  if (error) throw error;

  return data.map((item: any) => ({
    name: item.employment_type || "Unassigned",
    value: Number(item.total_count),
  }));
};

export const getRoomUtilization = async () => {
  const { data, error } = await supabase
    .from("room_utilization")
    .select("*")
    .order("used_hours", { ascending: false });

  if (error) throw error;

  return (data as RoomUtilization[]) || [];
};