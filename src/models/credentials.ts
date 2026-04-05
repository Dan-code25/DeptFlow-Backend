import e from "express";
import { supabase } from "../config/supabaseClient.ts";
import { title } from "node:process";


export const fetchAllCredentials = async (facultyId: string) => {
  const [certifications, licenses, seminars, workExperiences] = await Promise.all([
    supabase
      .from("faculty_certifications")
      .select("*")
      .eq("faculty_id", facultyId),
    supabase
      .from("faculty_licenses")
      .select("*")
      .eq("faculty_id", facultyId),
    supabase
      .from("faculty_seminars")
      .select("*")
      .eq("faculty_id", facultyId),
    supabase
      .from("faculty_work_experience")
      .select("*")
      .eq("faculty_id", facultyId),
  ]);

  if (certifications.error) throw certifications.error;
  if (licenses.error) throw licenses.error;
  if (seminars.error) throw seminars.error;
  if (workExperiences.error) throw workExperiences.error;

  return {
    certifications: certifications.data || [],
    licenses: licenses.data || [],
    seminars: seminars.data || [],
    workExperiences: workExperiences.data || [],
  };
}


export const createCertification = async (
  userId: string,
  credentialData: Record<string, any>,
) => {

  const certificationPayload = {
    faculty_id: userId,
    title: credentialData.title,
    organization: credentialData.organization,
    year_obtained: credentialData.yearObtained, 
  };

  const { data: newCredential, error: dbError } = await supabase
    .from("faculty_certifications")
    .insert([certificationPayload])
    .select()
    .single();

  if (dbError) throw dbError;
  return newCredential;
};

export const deleteCertification = async (facultyId: string, certificationId: string) => {
  const { error: deleteError } = await supabase
    .from("faculty_certifications")
    .delete()
    .eq("cert_id", certificationId)
    .eq("faculty_id", facultyId);
  
  if (deleteError) throw deleteError;

  return { success: true, message: "Certification deleted successfully." };
}

export const createLicense = async (
  userId: string,
  credentialData: Record<string, any>,
) => {
  const licensePayload = {
    faculty_id: userId,
    title: credentialData.title,
    authority: credentialData.issuingAuthority,
    year_obtained: credentialData.yearObtained, 
  };

  const { data: newLicense, error: dbError } = await supabase
    .from("faculty_licenses")
    .insert([licensePayload])
    .select()
    .single();

  if (dbError) throw dbError;
  return newLicense;

}

export const deleteLicense = async (facultyId: string, licenseId: string) => {
  const { error: deleteError } = await supabase
    .from("faculty_licenses")
    .delete()
    .eq("license_id", licenseId)
    .eq("faculty_id", facultyId);
  
  if (deleteError) throw deleteError;

  return { success: true, message: "License deleted successfully." };
}

export const createSeminar = async (
  userId: string,
  credentialData: Record<string, any>,
) => {
  const seminarPayload = {
    faculty_id: userId,
    title: credentialData.title,
    organizer: credentialData.organizer,
    year_attended: credentialData.yearObtained, 
  };

  const { data: newSeminar, error: dbError } = await supabase
    .from("faculty_seminars")
    .insert([seminarPayload])
    .select()
    .single();

  if (dbError) throw dbError;
  return newSeminar;

}

export const deleteSeminar = async (facultyId: string, seminarId: string) => {
  const { error: deleteError } = await supabase
    .from("faculty_seminars")
    .delete()
    .eq("seminar_id", seminarId)
    .eq("faculty_id", facultyId);
  
  if (deleteError) throw deleteError;

  return { success: true, message: "Seminar deleted successfully." };
}

export const createWorkExperience = async (
  userId: string,
  credentialData: Record<string, any>,
) => {
  const workExperiencePayload = {
    faculty_id: userId,
    job_title: credentialData.title,
    company: credentialData.company,
    start_year: credentialData.startYear, 
    end_year: credentialData.endYear, 
  };

  const { data: newWorkExperience, error: dbError } = await supabase
    .from("faculty_work_experience")
    .insert([workExperiencePayload])
    .select()
    .single();

  if (dbError) throw dbError;
  return newWorkExperience;

}

export const deleteWorkExperience = async (facultyId: string, workExperienceId: string) => {
  const { error: deleteError } = await supabase
    .from("faculty_work_experience")
    .delete()
    .eq("work_exp_id", workExperienceId)
    .eq("faculty_id", facultyId);

  if (deleteError) throw deleteError;

  return { success: true, message: "Work experience deleted successfully." };

}

