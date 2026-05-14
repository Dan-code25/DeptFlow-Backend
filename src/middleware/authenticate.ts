import type { Request, Response, NextFunction } from "express";
import jwt, { type VerifyErrors } from "jsonwebtoken"; // Import VerifyErrors here
import type { DecodedToken } from "../types/auth.js";

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token; // Assuming you made the cookie change!
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
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
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Requires Admin privileges." });
  }
};
