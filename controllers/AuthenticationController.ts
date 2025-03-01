import { Request, Response } from "express";
import LoginSchema from "../schemas/LoginSchema";
import {
  comparePassword,
  generateSnowflake,
  generateVerificationToken,
  signJWT,
} from "../utils/HashUtils";
import RegisterSchema from "../schemas/RegisterSchema";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail } from "../utils/EmailUtils";
export async function LoginController(req: Request, res: Response) {
  try {
    const data = LoginSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error });
      return;
    }
    const prisma = (await req.app.get("prisma")) as PrismaClient;
    const user = await prisma.user.findFirst({
      where: {
        email: data.data.email,
      },
    });
    if (!user) {
      res.status(404).json({ error: "Email not found" });
      return;
    }
    if (!(await comparePassword(data.data.password, user.password))) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }
    const token = signJWT({
      email: user.email,
      user_id: user.user_id,
      password: user.password,
    });
    res.status(200).cookie("auth", token).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function RegisterController(req: Request, res: Response) {
  try {
    const data = RegisterSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ error: data.error });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: data.data.email,
      },
    });
    if (existingEmail) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: data.data.username,
      },
    });
    if (existingUsername) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }
    const token = generateVerificationToken();
    req.app.get("pendingRegistrations").set(token, data.data);
    setTimeout(
      () => req.app.get("pendingRegistrations").delete(data.data.email),
      1000 * 60 * 60 * 24,
    );
    await sendVerificationEmail(data.data.email, token);
    res.status(201).json({ message: "Verification Email Sent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function VerifyController(req: Request, res: Response) {
  try {
    const token = req.params.token as string;
    console.log(token);
    const user = req.app.get("pendingRegistrations").get(token);
    if (!user) {
      res.status(404).json({ error: "Token not found" });
      return;
    }
    const prisma = req.app.get("prisma") as PrismaClient;
    await prisma.user.create({
      data: { ...user, user_id: generateSnowflake(), nickname: user.username },
    });
    req.app.get("pendingRegistrations").delete(token);
    res.status(201).redirect("/login?verified=true");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
