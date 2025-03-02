import nodemailer from "nodemailer";

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
    from: process.env.EMAIL_USER,
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
    "Verify your account",
    `Click this link to verify your account: ${process.env.WEBSITE_BASE}/api/auth/verify/${token}`,
  );
}
export async function sendPasswordResetEmail(
  to: string,
  token: string,
): Promise<void> {
  await sendEmail(
    to,
    "Reset your password",
    `Click this link to reset your password: ${process.env.WEBSITE_BASE}/api/auth/verify/${token}`,
  );
}

export async function sendEmailChangeEmail(
  to: string,
  token: string,
): Promise<void> {
  await sendEmail(
    to,
    "Change your email",
    `Click this link to change your email: ${process.env.WEBSITE_BASE}/api/auth/verify/${token}`,
  );
}
