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

PostgreSQL Database:

DATABASE_Name = aerodb
DATABASE_URL = "postgresql://username:newpassword123@localhost:5432/aerodb"


Install dependencies:

cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt


Run FastAPI server:
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000


Backend available at: 👉 http://127.0.0.1:8000

Swagger Docs: 👉 http://127.0.0.1:8000/docs

Frontend Setup (React + Vite + MUI)

Install dependencies:
cd frontend
npm install


To Run frontend:
npm run dev




 Default Credentials

Super Admin

Username: admin

Password: admin

Once logged in, Super Admin can create new users with roles & privileges.

 Features:

- Secure authentication with JWT

-Role-based access control (RBAC)

-Super Admin → Manage all users & projects

GD/DH → Create/manage projects, add users

-TL/SM/OIC → Project-specific access

-Students & researchers → Data-only access

-Material UI responsive dashboards