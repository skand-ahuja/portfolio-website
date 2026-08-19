/*
============================================================
PORTFOLIO DATABASE: PostgreSQL

Purpose:
    Stores portfolio projects and contact submissions.

Authentication:
    Current admin authentication uses:
    - ADMIN_USERNAME
    - ADMIN_PASSWORD_HASH
    - JWT_SECRET

IMPORTANT:
    Sensitive credentials are NOT stored in this database
    in the current authentication architecture.
============================================================
*/


/*
============================================================
TABLE: projects

Stores projects displayed on the public portfolio.

Projects are managed through the protected admin dashboard.
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
     * PostgreSQL INET supports IPv4 and IPv6 addresses.
     *
     * This field is optional and should only be stored
     * when required for legitimate security/operational
     * purposes.
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
INDEXES
============================================================
*/


/*
Projects are displayed using:
    featured DESC
    display_order ASC
    created_at DESC
*/
CREATE INDEX IF NOT EXISTS idx_projects_display
ON projects (
    featured DESC,
    display_order ASC,
    created_at DESC
);


-- Contact submissions can be filtered by status from a future admin inbox.
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions (status);


-- Latest contact submissions should be easy to retrieve.
CREATE INDEX IF NOT EXISTS idx_contact_submitted_at ON contact_submissions (submitted_at DESC);


/*
============================================================
UPDATED_AT TRIGGER
============================================================
PostgreSQL does not automatically update updated_at.
This trigger updates it whenever a project is modified.
============================================================
*/

CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN 
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS projects_updated_at_trigger ON projects;


CREATE TRIGGER projects_updated_at_trigger BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_projects_updated_at();