import nodemailer from "nodemailer";
import { NAME, WEB_DOMAIN } from "../config";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });
  await transporter.sendMail({
    from: `"${NAME} Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
export async function sendVerificationEmail(
  to: string,
  token: string,
): Promise<void> {
  await sendEmail(
    to,
    "VERIFY YOUR ACCOUNT",
    `Click this link to verify your account: ${WEB_DOMAIN}/api/auth/verify/${token}`,
  );
}
export async function sendPasswordResetEmail(
  to: string,
  token: string,
): Promise<void> {
  await sendEmail(
    to,
    "RESET YOUR PASSWORD",
    `Click this link to reset your password: ${WEB_DOMAIN}/api/auth/verify/${token}`,
  );
}

export async function sendEmailChangeEmail(
  to: string,
  token: string,
): Promise<void> {
  await sendEmail(
    to,
    "Change your email",
    `Click this link to change your email: ${WEB_DOMAIN}/api/auth/verify/${token}`,
  );
}
