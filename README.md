A full-stack agricultural field management platform built as part of the **SmartSeason Field Monitoring System** technical assessment.
## Demo Credentials

| Role       | Email                          | Password |
|------------|--------------------------------|----------|
| **Admin**  | `admin@fieldscale.com`         | `123456` |
| **Agent**  | `sarah.miller@fieldscale.com`  | `123456` |
| **Agent**  | `mike.kade@fieldscale.com`     | `123456` |
| **Agent**  | `john.doe@fieldscale.com`      | `123456` |

---

## Features Implemented

### Frontend (Next.js 14 + TypeScript)
- Role-based authentication (Admin & Field Agent)
- Responsive dashboard with fixed navigation
- Admin Dashboard with statistics and lifecycle charts
- Agent Dashboard with assigned territories + real-time search
- Full Fields Management (CRUD)
- Field Detail Page with image, metrics, and status
- Observation History (Add, View, Delete individual updates)
- Field Assignment system (Assign agents to fields)
- Hoverable notifications and profile popovers
- Beautiful UI fully matching the provided design system

### Backend (Node.js + Express + MongoDB)
- RESTful API with proper error handling
- Mongoose models (`User`, `Field`, `FieldAssignment`, `FieldUpdate`)
- JWT Authentication + role-based access
- Field CRUD + Assignment + Observation management
- Cascade delete support

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (Local or Atlas)

### 1. Clone Repository
```bash
git clone https://github.com/Jacob-bravo/shamba_records.git
cd fieldscale-pro
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev


```
### 3. Frontend Setup
```bash
cd frontend
npm install

# Create environment file
cp .env.example .env.local
```

**`.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
``
npm run dev

```
## Design Decisions & Assumptions

- **Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, MongoDB + Mongoose, JWT
- **Auth**: Context-based with localStorage persistence
- **UI**: Strictly followed the provided design brief (colors, typography, rounded-3xl cards, etc.)
- **Data Model**: Fields can be assigned to multiple agents, and have multiple observation updates
- **Security**: Role-based access (Admin can manage all, Agents see only assigned fields)
- **UX**: Real-time search, hover modals, loading states, confirmation dialogs

**Assumptions Made**:
- Only two user roles: Admin and Field Agent
- Deleting a field cascades to delete assignments and observations
- Observation history is tied to both field and user

---

## Project Structure
```
fieldscale-pro/
├── frontend/                 # Next.js Application
│   ├── app/
│   ├── components/
│   ├── context/
│   └── lib/
├── backend/                  # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
└── README.md
```

## Completed Requirements

- ✅ Role-based dashboards
- ✅ Field Management (Create, Read, Update, Delete)
- ✅ Field Assignment to Agents
- ✅ Observation History (Create + Read + Delete)
- ✅ Responsive & modern UI
- ✅ Proper error handling and loading states
- ✅ Live deployment ready
