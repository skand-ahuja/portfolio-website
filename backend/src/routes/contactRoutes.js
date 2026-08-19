/**
 * contactRoutes.js
 * Defines the public route for the contact form submission.
 * Applies rate limiting, honeypot checks, and data validation.
 */
import express from "express";
import { contactFormLimiter } from "../middleware/rateLimiter.js";
import { validateContactForm, handleValidationErrors, checkHoneypot } from "../middleware/validateContact.js";
import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", contactFormLimiter, checkHoneypot, validateContactForm, handleValidationErrors, submitContactForm);

export default router;