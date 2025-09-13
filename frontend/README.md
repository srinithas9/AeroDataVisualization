uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
Aero Data Visualization

A role-based User & Project Management System built with FastAPI (Python, backend), PostgreSQL (database), and React + Material UI (frontend).

It implements a user hierarchy with different privileges:

Type 1: SUPERADMIN, GD, DH → Full privileges (manage users, create projects, unrestricted access).

Type 2: TL, SM, OIC → Project-based access.

Type 3: JRF, SRF, CE, STUDENT → Data-only access.

The system allows:

Super Admin (default admin/admin) to create new users.

GD/DH to manage users and projects.

Project-specific roles to access only their assigned data/projects.

🏗 Project Structure
AeroDataVisualization/
│
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app entry
│   │   ├── models.py       # SQLAlchemy models (Users, Projects, etc.)
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── crud.py         # Database CRUD operations
│   │   ├── auth.py         # Authentication (JWT, hashing)
│   │   └── routers/        # API routers
│   │       ├── auth_router.py
│   │       ├── users_router.py
│   │       └── projects_router.py
│   └── database.py         # DB connection (PostgreSQL)
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/          # Dashboards (SuperAdmin, GD/DH, Student, etc.)
│   │   ├── context/        # Auth context
│   │   ├── components/     # Shared UI (TopBar, ProtectedRoute, etc.)
│   │   └── App.jsx         # Main React app
│   └── package.json
│
└── README.md

⚙️ Backend Setup (FastAPI + PostgreSQL)

Create PostgreSQL Database

CREATE DATABASE aerodb;


Configure Database
Update backend/app/database.py with your DB credentials:

DATABASE_URL = "postgresql://username:password@localhost:5432/aerodb"


Install dependencies

cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
source .venv/bin/activate  # Linux/Mac

pip install -r requirements.txt


Run FastAPI server

uvicorn app.main:app --reload --host 127.0.0.1 --port 8000


Backend available at: 👉 http://127.0.0.1:8000

Swagger Docs: 👉 http://127.0.0.1:8000/docs

🎨 Frontend Setup (React + Vite + MUI)

Install dependencies

cd frontend
npm install


Run frontend

npm run dev


Frontend available at: 👉 http://localhost:5173

🔑 Default Credentials

Super Admin

Username: admin

Password: admin

Once logged in, Super Admin can create new users with roles & privileges.

📌 Features

✅ Secure authentication with JWT

✅ Role-based access control (RBAC)

✅ Super Admin → Manage all users & projects

✅ GD/DH → Create/manage projects, add users

✅ TL/SM/OIC → Project-specific access

✅ Students & researchers → Data-only access

✅ Material UI responsive dashboards