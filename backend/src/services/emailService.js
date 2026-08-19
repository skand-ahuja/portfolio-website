/**
 * emailService.js
 *
 * Handles all portfolio emails using Nodemailer + Gmail SMTP.
 *
 * Emails:
 * 1. Contact notification → Skand
 * 2. Auto-reply → person who submitted the form
 *
 * Security:
 * - Credentials are stored only in environment variables.
 * - User-controlled HTML is escaped before being inserted into emails.
 * - Reply-To is used instead of putting visitor email in the From field.
 * - Plain-text versions are included for better compatibility and deliverability.
 * - File/URL access is disabled in Nodemailer.
 */

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* ============================================================
   ENVIRONMENT VALIDATION
   ============================================================ */

const requiredEmailEnv = [
  "EMAIL_USER",
  "EMAIL_APP_PASSWORD",
  "CONTACT_RECEIVER_EMAIL",
];

for (const variable of requiredEmailEnv) {
  if (!process.env[variable]) {
    console.warn(
      `⚠️ Missing email environment variable: ${variable}`
    );
  }
}

/* ============================================================
   BRAND CONFIGURATION
   ============================================================ */

const BRAND = {
  name: "Skand Ahuja",
  role: "Full-Stack Systems & Data Engineer",
  accent: "#6366f1",
  accentDark: "#4f46e5",
  text: "#172033",
  muted: "#667085",
  border: "#e5e7eb",
  background: "#f5f7fb",
  card: "#ffffff",
};

/* ============================================================
   INQUIRY LABELS
   ============================================================ */

const INQUIRY_LABELS = {
  job_opportunity: "Job Opportunity",
  collaboration: "Collaboration",
  freelance: "Freelance Project",
  general: "General Inquiry",
};


/* ============================================================
   NODEMAILER TRANSPORT
   ============================================================ */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },

  /*
   * Security:
   * Prevent Nodemailer from loading local files or remote URLs
   * through message content.
   */
  disableFileAccess: true,
  disableUrlAccess: true,
});

/* ============================================================
   VERIFY EMAIL CONNECTION
   ============================================================ */

/**
 * Tests the Gmail SMTP connection during server startup.
 */
export async function verifyEmailConnection() {
  try {
    await transporter.verify();

    console.log("✅ Gmail SMTP connected successfully");
  } catch (error) {
    console.error(
      "❌ Gmail SMTP connection failed:",
      error.message
    );

    console.error(
      "   Check EMAIL_USER and EMAIL_APP_PASSWORD in your .env file"
    );
  }
}

/* ============================================================
   HTML ESCAPING
   ============================================================ */

/**
 * Escapes user-controlled values before placing them inside HTML.
 *
 * This prevents HTML injection inside notification emails.
 */
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Converts newline characters to HTML line breaks
 * after safely escaping the original text.
 */
