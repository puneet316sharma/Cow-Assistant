# 🐄 Cow Assistant — AI Livestock Health Management Platform

A full-stack web application designed for farmers and veterinarians to maintain digital cow health records, manage automated vaccination schedules, and obtain AI-powered health guidance powered by the **Google Gemini API**.

---

## 🌟 Key Features

- **Tag ID Cow Identification**: Look up cows by unique ear Tag ID (e.g. `COW-101`) to access full digital health profiles.
- **AI Symptom Assessment (Gemini API)**: Plain-language symptom reporting with structured AI responses (`possibleCauses`, `warningSigns`, `recommendedNextSteps`, `urgencyLevel`, and prominent veterinary disclaimer).
- **Automated Vaccination Engine**: Computes immunization due statuses (`completed`, `due_soon` within 14 days, `overdue`).
- **Health Event Timeline**: Visual chronological history of checkups, treatments, illnesses, vaccinations, and AI reports.
- **Farm Overview Dashboard**: Quick metric summary cards (`Total Cows`, `Vaccinations Due`, `Health Follow-ups`, `Healthy`) and filterable herd registry.
- **Earthy Farm Aesthetics**: Clean, accessible UI designed specifically for agricultural workflows.

---

## 🛠 Tech Stack

- **Frontend**: React 18 (Vite), React Router v7, Axios, Tailwind CSS v4, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: Google Gemini API (`@google/generative-ai` SDK)
- **Authentication**: JWT tokens + `bcryptjs` password hashing

---

## 📁 Monorepo Structure

```
cow-assistant/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Gemini SDK configuration
│   │   ├── models/          # User, Cow, VaccinationRecord, HealthEvent, SymptomReport
│   │   ├── controllers/     # Auth, Cow, Vaccination, HealthEvent, AI, Dashboard
│   │   ├── routes/          # Express API route modules
│   │   ├── middleware/      # Auth JWT verification & error handling
│   │   ├── services/        # Gemini AI prompt structuring & Vaccination logic
│   │   └── server.js        # Express application entrypoint
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client functions
│   │   ├── components/      # Navbar, StatusBadge, DisclaimerBanner, HealthEventTimeline, VaccinationList
│   │   ├── context/         # AuthContext state manager
│   │   ├── pages/           # Dashboard, CowProfile, RegisterCow, VaccinationManager, Login, Register
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18+ installed
- **MongoDB**: Local server running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Configure your `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/cow_assistant
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
cp .env.example .env
```
Configure `.env`:
```env
VITE_API_URL=http://localhost:5000
```
Start Vite development server:
```bash
npm run dev
# Application will run on http://localhost:5173
```

---

## 🚀 Deployment Guide

### Deploy Backend on Render
1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your repository and set Root Directory to `backend`.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add Environment Variables in Render Dashboard:
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `JWT_SECRET`: secure random string
   - `GEMINI_API_KEY`: your Google Gemini API key
   - `FRONTEND_URL`: your deployed Vercel frontend URL (e.g. `https://cow-assistant.vercel.app`)

### Deploy Frontend on Vercel
1. Import project on [Vercel](https://vercel.com/).
2. Set Root Directory to `frontend`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_API_URL`: your deployed Render backend URL (e.g. `https://cow-assistant-backend.onrender.com`)
5. Click **Deploy**.

---

## 🔒 Security & AI Disclaimer

- Gemini is used solely for **symptom interpretation and general guidance**.
- Medical dates, vaccination schedules, and herd statistics are computed by the core database engine.
- Every AI response automatically includes an explicit non-veterinary disclaimer banner.
