/**
 * Whitelist configuration for allowed users
 * Format: { email: role }
 */

export interface WhitelistEntry {
  email: string;
  role: "faculty" | "admin";
  firstName?: string;
  lastName?: string;
}

export const whitelist: WhitelistEntry[] = [
  {
    email: "admin@example.com",
    role: "admin",
    firstName: "Admin",
    lastName: "User",
  },
  {
    email: "faculty@example.com",
    role: "faculty",
    firstName: "Faculty",
    lastName: "User",
  },
  {
    email: "john.doe@university.edu",
    role: "faculty",
    firstName: "John",
    lastName: "Doe",
  },
  // Add more whitelisted users here
];

/**
 * Check if email is whitelisted and get role
 */
export const getWhitelistedUser = (email: string): WhitelistEntry | null => {
  return (
    whitelist.find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase(),
    ) || null
  );
};
