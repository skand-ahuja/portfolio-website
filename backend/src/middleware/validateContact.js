/**
 * validateContact.js
 * Validation and bot-protection middleware for the contact form.
 * Ensures data integrity and blocks simple automated spam bots.
 */
import { body, validationResult } from "express-validator";

const ALLOWED_INQUIRY_TYPES = ["job_opportunity", "collaboration", "freelance", "general"];

export const validateContactForm = [
  body("name").isString().withMessage("Name must be text.").bail().trim().notEmpty().withMessage("Name is required.").bail().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters."),
  body("email").isString().withMessage("Email must be text.").bail().trim().notEmpty().withMessage("Email is required.").bail().isEmail().withMessage("Enter a valid email address.").bail().normalizeEmail(),
  body("inquiryType").isString().withMessage("Inquiry type must be text.").bail().trim().isIn(ALLOWED_INQUIRY_TYPES).withMessage("Invalid inquiry type."),
  body("company").optional({ checkFalsy: true }).isString().withMessage("Company must be text.").bail().trim().isLength({ max: 150 }).withMessage("Company name is too long."),
  body("message").isString().withMessage("Message must be text.").bail().trim().notEmpty().withMessage("Message is required.").bail().isLength({ min: 20, max: 1000 }).withMessage("Message must be between 20 and 1000 characters."),
  body("website").optional({ checkFalsy: true }).isString().withMessage("Invalid request.").bail().trim().isLength({ max: 100 }).withMessage("Invalid request.")
];

/**
 * handleValidationErrors
 * Formats and returns express-validator errors to the client without exposing internal values.
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array({ onlyFirstError: true }).map(err => ({ field: err.path, message: err.msg }));
    return res.status(400).json({ success: false, message: "Please check your input.", errors: formattedErrors });
  }
  next();
}

/**
 * checkHoneypot
 * Detects bots that auto-fill hidden fields like 'website'. Silently returns success to trick the bot.
 */
export function checkHoneypot(req, res, next) {
  const honeypotValue = req.body?.website;
  if (typeof honeypotValue === "string" && honeypotValue.trim() !== "") {
    return res.status(200).json({ success: true, message: "Message sent." });
  }
  next();
}