# 🎓 CampusConnect - College Placement Management System
License: MIT Build Status Stars

A full-stack, comprehensive College Placement Management System built to streamline the recruitment process for students, placement officers, and company recruiters. CampusConnect provides a centralized dashboard where students can build profiles and apply for jobs, recruiters can manage applicants, and admins can oversee the entire placement drive with advanced analytics.

✨ Key Features
- **Role-Based Access Control:** Dedicated modules for Students, Admins (Placement Officers), and Recruiters (HR).
- **Student Profile & Resume Management:** Students can update academic details and upload resumes, with mock AI parsing to extract skills.
- **Automated Eligibility Checks:** The system automatically checks student eligibility (CGPA, backlogs, branch) before allowing job applications.
- **Real-Time Application Tracking:** Both students and recruiters can track and update application statuses (e.g., Shortlisted, Selected).
- **Advanced Analytics Dashboard:** Visual insights for admins detailing total students, placed students, highest package, and branch-wise statistics.
- **Automated Notifications:** Seamless Nodemailer integration to automatically alert students when their application status changes.

🚀 Live Demo 
*(Add a link to your deployed Heroku/Vercel/Netlify app here)*

🛠️ Tech Stack
This project is a full-stack monorepo with the following main parts:

**Frontend (Client):**
- React 18 with Vite
- Tailwind CSS: For all styling and UI design.
- Framer Motion: For animations.
- Recharts: For analytics charts.
- Axios: For API requests.

**Backend (Server):**
- Node.js
- Express: As the API framework.
- MongoDB: As the primary database.
- Mongoose: For object data modeling.
- JWT & bcryptjs: For user authentication and security.
- Nodemailer: For automated emails.
- Multer: For resume uploads.

**Machine Learning (ML - Planned/Mocked):**
- Mock AI Processing: Currently utilizes a mock algorithm during resume upload to extract skills.
- Planned integration with real NLP/ML models in the `ml/` directory.

🧠 How It Works
1. A user (Student, Admin, or HR) logs in via the React frontend, receiving a secure JWT token.
2. The user interacts with the dashboard (e.g., applying for a job, updating status).
3. The React app sends an API request to the Node.js/Express server (POST/PUT).
4. The Express server middleware verifies the JWT, and controller logic validates business rules (like eligibility criteria).
5. Data is processed and saved in the MongoDB database via Mongoose.
6. If an HR updates a status to "Shortlisted" or "Selected", the backend automatically triggers Nodemailer to send an email notification to the student.
7. The server sends a response back to the React app, updating the UI in real-time.

📦 Getting Started & Installation
To run this project locally, you will need to set up the server and client.

Prerequisites
- Node.js (v18+)
- MongoDB (A local instance or a free Atlas cluster)
- Git

1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. Backend Setup (Server)
1. Navigate to the server directory:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the `/backend` directory and add your environment variables:
```env
PORT=5000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_super_secret_jwt_key"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_email_password"
```
4. Start the server (in a dedicated terminal):
```bash
npm run dev
```
The server will be running at http://localhost:5000.

3. Frontend Setup (Client)
1. Navigate to the client directory (from the root):
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the `/frontend` directory and add:
```env
VITE_API_URL=http://localhost:5000/api
```
4. Start the React app (in a second terminal):
```bash
npm run dev
```
The app will open at http://localhost:5173.
