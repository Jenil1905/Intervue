# 🎯 Intervue — AI-Powered Technical Interview Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_3.6-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Intervue** is an autonomous, full-stack AI mock interviewing platform designed for Computer Science students and software engineers. It simulates realistic technical interviews using real-time speech recognition, voice synthesis, code execution analysis, and proctoring controls.

---

## 🌟 Key Features

### 🤖 Adaptive AI Technical Interviewer
* **Topic-Tailored Questions**: Dynamic generation of CS questions across Data Structures & Algorithms, Operating Systems, Computer Networks, JavaScript, Java, Python, C++, and DBMS.
* **Contextual Conversations**: Analyzes both **spoken explanations** and **written code** simultaneously to ask intelligent follow-up questions.
* **Natural Intent Detection**: Understands candidate intents such as requesting question repetition (`repeat`), seeking clarification (`elaborate`/`explain`), or requesting to move forward.

### 💻 Integrated Monaco Code Editor
* **Multi-Language Support**: Write and practice solutions in Java, Python, C++, JavaScript, or SQL.
* **Auto-Save & Real-Time Sync**: Code changes are continuously saved to MongoDB.
* **Monaco Integration**: Built-in syntax highlighting, line numbers, and autocomplete powered by VS Code's editor engine.

### 🎙️ Real-Time Voice & Speech Interaction
* **Speech-to-Text**: Converts candidate speech to text using the Web Speech API.
* **Text-to-Speech**: AI interviewer speaks follow-up questions and conversational responses.
* **Streamlined Mic Controls**: 1-click toggle to speak, review, and auto-submit.

### 🛡️ Smart Proctoring & Integrity System
* **Fullscreen Enforcement**: Enforces fullscreen mode with immediate warning triggers.
* **Tab-Switch Detection**: Monitors tab-switching activities with a 3-warning automated termination rule.
* **Proctoring Telemetry**: Logs violation metrics directly into session reports.

### 📊 In-Depth Performance Analytics
* **20-Point Metric Scoring**: Questions are evaluated out of 20 points across 4 distinct categories:
  * **Technical Accuracy (8 pts)**
  * **Code Quality & Implementation (6 pts)**
  * **Communication & Explanation (4 pts)**
  * **Problem-Solving Approach (2 pts)**
* **Automated Grade Assignment**: Maps overall scores (0–100) to Letter Grades (`A+`, `A`, `B+`, `B`, `C+`, `C`, `F`).
* **Detailed Question Breakdown**: Itemized feedback, candidate strengths, improvement areas, and career recommendations.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide Icons, React Calendar, Lottie React |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB ODM), Cookie Parser, CORS, Nodemailer, Node-cron |
| **AI & LLM Integration** | Google Generative AI SDK (`@google/generative-ai`) — Gemini 3.6 & 2.5 Flash models |
| **Browser APIs** | Web Speech API (`SpeechRecognition` & `SpeechSynthesis`), MediaDevices API (Camera/Mic) |

---

## 📁 Repository Structure

```
Intervue/
├── client/                     # React Frontend Application
│   └── Intervue/
│       ├── public/             # Static Assets
│       ├── src/
│       │   ├── apiCalls/       # Centralized Axios API Clients
│       │   ├── assets/         # Lottie & Image Assets
│       │   ├── components/     # UI Pages & Components
│       │   │   ├── Dashboard/  # User Dashboard & Stats
│       │   │   ├── Feedback/   # Analytics & Score Reports
│       │   │   ├── InterviewPage/# Live AI Interview Room
│       │   │   ├── Login/      # Authentication Pages
│       │   │   ├── Profile/    # User Profile Settings
│       │   │   ├── Settings/   # System & AI Preferences
│       │   │   └── SignUp/     # Account Registration
│       │   ├── App.jsx         # Client Routes
│       │   └── main.jsx        # Entrypoint
│       ├── package.json
│       └── vite.config.js
└── server/                     # Express Backend Server
    ├── controllers/            # Route Request Handlers
    ├── middlewares/            # JWT Auth & Security Middleware
    ├── models/                 # Mongoose Schemas (User, Interview, Schedule)
    ├── routes/                 # API Endpoint Routers
    ├── service/                # AI Prompt Engineering & Feedback Services
    ├── connection.js           # MongoDB Database Connection
    ├── index.js                # Server Entrypoint & Cron Jobs
    └── package.json
```

---

## ⚙️ Environment Variables Configuration

Create a `.env` file inside the `server/` directory with the following keys:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
dbUrl=mongodb+srv://<username>:<password>@cluster.mongodb.net/intervue

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Google Gemini AI API Key
gemini_api_key=your_google_gemini_api_key

# Email Notification Service (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18.x or higher
* **npm**: v9.x or higher
* **MongoDB**: Atlas Cluster or Local instance
* **Browser**: Google Chrome or Chromium-based browser (for Web Speech API support)

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm start
```
The backend server will run on `http://localhost:3000`.

### 3. Frontend Setup
```bash
# Navigate to client application
cd client/Intervue

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔌 API Endpoints Summary

### 🔐 Authentication & User Routes (`/api/auth`, `/api/user`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new candidate account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `POST` | `/api/auth/logout` | Clear user session cookies |
| `GET` | `/api/user/profile` | Fetch active user profile data |
| `PATCH` | `/api/user/profile` | Update profile information |
| `DELETE`| `/api/user/account` | Permanently delete user account |

### 🎙️ Interview Management (`/api/interview`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/interview/start/:topic` | Initialize a new AI interview session |
| `GET` | `/api/interview/session/:interviewId` | Fetch existing interview session details |
| `GET` | `/api/interview/get-history` | List all past interviews for user |
| `PATCH` | `/api/interview/save-code` | Auto-save code editor contents |
| `POST` | `/api/interview/generate-contextual-response` | Evaluate speech & code for AI response |
| `POST` | `/api/interview/get-next-question` | Move to next question in session |
| `POST` | `/api/interview/finalize-question` | Complete current question evaluation |

### 📊 Feedback Routes (`/api/feedback`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/feedback/:interviewId` | Retrieve saved performance feedback |
| `POST` | `/api/feedback/generate/:interviewId` | Generate dynamic Gemini feedback report |

---

## 📈 Evaluation & Grading Rubric

Each completed interview session is evaluated out of **100 points** (20 points × 5 questions):

| Category | Points | Evaluation Focus |
| :--- | :--- | :--- |
| **Technical Accuracy** | 8 pts | Correctness of theoretical concepts, edge cases, and algorithm logic |
| **Code Quality** | 6 pts | Syntax correctness, efficiency, data structure choices, and clean code principles |
| **Communication** | 4 pts | Clarity of verbal explanation, structured thought process, and technical depth |
| **Problem Solving** | 2 pts | Methodical approach, trade-off analysis, and adaptability |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.