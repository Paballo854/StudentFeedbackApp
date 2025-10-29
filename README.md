# Student Feedback System

A full-stack web application for collecting and managing student course feedback.

## Features

- Submit course feedback with ratings
- View all feedback in a dashboard
- Delete feedback entries
- Form validation
- Responsive design
- Professional UI with landing page and footer

## Technology Stack

- Frontend: React.js
- Backend: Node.js + Express
- Database: SQLite
- Styling: Custom CSS

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Quick Start

1. Extract the project files
2. Run \start-system.bat\ (Windows) or follow manual steps below

### Manual Setup

#### Backend Setup
\\\ash
cd backend
npm install
npm start
\\\

#### Frontend Setup
\\\ash
cd frontend
npm install
npm start
\\\

## Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- GET /api/feedback - Retrieve all feedback
- POST /api/feedback - Submit new feedback
- DELETE /api/feedback/:id - Delete feedback

## Project Structure

\\\
StudentFeedbackApp/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── start-system.bat
\\\

## Course Information

- **Course**: BIWA2110 Web Application Development
- **Department**: Faculty of Information & Communication Technology
- **University**: Limkokwing University of Creative Technology
- **Lecturer**: Mr. 'Molaoa
- **Email**: liteboho.molaoa@limkokwing.ac.ls

## Marking Criteria Met

- Backend Setup (Node + Express) ✓
- Database Design (SQLite) ✓
- POST API for adding feedback ✓
- GET API for retrieving feedback ✓
- CORS & Error Handling ✓
- Frontend Setup (React) ✓
- Feedback Form with validation ✓
- Data submission between frontend/backend ✓
- Display feedback correctly ✓
- UI Design with styling ✓
- Bonus: Delete functionality ✓
- Bonus: Form validation messages ✓
- Bonus: Environment variables ✓
