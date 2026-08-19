# Personal Portfolio Website

A modern full-stack personal portfolio website built to showcase my work,
skills, experience, projects, and professional journey.

The portfolio combines a modern responsive interface with a secure backend
and database-driven project management.

## ✨ Highlights

- Responsive design for mobile, tablet, and desktop
- Dark and light theme support
- Modern glassmorphism-inspired UI
- Interactive project showcase
- Database-driven project management
- Secure admin dashboard
- Contact form with email notifications
- Automatic contact acknowledgement emails
- Accessible and keyboard-friendly interface
- SEO-ready structure
- Production-oriented security practices

## 🛠️ Technology

### Frontend

- React.js
- Vite
- Tailwind CSS
- JavaScript
- Font Awesome

### Backend

- Node.js
- Express.js
- REST API

### Database

- PostgreSQL

### Authentication

- JWT
- HttpOnly cookies
- bcrypt password hashing

### Email

- Gmail SMTP

## 📁 Project Structure

```
portfolio-website/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       ├── pages/
│       ├── sections/
│       ├── services/
│       └── utils/
│
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── services/
│
└── database/
    └── schema_postgres.sql
```

## 🚀 Features

### Portfolio

The public website includes:

* Hero section
* About
* Skills
* Experience
* Platforms built
* Projects
* Education
* Contact
* Responsive navigation
* Theme switching

### Project Management

Projects are managed through a protected admin dashboard.

The dashboard allows the administrator to:

* Add projects
* Edit projects
* Delete projects
* Mark projects as featured
* Control project display order
* Manage project information stored in PostgreSQL

Changes made through the admin dashboard are reflected on the public
portfolio without requiring a frontend redeployment.

### Contact System

The contact section supports professional inquiries such as:

* Job opportunities
* Collaborations
* Freelance projects
* General inquiries

Submitted messages are processed by the backend and email notifications
are sent to the configured recipient.

Visitors also receive an acknowledgement email after successfully
submitting an inquiry.

## 🔐 Security

The application includes several security measures, including:

* Secure HTTP headers
* CORS configuration
* API rate limiting
* Request validation
* Bot protection
* Parameterized database queries
* Environment-based configuration
* Password hashing
* JWT-based administrator authentication
* HttpOnly authentication cookies
* Protected administrator API routes

Sensitive credentials are kept outside the source code and are not included
in the repository.

## 📱 Responsive Design

The interface is designed to work across:

* Mobile devices
* Tablets
* Laptops
* Desktop screens

The application also considers accessibility, keyboard navigation,
readable contrast, semantic HTML, and responsive interaction patterns.

## 🌐 Live Website

**Coming soon**

## 📸 Preview

Coming soon.

## 👨‍💻 Author

**Skand Ahuja**

Data Analyst • Automation Engineer • Full-Stack Developer

* GitHub: [@skand-ahuja](https://github.com/skand-ahuja)

## 📄 License

This project is a personal portfolio website.

The source code is publicly available for reference, but the portfolio
content, personal information, images, branding, and other original assets
belong to the author.
