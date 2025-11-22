import { User } from "@prisma/client";

export interface JWTPayload {
  user_id: string;
  signed_at: string;
}

export interface EmailUpdate {
  oldEmail: string;
  newEmail: string;
  user_id: string;
}
export interface PasswordReset {
  user_id: string;
  email: string;
}

export type Verifications = {
  type: "email";
  data: EmailUpdate;
} | {
  type: "register";
  data: Partial<User>;
} | {
  type: "reset-password";
  data: PasswordReset;
}