function formatMessage(value) {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

/* ============================================================
   CONTACT NOTIFICATION EMAIL
   ============================================================ */

/**
 * Sends the contact form submission to Skand.
 */
export async function sendContactNotification({
  name,
  email,
  inquiryType,
  company,
  message,
}) {
  const inquiryLabel =
    INQUIRY_LABELS[inquiryType] || "General Inquiry";

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company);
  const safeMessage = formatMessage(message);

  const submittedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  /* ==========================================================
     PLAIN TEXT VERSION
     Better compatibility and useful for mail clients that
     don't render HTML.
     ========================================================== */

  const text = `
New portfolio contact message

Name: ${name}
Email: ${email}
Reason: ${inquiryLabel}
Company: ${company || "Not provided"}

Message:
${message}

Submitted: ${submittedAt}

Reply directly to this email to respond to ${name}.
  `.trim();

  /* ==========================================================
     HTML EMAIL
     Table-based layout is intentional because email clients
     have very inconsistent CSS support.
     ========================================================== */

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>New Portfolio Message</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: ${BRAND.background};
    font-family: Arial, Helvetica, sans-serif;
    color: ${BRAND.text};
  "
>

  <!-- Preheader -->
  <div
    style="
      display: none;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      color: transparent;
    "
  >
    New ${escapeHtml(inquiryLabel.toLowerCase())} from ${safeName}.
  </div>

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: ${BRAND.background};"
  >

    <tr>
      <td
        align="center"
        style="padding: 32px 16px;"
      >

        <!-- Main Card -->
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 620px;
            background-color: ${BRAND.card};
            border: 1px solid ${BRAND.border};
            border-radius: 18px;
            overflow: hidden;
          "
        >

          <!-- Top Accent -->
          <tr>
            <td
              style="
                height: 5px;
                background-color: ${BRAND.accent};
                font-size: 0;
                line-height: 0;
              "
            >
              &nbsp;
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td
              style="
                padding: 34px 36px 20px 36px;
              "
            >

              <div
                style="
                  font-size: 13px;
                  font-weight: 700;
                  letter-spacing: 0.12em;
                  text-transform: uppercase;
                  color: ${BRAND.accent};
                  margin-bottom: 12px;
                "
              >
                SKAND AHUJA
              </div>

              <div
                style="
                  font-size: 28px;
                  line-height: 1.25;
                  font-weight: 700;
                  color: ${BRAND.text};
                  margin-bottom: 8px;
                "
              >
                New message received
              </div>

              <div
                style="
                  font-size: 15px;
                  line-height: 1.6;
                  color: ${BRAND.muted};
                "
              >
                Someone reached out through your portfolio.
              </div>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <div
                style="
                  height: 1px;
                  background-color: ${BRAND.border};
                "
              ></div>
            </td>
          </tr>

          <!-- Contact Details -->
          <tr>
            <td style="padding: 26px 36px 10px 36px;">

              <div
                style="
                  font-size: 11px;
                  font-weight: 700;
                  letter-spacing: 0.12em;
                  text-transform: uppercase;
                  color: ${BRAND.muted};
                  margin-bottom: 14px;
                "
              >
                CONTACT DETAILS
              </div>

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>
                  <td
                    width="35%"
                    style="
                      padding: 9px 0;
                      color: ${BRAND.muted};
                      font-size: 14px;
                    "
                  >
                    Name
                  </td>

                  <td
                    style="
                      padding: 9px 0;
                      color: ${BRAND.text};
                      font-size: 14px;
                      font-weight: 600;
                    "
                  >
                    ${safeName}
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 9px 0;
                      color: ${BRAND.muted};
                      font-size: 14px;
                    "
                  >
                    Email
                  </td>

                  <td
                    style="
                      padding: 9px 0;
                      font-size: 14px;
                    "
                  >
                    <a
                      href="mailto:${safeEmail}"
                      style="
                        color: ${BRAND.accentDark};
                        text-decoration: none;
                      "
                    >
                      ${safeEmail}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 9px 0;
                      color: ${BRAND.muted};
                      font-size: 14px;
                    "
                  >
                    Reason
                  </td>

                  <td
                    style="
                      padding: 9px 0;
                      color: ${BRAND.text};
                      font-size: 14px;
                      font-weight: 600;
                    "
                  >
                    ${escapeHtml(inquiryLabel)}
                  </td>
                </tr>

                ${
                  company
                    ? `
                <tr>
                  <td
                    style="
                      padding: 9px 0;
                      color: ${BRAND.muted};
                      font-size: 14px;
                    "
                  >
                    Company
                  </td>

                  <td
                    style="
                      padding: 9px 0;
                      color: ${BRAND.text};
                      font-size: 14px;
                      font-weight: 600;
                    "
                  >
                    ${safeCompany}
                  </td>
                </tr>
                `
                    : ""
                }

              </table>

            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 20px 36px 30px 36px;">

              <div
                style="
                  background-color: #f8f9fd;
                  border: 1px solid ${BRAND.border};
                  border-radius: 12px;
                  padding: 20px;
                "
              >

                <div
                  style="
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: ${BRAND.muted};
                    margin-bottom: 12px;
                  "
                >
                  MESSAGE
                </div>

                <div
                  style="
                    font-size: 15px;
                    line-height: 1.7;
                    color: ${BRAND.text};
                  "
                >
                  ${safeMessage}
                </div>

              </div>

            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td
              align="center"
              style="padding: 0 36px 34px 36px;"
            >

              <a
                href="mailto:${safeEmail}"
                style="
                  display: inline-block;
                  background-color: ${BRAND.accent};
                  color: #ffffff;
                  text-decoration: none;
                  font-size: 14px;
                  font-weight: 700;
                  padding: 13px 24px;
                  border-radius: 10px;
                "
              >
                Reply to ${safeName}
              </a>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                padding: 20px 36px;
                background-color: #fafafa;
                border-top: 1px solid ${BRAND.border};
              "
            >

              <div
                style="
                  font-size: 12px;
                  line-height: 1.6;
                  color: ${BRAND.muted};
                "
              >
                Received via skand-ahuja.vercel.app
              </div>

              <div
                style="
                  font-size: 11px;
                  line-height: 1.6;
                  color: #98a2b3;
                  margin-top: 4px;
                "
              >
                ${escapeHtml(submittedAt)} IST
              </div>

            </td>
          </tr>

        </table>

        <!-- Outer Footer -->
        <div
          style="
            max-width: 620px;
            padding: 18px 10px 0 10px;
            font-size: 11px;
            line-height: 1.5;
            color: #98a2b3;
            text-align: center;
          "
        >
          ${BRAND.name} · ${BRAND.role}
        </div>

      </td>
    </tr>

  </table>

</body>
</html>
  `;

  const mailOptions = {
    from: `"${BRAND.name} Portfolio" <${process.env.EMAIL_USER}>`,

    to: process.env.CONTACT_RECEIVER_EMAIL,

    /*
     * This is important.
     *
     * When you click Reply in your inbox, your reply should go
     * directly to the person who submitted the form.
     */
    replyTo: email,

    subject: `${inquiryLabel} · ${name}`,

    text,

    html,

    /*
     * Helps some mail systems understand this is transactional
     * application mail.
     */
    headers: {
      "X-Entity-Ref-ID": `portfolio-contact-${Date.now()}`,
    },
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log(
      `✅ Contact notification email sent for ${inquiryLabel}`
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "❌ Failed to send contact notification:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
}

/* ============================================================
   AUTO-REPLY EMAIL
   ============================================================ */

/**
 * Sends a professional confirmation email to the person
 * who submitted the contact form.
 */
export async function sendAutoReply({ name, email }) {
  const safeName = escapeHtml(name);

  const text = `
Hi ${name},

Thanks for reaching out through my portfolio.

I've received your message and will get back to you within 24 to 48 hours.

In the meantime, you can explore my work:

GitHub: https://github.com/skand-ahuja
LinkedIn: https://linkedin.com/in/skand-ahuja

Best,
Skand Ahuja
Full-Stack Systems & Data Engineer

This is an automated confirmation that your message was received.
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Thanks for reaching out</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: ${BRAND.background};
    font-family: Arial, Helvetica, sans-serif;
    color: ${BRAND.text};
  "
>

  <!-- Preheader -->
  <div
    style="
      display: none;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      color: transparent;
    "
  >
    Thanks for reaching out to Skand Ahuja.
  </div>

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
  >

    <tr>
      <td
        align="center"
        style="padding: 32px 16px;"
      >

        <!-- Main Card -->
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 620px;
            background-color: ${BRAND.card};
            border: 1px solid ${BRAND.border};
            border-radius: 18px;
            overflow: hidden;
          "
        >

          <!-- Accent -->
          <tr>
            <td
              style="
                height: 5px;
                background-color: ${BRAND.accent};
                font-size: 0;
                line-height: 0;
              "
            >
              &nbsp;
            </td>
          </tr>

          <!-- Header -->
          <tr>
            <td
              style="
                padding: 36px 36px 22px 36px;
              "
            >

              <div
                style="
                  font-size: 13px;
                  font-weight: 700;
                  letter-spacing: 0.12em;
                  text-transform: uppercase;
                  color: ${BRAND.accent};
                  margin-bottom: 14px;
                "
              >
                SKAND AHUJA
              </div>

              <div
                style="
                  font-size: 28px;
                  line-height: 1.25;
                  font-weight: 700;
                  color: ${BRAND.text};
                "
              >
                Thanks for reaching out!
              </div>

            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td
              style="
                padding: 0 36px 30px 36px;
              "
            >

              <p
                style="
                  margin: 0 0 20px 0;
                  font-size: 16px;
                  line-height: 1.7;
                  color: ${BRAND.text};
                "
              >
                Hi ${safeName},
              </p>

              <p
                style="
                  margin: 0 0 20px 0;
                  font-size: 15px;
                  line-height: 1.7;
                  color: ${BRAND.muted};
                "
              >
                Thanks for getting in touch through my portfolio.
                I've received your message and will get back to you
                within <strong style="color: ${BRAND.text};">
                24 to 48 hours</strong>.
              </p>

              <!-- Quick Note -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background-color: #f0f2ff;
                  border-radius: 12px;
                "
              >

                <tr>
                  <td
                    style="
                      padding: 18px 20px;
                    "
                  >

                    <div
                      style="
                        font-size: 13px;
                        font-weight: 700;
                        color: ${BRAND.accentDark};
                        margin-bottom: 7px;
                      "
                    >
                      While you're here
                    </div>

                    <div
                      style="
                        font-size: 14px;
                        line-height: 1.6;
                        color: ${BRAND.text};
                      "
                    >
                      Feel free to explore my projects and
                      connect with me online.
                    </div>

                  </td>
                </tr>

              </table>

              <!-- Social Links -->
              <div
                style="
                  margin-top: 26px;
                "
              >

                <a
                  href="https://github.com/skand-ahuja"
                  style="
                    color: ${BRAND.accentDark};
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 600;
                    margin-right: 20px;
                  "
                >
                  GitHub
                </a>

                <a
                  href="https://linkedin.com/in/skand-ahuja"
                  style="
                    color: ${BRAND.accentDark};
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 600;
                  "
                >
                  LinkedIn
                </a>

              </div>

              <!-- Signature -->
              <p
                style="
                  margin: 30px 0 0 0;
                  font-size: 15px;
                  line-height: 1.7;
                  color: ${BRAND.text};
                "
              >
                Best,<br />

                <strong>
                  ${BRAND.name}
                </strong><br />

                <span
                  style="
                    color: ${BRAND.muted};
                    font-size: 13px;
                  "
                >
                  ${BRAND.role}
                </span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                padding: 20px 36px;
                background-color: #fafafa;
                border-top: 1px solid ${BRAND.border};
              "
            >

              <div
                style="
                  font-size: 11px;
                  line-height: 1.6;
                  color: #98a2b3;
                "
              >
                This is an automated confirmation that your
                message was received successfully.
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
  `;

  const mailOptions = {
    from: `"${BRAND.name}" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Thanks for reaching out to me",

    text,

    html,

    headers: {
      "X-Entity-Ref-ID": `portfolio-auto-reply-${Date.now()}`,
    },
  };

  try {
    await transporter.sendMail(mailOptions);

    console.log(
      `✅ Auto-reply email sent successfully`
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "❌ Failed to send auto-reply:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
}