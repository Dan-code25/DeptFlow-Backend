import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.js";
import {
  fetchUserProfileById,
  updateProfileData,
  updateProfilePicture,
  uploadImageToBucket,
} from "../models/profile.js";

export const getPersonalInfo = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) {
      return res.status(400).json({ error: "Faculty ID is missing in token." });
    }

    const userProfile = await fetchUserProfileById(facultyId);
    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
};

export const updatePersonalInfo = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    const userRole = req.user?.role;
    console.log("UPDATE REQUEST BODY:", req.body);
    if (!facultyId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Faculty ID is missing." });
    }

    const {
      firstName,
      middleName,
      lastName,
      birthDate,
      email,
      contactNumber,
      gender,
      age,
      city,
      province,
      // Admin-only fields
      employmentType,
      employeeId,
      dateHired,
      designation,
    } = req.body;

    const facultyUpdateData: Record<string, any> = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      birthdate: birthDate,
      email: email,
      contact_number: contactNumber,
      gender: gender,
      city: city,
      province: province,
      age: age,
    };

    if (req.user?.role === "admin") {
      Object.assign(facultyUpdateData, {
        employment_type: employmentType,
        employee_id: employeeId,
        date_hired: dateHired,
        designation: designation,
      });
    }

    if (Object.keys(facultyUpdateData).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update." });
    }

    const updatedProfile = await updateProfileData(
      facultyId,
      facultyUpdateData,
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

export const updateProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    const file = req.file;

    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });
    if (!file) return res.status(400).json({ error: "No file uploaded." });

    const photoUrl = await uploadImageToBucket(facultyId, file);
    const updatedProfile = await updateProfilePicture(facultyId, photoUrl);

    return res.status(200).json({
      message: "Profile photo updated successfully",
      profilePicture: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile photo:", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

export const getProfilePhoto = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;

    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const userProfile = await fetchUserProfileById(facultyId);

    if (!userProfile.photoUrl) {
      return res.status(404).json({ error: "Profile photo not found." });
    }

    return res.status(200).json({ photoUrl: userProfile.photoUrl });
  } catch (error) {
    console.error("Error fetching profile photo:", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};
