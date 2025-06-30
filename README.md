# Smart Tutoring Dashboard (Frontend/Backend)

This is the repository for the frontend/backend of a "Smart" Tutoring Dashboard designed to help tutors track student progress in Math & Physics.

### Live Demo

[Link to your live Vercel URL]

### Features (MVP)

*   **Tutor Dashboard:** View a list of all students and their overall progress per topic.
*   **Detailed Student View:** Click on a student to see a detailed chart of their performance.
*   **PDF Quiz Generator:** Dynamically generate a PDF worksheet for any student in any of their assigned topics.

### Tech Stack

*   **Frontend:** React, TypeScript, Recharts (for charts), jsPDF
*   **Backend:** Python, Flask
*   **Deployment:** Frontend on Vercel, Backend on Render

### Screenshots

_(Take a screenshot of your main dashboard and the detail view and add them here)_

### Local Setup

1.  `git clone <repo-url>`
2.  `cd <repo-folder>`
3.  `npm install`
4.  Create a `.env` file and add `REACT_APP_API_URL=http://localhost:5001`
5.  `npm start`

### Next Steps (Post-Sprint)

The next priorities are:
*   **Implement User Authentication (JWT)** to create secure tutor and student accounts.
*    **Migrate to a real database** (PostgreSQL or MongoDB) to persist data properly.
*   **Build out full CRUD** functionality for tutors to add/edit students and questions via the UI.
*   **Implement "Smart" Quiz Logic** on the backend to assign questions based on student weak spots.
*  **Create a Student View** where students can log in and take quizzes online.