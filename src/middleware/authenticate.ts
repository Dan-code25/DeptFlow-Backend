import type { Request, Response, NextFunction } from "express";
import jwt, { type VerifyErrors } from "jsonwebtoken";
import type { DecodedToken } from "../types/auth.ts";

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // --- BYPASS FOR TESTING ---
  // This checks if you are in development mode OR you can just leave it 
  // hardcoded while you test your APIs.
  if (process.env.NODE_ENV === "development" || true) { 
    req.user = { 
      id: "a4cae1b6-db64-4c95-be70-c0dd291e9369", 
      role: "admin", 
      email: "test@tup.edu.ph" 
    } as DecodedToken;
    return next();
  }
  // --------------------------

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: VerifyErrors | null, decoded: unknown) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
      }
      req.user = decoded as DecodedToken;
      next();
    },
  );
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // If the bypass above is active, this will read the "admin" role 
  // from our mock user and allow access.
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Requires Admin privileges." });
  }
};