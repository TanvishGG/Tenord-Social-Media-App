import { hash, genSalt, compare } from "bcrypt";
import { createHash, randomBytes, randomUUID } from "crypto";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { sign, verify } from "jsonwebtoken";
import { JWTPayload } from "../schemas/TypeInterfaces";
export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(10);
  return hash(password, salt);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return compare(password, hash);
}

export function generateVerificationToken(): string {
  return randomUUID();
}

export function generateRandomPassword(): string {
  return randomBytes(16).toString("hex");
}

export function generateInviteCode(): string {
  const characters =
    "AB1CDEF2GHJK3LM5NOP4QRSTUV7WXYZ6abcde0fghij8klmnop9rstuvwxyz";
  let result = "";
  let remainingChars = characters.length;
  let chars = characters;

  for (let i = 0; i < 8; i++) {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    const randomIndex = randomValues[0] % remainingChars;

    result += chars[randomIndex];
    chars = chars.slice(0, randomIndex) + chars.slice(randomIndex + 1);
    remainingChars--;
  }

  return result;
}
export function generateSnowflake(): string {
  return DiscordSnowflake.generate().toString();
}

export function signJWT(payload: JWTPayload): string {
  if (!process.env.JWT_SECRET)
    throw new Error("[ERROR] JWT_TOKEN NOT PROVIDED");
  return sign(payload, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
}
export function verifyJWT(token: string): JWTPayload | false {
  if (!token) return false;
  if (!process.env.JWT_SECRET)
    throw new Error("[ERROR] JWT_TOKEN NOT PROVIDED");
  return verify(token, process.env.JWT_SECRET) as JWTPayload;
}

export function generateImageHash(user_id: string): string {
  return createHash("sha256")
    .update(user_id + "_" + Date.now())
    .digest("hex");
}
