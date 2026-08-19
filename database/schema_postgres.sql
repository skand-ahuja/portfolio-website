/*
============================================================
PORTFOLIO DATABASE
PostgreSQL

Database:
    portfolio_db

Purpose:
    Stores portfolio projects, contact submissions,
    and administrator credentials.

Environment:
    Local PostgreSQL
    Production PostgreSQL

IMPORTANT:
    Passwords are NEVER stored in plaintext.
    Admin passwords must be stored as bcrypt hashes.
============================================================
*/


/*
============================================================
TABLE: projects

Stores projects displayed on the portfolio.

Projects can later be managed through the admin panel
without changing frontend code.
============================================================
*/

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    github_url VARCHAR(255),

    live_url VARCHAR(255),

    tech_stack VARCHAR(255) NOT NULL,

    image_url VARCHAR(255),

    category VARCHAR(30) NOT NULL DEFAULT 'web_app',

    featured BOOLEAN NOT NULL DEFAULT FALSE,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT projects_category_check
        CHECK (
            category IN (
                'web_app',
                'automation',
                'data_dashboard',
                'other'
            )
        )
);


/*
============================================================
TABLE: contact_submissions

Stores messages submitted through the portfolio
contact form.

Email notification is handled separately by the
Node.js email service.

Current email implementation:
    Nodemailer + Gmail SMTP
============================================================
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL,

    inquiry_type VARCHAR(30) NOT NULL,

    company VARCHAR(150),

    message TEXT NOT NULL,

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    /*
     * PostgreSQL INET supports both IPv4 and IPv6.
     */
    ip_address INET,

    status VARCHAR(20) NOT NULL DEFAULT 'new',

    CONSTRAINT contact_inquiry_type_check
        CHECK (
            inquiry_type IN (
                'job_opportunity',
                'collaboration',
                'freelance',
                'general'
            )
        ),

    CONSTRAINT contact_status_check
        CHECK (
            status IN (
                'new',
                'read',
                'replied'
            )
        )
);


/*
============================================================
TABLE: admin_users

Stores administrator accounts.

IMPORTANT:
    password_hash must contain a bcrypt hash.
    NEVER store the actual password here.
============================================================
*/

CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    username VARCHAR(50) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


/*
============================================================
INDEXES

Indexes improve lookup/sorting performance.

For a small portfolio these aren't strictly necessary,
but they are sensible production indexes.
============================================================
*/


/*
Projects are frequently ordered by:
    featured
    display_order
    created_at
*/
CREATE INDEX IF NOT EXISTS idx_projects_display
ON projects (
    featured DESC,
    display_order ASC,
    created_at DESC
);


/*
Contact submissions will eventually be viewed
in the admin panel by status.
*/
CREATE INDEX IF NOT EXISTS idx_contact_status
ON contact_submissions (status);


/*
Latest contact submissions will likely be displayed first.
*/
CREATE INDEX IF NOT EXISTS idx_contact_submitted_at
ON contact_submissions (submitted_at DESC);


/*
============================================================
UPDATED_AT TRIGGER

PostgreSQL does NOT automatically update updated_at
when a row changes.

This trigger fixes that.
============================================================
*/


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;

    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS projects_updated_at_trigger
ON projects;


CREATE TRIGGER projects_updated_at_trigger
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();