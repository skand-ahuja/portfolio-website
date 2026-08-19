/**
 * contactController.js
 *
 * Handles contact form submissions.
 */

import pool from "../config/db.js";

import {
  sendContactNotification,
  sendAutoReply,
} from "../services/emailService.js";

/**
 * POST /api/contact
 */
export async function submitContactForm(
  req,
  res
) {
  const {
    name,
    email,
    inquiryType,
    company,
    message,
  } = req.body;

  const ipAddress = req.ip;

  try {
    /* --------------------------------------------------------
       Save submission to PostgreSQL
       -------------------------------------------------------- */

    await pool.query(
      `
        INSERT INTO contact_submissions
        (
          name,
          email,
          inquiry_type,
          company,
          message,
          ip_address
        )
        VALUES
        ($1, $2, $3, $4, $5, $6)
      `,
      [
        name,
        email,
        inquiryType,
        company || null,
        message,
        ipAddress,
      ]
    );

    console.log(
      `✅ Contact submission saved: ${name} (${inquiryType})`
    );

    /* --------------------------------------------------------
       Email operations run independently.
       Database success should not be undone because
       an email provider temporarily fails.
       -------------------------------------------------------- */

    const emailResults =
      await Promise.allSettled([
        sendContactNotification({
          name,
          email,
          inquiryType,
          company,
          message,
        }),

        sendAutoReply({
          name,
          email,
        }),
      ]);

    /*
     * Log email failures server-side.
     * Never expose SMTP/provider details to the client.
     */
    emailResults.forEach(
      (result, index) => {
        if (result.status === "rejected") {
          console.error(
            `Email operation ${index + 1} failed:`,
            result.reason
          );
        }
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Your message has been sent. I'll get back to you soon.",
    });
  } catch (error) {
    console.error(
      "Error handling contact form:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again later.",
    });
  }
}