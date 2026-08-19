import express from "express";
import { contactFormLimiter } from "../middleware/rateLimiter.js";
import {
  validateContactForm,
  handleValidationErrors,
  checkHoneypot,
} from "../middleware/validateContact.js";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

/**
 * POST /api/contact
 *
 * Middleware order matters here:
 *   1. contactFormLimiter — reject if this IP has submitted too many times
 *   2. checkHoneypot — reject (silently) if the hidden bot-trap field is filled
 *   3. validateContactForm — run validation rules on each field
 *   4. handleValidationErrors — stop here if any validation rule failed
 *   5. submitContactForm — actually process the legitimate submission
 */
router.post(
  "/",
  contactFormLimiter,
  checkHoneypot,
  validateContactForm,
  handleValidationErrors,
  submitContactForm
);

export default router;
