# 🎯 DayTrack

DayTrack is a premium, real-time daily task management system designed to help you capture your wins, track productivity trends, and maintain a clear focus on your goals.

## 🚀 What We Built

DayTrack goes beyond simple to-do lists. It features:
- **Intelligent Task Tracking**: Managed daily tasks with real-time status updates.
- **Real-Time Notifications**: Instant feedback via WebSockets when tasks are completed or summaries are generated.
- **End-of-Day (EOD) Processing**: Automatically archives daily progress and generates performance analytics.
- **Archives & Analytics**: Revisit past performance with beautiful, data-driven cards and filtering.
- **Premium UI/UX**: A state-of-the-art interface built with Poppins typography, glassmorphism, and smooth Framer Motion animations.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using Motor for async operations)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/latest/)
- **Real-Time**: WebSockets
- **Package Manager**: [uv](https://github.com/astral-sh/uv)

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python 3.10+](https://www.python.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or via Atlas)
- [uv](https://github.com/astral-sh/uv) (Recommended for backend)

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
uv sync
```

Run the server:
```bash
uv run uvicorn main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

---

## 📁 Project Structure

```bash
DayTrack/
├── backend/
│   ├── app/
│   │   ├── core/           # Configuration & WebSocket manager
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic validation models
│   │   ├── services/       # Business logic (Tasks & EOD)
│   │   └── database/       # MongoDB connection
│   └── main.py             # Entry point
├── frontend/
│   ├── app/                # Next.js Pages & Layouts
│   ├── components/         # Organized UI & Feature components
│   ├── hooks/              # Custom React hooks (WebSockets, API)
│   ├── lib/                # API client configuration
│   └── types/              # Centralized TypeScript interfaces
└── README.md
```

## 🔐 Environment Variables
Create a `.env` file in the `backend` directory:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=daytrack
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

Built with ❤️ by the DayTrack Team.
