# 📁 BikeVN Project Structure

**Complete project organization and file guide**

---

## 🎯 Quick Navigation

### 🚀 Getting Started (Read First!)
- **[START.md](./START.md)** - Choose your role and quick start

### 📚 Essential Documentation
- **[README.md](./README.md)** - Project overview
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Daily commands (bookmark!)
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step setup guide
- **[GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md)** - Deployment guide

---

## 📂 Project Directory Structure

### Root Level Files
```
BikeVN/
├── .env                    # Environment variables (DO NOT COMMIT)
├── .env.example            # Environment template
├── .gitignore             # Git ignore rules
│
├── README.md              # Project overview
├── START.md               # Quick start (READ FIRST!)
├── QUICK_REFERENCE.md     # Daily commands
├── SETUP_CHECKLIST.md     # Setup verification
├── GIT_COMMIT_GUIDE.md    # Deployment guide
├── PROJECT_STRUCTURE.md   # This file
│
├── setup-env.ps1          # Setup script (PowerShell/Windows)
├── setup-env.bat          # Setup script (CMD/Windows)
└── setup-env.sh           # Setup script (Bash/Linux/Mac)
```

### 🎨 Frontend (`/frontend`)
```
frontend/
├── pnpm-workspace.yaml    # pnpm monorepo config
├── pnpm-lock.yaml         # Lock file
├── package.json           # Root dependencies
├── tsconfig.base.json     # TypeScript config
│
├── apps/
│   ├── admin/             # Admin dashboard app
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── router/
│   │   │   ├── stores/
│   │   │   └── App.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── client-web/        # Client web app
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
│
└── packages/              # Shared monorepo packages
    ├── api/               # API client
    ├── ui/                # UI components
    ├── hooks/             # Custom hooks
    ├── types/             # TypeScript types
    ├── constants/         # App constants
    ├── schemas/           # Validation schemas
    ├── services/          # Business logic
    ├── providers/         # React providers
    └── utils/             # Utility functions
```

### 🔧 Backend (`/backend`)
```
backend/
├── pom.xml                # Maven configuration
├── mvnw                   # Maven wrapper (Linux/Mac)
├── mvnw.cmd               # Maven wrapper (Windows)
├── docker-compose.yml     # Backend services config
│
└── src/
    ├── main/
    │   ├── java/com/app/
    │   │   ├── controller/        # REST endpoints
    │   │   ├── service/           # Business logic
    │   │   ├── repository/        # Data access
    │   │   ├── model/             # JPA entities
    │   │   ├── dto/               # Request/Response DTO
    │   │   ├── config/            # Security, WebSocket
    │   │   ├── filter/            # Security filters
    │   │   └── Application.java   # Main entry point
    │   │
    │   └── resources/
    │       ├── application.yaml   # Spring Boot config
    │       ├── application-dev.yaml
    │       └── application-prod.yaml
    │
    └── test/
        └── java/com/app/          # Unit tests
```

### 📊 Database (`/database`)
```
database/
├── schema.sql             # Database schema (10 tables)
├── sample_data.sql        # Sample test data (64+ records)
└── QUERIES_REFERENCE.sql  # Common SQL queries
```

### 🐳 Docker (`/docker`)
```
docker/
├── docker-compose.yml     # Docker services (MySQL, phpMyAdmin, Adminer)
└── mysql.cnf              # MySQL configuration
```

### 📖 Documentation (`/docs`)
```
docs/
├── API.md                 # API documentation
├── Architecture.md        # System architecture
├── backend-analysis.md    # Backend analysis
├── frontend-architecture.md  # Frontend architecture
├── ERD.md                 # Entity Relationship Diagram
├── GuideFrontend.md       # Frontend guide
├── SRS.docx               # Software Requirements
├── Task_timeline.md       # Project timeline
└── Test_case.md          # Test cases
```

### 📊 Diagrams (`/diagrams`)
```
diagrams/
└── BikeVN.drawio.png      # Project architecture diagram
```

---

## 🗂️ File Purposes at a Glance

| File | Purpose | Audience | Read Time |
|------|---------|----------|-----------|
| START.md | Quick start guide | Everyone | 2 min |
| README.md | Project overview | Everyone | 5 min |
| QUICK_REFERENCE.md | Daily commands | Developers | 1 min |
| SETUP_CHECKLIST.md | Setup verification | New developers | 20 min |
| GIT_COMMIT_GUIDE.md | Deployment process | Tech leads | 10 min |
| PROJECT_STRUCTURE.md | File organization | Everyone | 5 min |

