# Rexshan-Gidy-Profile
The Profile Project is a full-stack web application  Gidy.ai. 
# 🧑‍💼 Gidy Profile App

A full-stack professional profile management application built with React (frontend) and Spring Boot (backend), backed by MySQL.

---

## 🌐 Live Links

- **Frontend (Vercel):** _Add your Vercel URL here_
- **Backend (Railway):** _Add your Railway URL here_

---

## 🛠 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Axios     |
| Backend   | Spring Boot 3.2.3, Spring Data JPA      |
| Database  | MySQL 8                                 |
| Hosting   | Vercel (Frontend) + Railway (Backend + DB) |

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8 running locally

---

### 1. Clone the Repository

```bash
git clone https://github.com/RexshanSam/Rexshan-Gidy-Profile.git
cd Rexshan-Gidy-Profile
```

---

### 2. Backend Setup

```bash
cd backend/gidy-backend
```

Create a MySQL database:
```sql
CREATE DATABASE gidy_profile;
```

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gidy_profile?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

Run the backend:
```bash
mvn spring-boot:run
```

Backend will start at: `http://localhost:8080`

---

### 3. Frontend Setup

```bash
cd frontend/gidy-frontend
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

Install dependencies and run:
```bash
npm install
npm run dev
```

Frontend will start at: `http://localhost:5173`

---

## ☁️ Deployment Guide

### Step 1 — Deploy Backend + MySQL on Railway

1. Go to [railway.app](https://railway.app) → **New Project**
2. Click **"Deploy from GitHub repo"** → select `Rexshan-Gidy-Profile`
3. Set the **Root Directory** to `backend/gidy-backend`
4. Add a **MySQL** plugin from Railway's service menu
5. Railway auto-sets `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
6. Add environment variable: `PORT=8080`
7. Deploy — copy your Railway backend URL

### Step 2 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import `Rexshan-Gidy-Profile` from GitHub
3. Set **Root Directory** to `frontend/gidy-frontend`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app/api
   ```
5. Click **Deploy** — Vercel handles the build automatically

---

## ✨ Innovation Feature — Smart Profile Completeness Score

The app includes a **Profile Completeness Score** indicator that:

- Dynamically calculates how complete a user's profile is (0–100%)
- Visually displays a progress ring/bar in real time
- Highlights which sections (skills, education, experience, photo) are missing
- Encourages users to fill all sections before sharing their profile

This was built using a custom React hook (`useProfileScore`) that watches the profile data from the API and scores each section, giving users clear, actionable feedback to improve their profile.

---

## 📁 Project Structure

```
Rexshan-Gidy-Profile/
├── backend/
│   └── gidy-backend/          # Spring Boot application
│       ├── src/main/java/     # Controllers, Services, Entities
│       └── src/main/resources/
│           └── application.properties
├── frontend/
│   └── gidy-frontend/         # React + Vite app
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/      # Axios API calls
│       │   └── context/
│       └── vite.config.js
└── README.md
```

---

## 📬 Submission

Submitted to: **gidy@gidy.ai**  
Deadline: **6th March 2026**
