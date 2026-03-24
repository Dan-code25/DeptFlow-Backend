export interface User {
  id: string;
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "faculty" | "admin";
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoogleAuthPayload {
  token: string; // Google ID token
}

export interface AuthResponse {
  token: string;
  user: Omit<User, "googleId">;
}
