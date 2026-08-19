/**
 * emailService.js
 * Handles portfolio emails using Nodemailer + SMTP.
 * Security: Escapes HTML to prevent XSS. Disable URL/File access.
 * Upgraded: Premium UI, Apple System Fonts, Light/Dark mode native email support.
 */
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const requiredEmailEnv = ["EMAIL_USER", "EMAIL_APP_PASSWORD", "CONTACT_RECEIVER_EMAIL"];
for (const variable of requiredEmailEnv) {
  if (!process.env[variable]) console.warn(`⚠️ Missing email environment variable: ${variable}`);
}

const BRAND = {
  name: "Skand Ahuja",
  role: "Full-Stack Systems & Data Engineer"
};

const INQUIRY_LABELS = {
  job_opportunity: "Job Opportunity",
  collaboration: "Collaboration",
  freelance: "Freelance Project",
  general: "General Inquiry",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
  disableFileAccess: true,
  disableUrlAccess: true,
});

export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP connected successfully");
  } catch (error) {
    console.error("❌ Gmail SMTP connection failed:", error.message);
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function formatMessage(value) {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

/**
 * generateEmailHtml
 * Generates a premium Light/Dark mode compatible responsive email template.
 */
const generateEmailHtml = (preheader, title, content, cta = "") => `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title}</title>
  <style>
    /* Modern Apple-like System Fonts */
    body, table, td, div, p, a {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    }
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    .wrapper { background-color: #f5f7fb; }
    .card { background-color: #ffffff; border: 1px solid #e5e7eb; }
    .text-primary { color: #172033; }
    .text-muted { color: #667085; }
    .bg-accent { background-color: #6366f1; }
    .box { background-color: #f8f9fd; border: 1px solid #e5e7eb; }
    
    @media (prefers-color-scheme: dark) {
      .wrapper { background-color: #0f1115 !important; }
      .card { background-color: #1a1d24 !important; border: 1px solid #2d3139 !important; }
      .text-primary { color: #f3f4f6 !important; }
      .text-muted { color: #9ca3af !important; }
      .box { background-color: #1f232b !important; border: 1px solid #2d3139 !important; }
    }
  </style>
</head>
<body class="wrapper" style="margin: 0; padding: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  <div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapper">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-radius: 16px; overflow: hidden;" class="card">
          <tr><td height="6" class="bg-accent" style="line-height: 6px; font-size: 6px;">&nbsp;</td></tr>
          <tr>
            <td style="padding: 40px;">
              <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #6366f1; margin-bottom: 16px;">${BRAND.name.toUpperCase()}</div>
              <h1 class="text-primary" style="margin: 0 0 24px 0; font-size: 26px; font-weight: 700; line-height: 1.3;">${title}</h1>
              <div class="text-primary" style="font-size: 16px; line-height: 1.6;">${content}</div>
              ${cta}
            </td>
          </tr>
          <tr>
            <td class="box" style="padding: 24px 40px; text-align: center; border-top-width: 1px; border-top-style: solid;">
              <p class="text-muted" style="margin: 0; font-size: 12px; line-height: 1.5;">${BRAND.name} &bull; ${BRAND.role}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export async function sendContactNotification({ name, email, inquiryType, company, message }) {
  const inquiryLabel = INQUIRY_LABELS[inquiryType] || "General Inquiry";
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = company ? escapeHtml(company) : "Not provided";
  const safeMessage = formatMessage(message);

  const content = `
    <p class="text-muted" style="margin-bottom: 24px;">Someone reached out through your portfolio.</p>
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr><td width="30%" class="text-muted" style="padding: 8px 0; font-size: 14px;"><strong>Name</strong></td><td class="text-primary" style="padding: 8px 0; font-size: 14px;">${safeName}</td></tr>
      <tr><td class="text-muted" style="padding: 8px 0; font-size: 14px;"><strong>Email</strong></td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${safeEmail}" style="color: #6366f1; text-decoration: none;">${safeEmail}</a></td></tr>
      <tr><td class="text-muted" style="padding: 8px 0; font-size: 14px;"><strong>Reason</strong></td><td class="text-primary" style="padding: 8px 0; font-size: 14px;">${escapeHtml(inquiryLabel)}</td></tr>
      <tr><td class="text-muted" style="padding: 8px 0; font-size: 14px;"><strong>Company</strong></td><td class="text-primary" style="padding: 8px 0; font-size: 14px;">${safeCompany}</td></tr>
    </table>
    <div class="box" style="padding: 20px; border-radius: 12px; margin-bottom: 30px;">
      <p class="text-primary" style="margin: 0; font-size: 15px; line-height: 1.6;">${safeMessage}</p>
    </div>
  `;

  const cta = `<a href="mailto:${safeEmail}" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 8px;">Reply to ${safeName}</a>`;
  
  const text = `New message from ${name} (${email})\nReason: ${inquiryLabel}\nCompany: ${safeCompany}\n\nMessage:\n${message}`;

  const mailOptions = {
    from: `"${BRAND.name} Portfolio" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_RECEIVER_EMAIL,
    replyTo: email,
    subject: `${inquiryLabel} · ${name}`,
    text,
    html: generateEmailHtml(`New ${inquiryLabel.toLowerCase()} from ${safeName}`, "New Message Received", content, cta),
    headers: { "X-Entity-Ref-ID": `portfolio-contact-${Date.now()}` },
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send contact notification:", error.message);
    return { success: false, error: error.message };
  }
}

export async function sendAutoReply({ name, email }) {
  const safeName = escapeHtml(name);
  const content = `
    <p class="text-primary" style="margin-bottom: 20px; font-size: 16px;">Hi ${safeName},</p>
    <p class="text-muted" style="margin-bottom: 24px; font-size: 16px;">Thanks for getting in touch through my portfolio. I've received your message and will get back to you within <strong>24 to 48 hours</strong>.</p>
    <div class="box" style="padding: 20px; border-radius: 12px; margin-bottom: 30px;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #6366f1; font-size: 14px;">While you're here</p>
      <p class="text-primary" style="margin: 0; font-size: 15px; line-height: 1.6;">Feel free to connect with me on <a href="https://github.com/skand-ahuja" style="color: #6366f1; text-decoration: none; font-weight: 600;">GitHub</a> or <a href="https://linkedin.com/in/skand-ahuja" style="color: #6366f1; text-decoration: none; font-weight: 600;">LinkedIn</a>.</p>
    </div>
    <p class="text-primary" style="margin: 0; font-size: 15px;">Best regards,<br><strong>${BRAND.name}</strong></p>
  `;
  
  const text = `Hi ${name},\n\nThanks for reaching out! I will get back to you within 24-48 hours.\n\nBest,\n${BRAND.name}`;

  const mailOptions = {
    from: `"${BRAND.name}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Thanks for reaching out!",
    text,
    html: generateEmailHtml("Thanks for reaching out to Skand Ahuja.", "Thanks for reaching out!", content),
    headers: { "X-Entity-Ref-ID": `portfolio-auto-reply-${Date.now()}` },
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send auto-reply:", error.message);
    return { success: false, error: error.message };
  }
}