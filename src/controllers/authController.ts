import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { authenticateUser } from "../models/profile.ts";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage",
);
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const jwtSecret = process.env.JWT_SECRET;

export const googleAuth = async (req: Request, res: Response) => {
  const { code } = req.body;

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

    const { sub: googleId, email } = payload;

    const userData = await authenticateUser(googleId!, email!);
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