---

## 🎯 How to Navigate

### I'm New to the Project
```
1. START.md (2 min) - Choose your role
2. README.md (5 min) - Understand the project
3. SETUP_CHECKLIST.md (20 min) - Setup locally
4. QUICK_REFERENCE.md - Bookmark for daily use
```

### I'm Setting Up Docker
```
1. SETUP_CHECKLIST.md - Follow step by step
2. Run: .\setup-env.ps1 up
3. Access: http://localhost:8080
```

### I'm Ready to Code
```
1. Check docs/ for API and architecture
2. Check frontend/ or backend/ for your stack
3. Use QUICK_REFERENCE.md for common commands
```

### I'm the Tech Lead
```
1. README.md - Project overview
2. docs/Architecture.md - System design
3. docs/SRS.docx - Requirements
4. GIT_COMMIT_GUIDE.md - Deployment
```

---

## 🔐 Important Files (Don't Share!)

⚠️ **DO NOT COMMIT:**
- `.env` - Contains sensitive passwords and credentials
- `node_modules/` - Generated dependencies
- `target/` - Generated Java build
- `.class` files - Compiled Java
- `.DS_Store` - macOS metadata
- `*.log` - Log files

✅ **ALWAYS COMMIT:**
- `.env.example` - Template for .env
- `pom.xml` - Maven dependencies
- `package.json` - npm/pnpm dependencies
- Source code (src/)
- Documentation
- Tests

---

## 📊 Database Tables

10 tables with UTF-8 Vietnamese support:
1. **users** - User accounts (6 test users)
2. **branches** - Rental branches (4 locations)
3. **vehicles** - Motorcycles (19 test vehicles)
4. **bookings** - Rental bookings
5. **payments** - Payment records
6. **vehicle_returns** - Return information
7. **conversations** - Chat conversations
8. **conversation_members** - Chat participants
9. **messages** - Chat messages
10. **reviews** - User reviews

**Access:**
- phpMyAdmin: http://localhost:8080
- Adminer: http://localhost:8081
- CLI: `mysql -h localhost -P 3307 -u bikevn_user -pbikevn_pass`

---

## 🐳 Docker Services

After running `.\setup-env.ps1 up`:

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| MySQL | 3307 | localhost:3307 | Database |
| phpMyAdmin | 8080 | http://localhost:8080 | Web UI for MySQL |
| Adminer | 8081 | http://localhost:8081 | Lightweight DB UI |

**Credentials:**
- User: `bikevn_user`
- Password: `bikevn_pass`
- Database: `bikevn_db`

---

## 🛠️ Daily Commands

### Start Work
```powershell
.\setup-env.ps1 up
```

### Check Status
```powershell
.\setup-env.ps1 status
```

### View Logs
```powershell
.\setup-env.ps1 logs
```

### Stop Work
```powershell
.\setup-env.ps1 down
```

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for more commands.

---

## 📚 Additional Resources

- **API Documentation**: [docs/API.md](./docs/API.md)
- **Architecture**: [docs/Architecture.md](./docs/Architecture.md)
- **ERD**: [docs/ERD.md](./docs/ERD.md)
- **Requirements**: [docs/SRS.docx](./docs/SRS.docx)
- **Frontend Guide**: [docs/GuideFrontend.md](./docs/GuideFrontend.md)
- **Test Cases**: [docs/Test_case.md](./docs/Test_case.md)

---

## 👥 Team Members

- **Trần Hải Đăng** - Frontend Lead
- **Trần Hoàng Phương** - Backend Lead
- **Hồ Tấn Đạt** - Database & Documentation

---

## ✅ Quick Checklist for New Developers

- [ ] Read START.md
- [ ] Read README.md
- [ ] Follow SETUP_CHECKLIST.md
- [ ] Access http://localhost:8080
- [ ] Review docs/ folder
- [ ] Explore frontend/ or backend/
- [ ] Bookmark QUICK_REFERENCE.md
- [ ] Ask questions in team chat

---

## 🚀 You're Ready!

Everything is organized and documented. Pick your area and start contributing!

**Need help?** Check [START.md](./START.md)

---

**Last Updated**: May 2026  
**Status**: ✅ Production Ready
