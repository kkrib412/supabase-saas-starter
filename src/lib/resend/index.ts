import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.EMAIL_FROM ?? "noreply@example.com";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "SaaS App";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to ${APP_NAME}!`,
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Your account is ready. Get started at <a href="${APP_URL}/dashboard">${APP_URL}/dashboard</a>.</p>
      <p>— The ${APP_NAME} team</p>
    `,
  });
}

export async function sendPaymentFailedEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Action required: payment failed`,
    html: `
      <h1>Hi ${name},</h1>
      <p>We couldn't process your last payment. Please update your billing info to keep your account active.</p>
      <p><a href="${APP_URL}/dashboard/billing">Update billing →</a></p>
      <p>— The ${APP_NAME} team</p>
    `,
  });
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Reset your ${APP_NAME} password`,
    html: `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">Reset password →</a></p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });
}
