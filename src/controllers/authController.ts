import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { authenticateUser, fetchGoogleProfile } from "../models/profile.ts";
import type { AuthRequest } from "../middleware/authenticate.ts";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage",
);
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const jwtSecret = process.env.JWT_SECRET;

export const googleAuth = async (req: Request, res: Response) => {
  console.log("🔵 Google auth endpoint hit");
  const { code } = req.body;
  console.log("Code received:", code);

  try {
    if (!code) {
      return res.status(400).json({ error: "Authorization code is missing" });
    }

    const { tokens } = await googleClient.getToken(code);
    if (!tokens.id_token) {
      return res
        .status(400)
        .json({ error: "No ID token received from Google" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: googleClientId!,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ error: "Unauthorized user" });
    }

    if (!payload.email.endsWith("@tup.edu.ph")) {
      return res.status(403).json({
        error: "Please use your @tup.edu.ph institutional email to sign in.",
      });
    }

    const { sub: googleId, email, picture } = payload;

    const userData = await authenticateUser(googleId!, email!, picture!);
    if (!userData) {
      return res.status(500).json({ error: "User authentication failed" });
    }

    const jwtToken = jwt.sign(
      {
        sub: payload.sub,
        email: payload.email,
        role: userData.role,
        id: userData.id,
      },
      jwtSecret!,
      { expiresIn: "7d" },
    );

    res.cookie("token", jwtToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json({ user: payload, userInfo: userData });
  } catch (error) {
    console.error("Google authentication failed:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

export const verifyAuth = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log(req.user);

    const profileUrl = await fetchGoogleProfile(req.user.id);

    res.status(200).json({
      user: { ...req.user, picture: profileUrl },
      userInfo: { role: req.user.role },
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout failed:", error);
    res.status(500).json({ error: "Failed to log out" });
  }
}