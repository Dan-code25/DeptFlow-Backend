export interface DecodedToken {
  id: string;
  email: string;
  role: "admin" | "faculty";
  iat: number;
  exp: number;
}
