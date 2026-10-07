import nodemailer from "nodemailer";

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.ADMIN_NOTIFY_EMAIL
  );
}

export async function sendAdminNotification(
  subject: string,
  text: string
): Promise<boolean> {
  if (!isEmailConfigured()) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: process.env.ADMIN_NOTIFY_EMAIL,
      subject,
      text,
    });
    return true;
  } catch (err) {
    console.error("SMTP notification failed:", err);
    return false;
  }
}
