-- ============================================================
-- PORTFOLIO DATABASE SCHEMA
-- Run this file once against your MySQL database (XAMPP locally,
-- or your cloud MySQL provider in production) to create all tables.
--
-- Usage (XAMPP / local):
--   1. Open phpMyAdmin or the MySQL CLI
--   2. CREATE DATABASE portfolio_db;
--   3. USE portfolio_db;
--   4. Run the contents of this file
-- ============================================================

CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- ----------------------------------------------------------
-- TABLE: projects
-- Stores the GitHub/personal/freelance projects shown in the
-- "Projects" section. Designed to be fully editable via the
-- admin panel — no code changes needed to add/remove a project.
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  github_url VARCHAR(255) NULL,         -- NULL if the repo is private/not public
  live_url VARCHAR(255) NULL,           -- live demo link, if deployed
  tech_stack VARCHAR(255) NOT NULL,     -- comma-separated, e.g. "React,Node.js,MySQL"
  image_url VARCHAR(255) NULL,          -- screenshot/thumbnail
  category ENUM('web_app', 'automation', 'data_dashboard', 'other') DEFAULT 'web_app',
  featured BOOLEAN DEFAULT FALSE,       -- featured projects show first / bigger
  display_order INT DEFAULT 0,          -- manual sort order within its group
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------
-- TABLE: contact_submissions
-- Stores every message sent through the Contact form, as a
-- record/log (the real-time notification still happens via
-- Resend email — this table is for your own reference/admin view).
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  inquiry_type ENUM('job_opportunity', 'collaboration', 'freelance', 'general') NOT NULL,
  company VARCHAR(150) NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) NULL,          -- supports both IPv4 and IPv6
  status ENUM('new', 'read', 'replied') DEFAULT 'new'
);

-- ----------------------------------------------------------
-- TABLE: admin_users
-- A single admin account (you) to log into the admin panel
-- and manage the projects table without touching code.
-- Password is stored as a bcrypt HASH, never plain text.
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
