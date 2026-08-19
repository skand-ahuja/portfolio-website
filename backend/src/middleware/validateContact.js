/**
 * validateContact.js
 *
 * Validation and bot-protection middleware for the portfolio
 * contact form.
 *
 * Request flow:
 *
 *    POST /api/contact
 *          ↓
 *    Honeypot check
 *          ↓
 *    Input validation
 *          ↓
 *    Validation error handler
 *          ↓
 *    Controller
 *
 * Security responsibilities:
 *
 * - Validate required fields
 * - Validate email format
 * - Restrict inquiry types
 * - Restrict input lengths
 * - Normalize safe user input
 * - Detect simple automated bot submissions
 *
 * IMPORTANT:
 * This middleware does NOT replace parameterized PostgreSQL
 * queries. Database queries must still use $1, $2, etc.
 */

import { body, validationResult } from "express-validator";

/* ============================================================
   ALLOWED INQUIRY TYPES
   ============================================================ */

/**
 * Keep this list synchronized with:
 *
 * PostgreSQL contact_submissions.inquiry_type
 *
 * Current allowed values:
 *
 * - job_opportunity
 * - collaboration
 * - freelance
 * - general
 */
const ALLOWED_INQUIRY_TYPES = [
  "job_opportunity",
  "collaboration",
  "freelance",
  "general",
];

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */

/**
 * Validation middleware executed before the contact controller.
 */
export const validateContactForm = [
  /* ----------------------------------------------------------
     NAME
     ---------------------------------------------------------- */

  body("name")
    .isString()
    .withMessage("Name must be text.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({
      min: 2,
      max: 100,
    })
    .withMessage("Name must be between 2 and 100 characters."),

  /* ----------------------------------------------------------
     EMAIL
     ---------------------------------------------------------- */

  body("email")
    .isString()
    .withMessage("Email must be text.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address.")
    .bail()
    .normalizeEmail(),

  /* ----------------------------------------------------------
     INQUIRY TYPE
     ---------------------------------------------------------- */

  body("inquiryType")
    .isString()
    .withMessage("Inquiry type must be text.")
    .bail()
    .trim()
    .isIn(ALLOWED_INQUIRY_TYPES)
    .withMessage("Invalid inquiry type."),

  /* ----------------------------------------------------------
     COMPANY
     ---------------------------------------------------------- */

  body("company")
    .optional({
      checkFalsy: true,
    })
    .isString()
    .withMessage("Company must be text.")
    .bail()
    .trim()
    .isLength({
      max: 150,
    })
    .withMessage("Company name is too long."),

  /* ----------------------------------------------------------
     MESSAGE
     ---------------------------------------------------------- */

  body("message")
    .isString()
    .withMessage("Message must be text.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .bail()
    .isLength({
      min: 20,
      max: 1000,
    })
    .withMessage(
      "Message must be between 20 and 1000 characters."
    ),

  /* ----------------------------------------------------------
     HONEYPOT FIELD
     ---------------------------------------------------------- */

  /**
   * "website" is intentionally NOT displayed to normal users.
   *
   * We don't reject it here because checkHoneypot() handles it
   * separately before the controller is reached.
   *
   * The length limit prevents someone from abusing this field
   * with an unnecessarily large payload.
   */
  body("website")
    .optional({
      checkFalsy: true,
    })
    .isString()
    .withMessage("Invalid request.")
    .bail()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage("Invalid request."),
];

/* ============================================================
   VALIDATION ERROR HANDLER
   ============================================================ */

/**
 * Handles validation failures.
 *
 * We intentionally return only:
 *
 * - field name
 * - validation message
 *
 * We do NOT return the submitted value.
 *
 * Example response:
 *
 * {
 *   "success": false,
 *   "message": "Please check your input.",
 *   "errors": [
 *     {
 *       "field": "email",
 *       "message": "Enter a valid email address."
 *     }
 *   ]
 * }
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors
      .array({
        onlyFirstError: true,
      })
      .map((error) => ({
        field: error.path,
        message: error.msg,
      }));

    return res.status(400).json({
      success: false,
      message: "Please check your input.",
      errors: formattedErrors,
    });
  }

  next();
}

/* ============================================================
   HONEYPOT BOT PROTECTION
   ============================================================ */

/**
 * Detects simple automated submissions.
 *
 * The frontend contains a hidden field named:
 *
 *    website
 *
 * A normal visitor leaves it empty.
 *
 * Basic bots that automatically fill every input field may
 * populate it.
 *
 * When detected:
 *
 * - Do NOT save to PostgreSQL
 * - Do NOT send email
 * - Return a fake success response
 *
 * This makes the endpoint less useful to simple spam bots.
 */
export function checkHoneypot(req, res, next) {
  const honeypotValue = req.body?.website;

  if (
    typeof honeypotValue === "string" &&
    honeypotValue.trim() !== ""
  ) {
    /*
     * Intentionally return success.
     *
     * We don't want simple bots to learn that their submission
     * was detected and modify their behavior.
     */
    return res.status(200).json({
      success: true,
      message: "Message sent.",
    });
  }

  next();
}