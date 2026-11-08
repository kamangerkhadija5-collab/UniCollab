# UniCollab — Team Formation & Project Management Platform

UniCollab is a web-based platform designed for university students to find suitable teammates, create project teams, and collaborate on academic projects.

The main goal is to make team formation easier by helping students discover other students based on their skills and interests.

## 1. Project Overview

University students often face difficulties finding teammates with compatible skills and interests. Communication, project coordination, and task management can also become challenging.

UniCollab aims to solve these problems through a single platform where students can:

- Create and manage their profiles.
- Discover other students.
- Find students based on skills and interests.
- View other students' profiles.
- Calculate compatibility through a skill-based matching score.
- Form teams and collaborate on academic projects.

## 2. Technologies Used

### Frontend
- React.js
- JavaScript (JSX)
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- CORS
- dotenv

### Development Tools
- Visual Studio Code
- Git and GitHub
- MongoDB Atlas

## 3. Current Project Progress

### Part 1 — Authentication & Student Discovery

**Status: Completed**

The following features have been implemented:

#### Authentication
- Student Signup
- Student Login
- Logout
- Password hashing using bcryptjs
- JWT-based authentication
- Protected frontend routes
- Token verification through a protected API endpoint

#### Student Profile
Students can create and update their profiles with:
- Full Name
- Email
- Department
- Semester
- Bio
- Skills
- Interests
- GitHub Profile
- LinkedIn Profile

Skills and interests can be selected using predefined tags.

Profile information is stored in MongoDB.

#### Student Discovery
- View registered students.
- Search students by name.
- Search students by department.
- Filter students by skills.
- View student information in individual cards.
- View complete student profiles.

#### Skill-Based Matching

UniCollab calculates a matching score between the logged-in student and other students.

The matching score uses:

- 70% weight for common skills.
- 30% weight for common interests.

The score is displayed as a percentage to help students identify compatible teammates.

## 4. Upcoming Development

### Part 2 — Team Formation & Project Management

Planned features:

- Create a team.
- Define required team skills.
- Send team join requests.
- Accept or reject join requests.
- Manage team members and roles.
- Create projects under teams.
- Assign tasks to team members.
- Kanban task board:
  - To Do
  - In Progress
  - Done

### Part 3 — Collaboration & Final Integration

Planned features:

- Real-time team chat using Socket.IO.
- Project file upload and download using Cloudinary.
- Store and display GitHub repository links.
- Integration testing.
- Security improvements.
- Responsive UI.
- Deployment.

## 5. Project Folder Structure

```text
UniCollab/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── auth/
│   │   │       ├── AuthLayout.jsx
│   │   │       └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── StudentProfile.jsx
│   │   │   │
│   │   │   └── teams/
│   │   │       └── FindStudents.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── studentController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   └── User.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── studentRoutes.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## 6. Installation & Setup

### Prerequisites

Make sure the following are installed:

- Node.js and npm
- MongoDB Atlas account
- Git
- Visual Studio Code

### Step 1: Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd UniCollab
```

### Step 2: Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

Replace the placeholder values with your own MongoDB connection string and secret key.

Start the backend:

```bash
npm run dev
```

### Step 3: Setup Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Vite will display the local development URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

## 7. API Endpoints

The backend API uses the base URL:

```text
http://localhost:5000/api
```

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a student |
| POST | `/auth/login` | Login a student |
| GET | `/auth/me` | Get logged-in student |
| PUT | `/auth/profile` | Update student profile |

### Student APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/students` | Get other students |
| GET | `/students/:id` | Get a student's profile |

Protected endpoints require a valid JWT token in the Authorization header:

```text
Authorization: Bearer <token>
```

## 8. Database

UniCollab currently uses MongoDB Atlas.

The User model stores:

- Full name
- Email
- Hashed password
- Department
- Semester
- Bio
- Skills
- Interests
- GitHub URL
- LinkedIn URL

Passwords are stored as hashes, not plain text.

## 9. Important Notes

- The project uses JavaScript and JSX, not TypeScript.
- Frontend and backend run in separate terminals.
- The backend uses MongoDB Atlas for database storage.
- Never upload `.env` or `node_modules` to GitHub.
- Each team member should create their own local `.env` file.
- Features listed under upcoming development are not implemented yet.

## 10. Team

**Project Name:** UniCollab

**Project Type:** Web Engineering / MERN Stack Application

**Developed By:**
- Ayesha Noor
- Umme Khadija

---

**Current Milestone:** Part 1 — Authentication, Student Profiles, Student Discovery, and Skill-Based Matching.
