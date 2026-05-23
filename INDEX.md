# 📑 BikeVN Documentation Index

**Quick reference to find what you need**

---

## 🚀 START HERE

- **[START.md](./START.md)** - Choose your role and quick start (2 min)

---

## 📚 Essential Documentation

### For Everyone
| Document | Purpose | Read Time |
|----------|---------|-----------|
| [README.md](./README.md) | Project overview & tech stack | 5 min |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | File organization guide | 5 min |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Daily commands (bookmark!) | 1 min |

### For New Developers
| Document | Purpose | Read Time |
|----------|---------|-----------|
| [START.md](./START.md) | Role-based quick start | 2 min |
| [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) | Step-by-step setup verification | 20 min |

### For Deployment & DevOps
| Document | Purpose | Read Time |
|----------|---------|-----------|
| [GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md) | How to commit & deploy | 10 min |

---

## 📂 Project Documentation

Located in `/docs/`:
- **[API.md](./docs/API.md)** - REST API endpoints
- **[Architecture.md](./docs/Architecture.md)** - System architecture
- **[ERD.md](./docs/ERD.md)** - Entity Relationship Diagram
- **[SRS.docx](./docs/SRS.docx)** - Software Requirements
- **[backend-analysis.md](./docs/backend-analysis.md)** - Backend analysis
- **[frontend-architecture.md](./docs/frontend-architecture.md)** - Frontend architecture
- **[GuideFrontend.md](./docs/GuideFrontend.md)** - Frontend development guide
- **[Task_timeline.md](./docs/Task_timeline.md)** - Project timeline
- **[Test_case.md](./docs/Test_case.md)** - Test cases

---

## 🛠️ Setup Scripts

All scripts accept commands: `up`, `down`, `status`, `logs`

### Windows
- **setup-env.ps1** - PowerShell (recommended)
- **setup-env.bat** - Command Prompt

### Linux/Mac
- **setup-env.sh** - Bash shell

---

## 📋 Quick Lookups

### Database
- **Location**: `/database/`
- **Schema**: `schema.sql` (10 tables)
- **Sample Data**: `sample_data.sql` (64+ records)
- **Queries**: `QUERIES_REFERENCE.sql`

### Docker
- **Location**: `/docker/`
- **Compose**: `docker-compose.yml`
- **Config**: `mysql.cnf`

### Frontend
- **Location**: `/frontend/`
- **Structure**: pnpm monorepo (admin + client-web apps)
- **Config**: `pnpm-workspace.yaml`

### Backend
- **Location**: `/backend/`
- **Framework**: Spring Boot
- **Config**: `pom.xml`
- **Entry**: `src/main/java/com/app/Application.java`

---

## 🔍 Find by Question

### "How do I get started?"
→ Read [START.md](./START.md)

### "Where's the project structure?"
→ See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

### "What are the daily commands?"
→ Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### "How do I setup locally?"
→ Follow [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

### "How do I deploy?"
→ Read [GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md)

### "What's the API?"
→ See [docs/API.md](./docs/API.md)

### "How's the system designed?"
→ Check [docs/Architecture.md](./docs/Architecture.md)

### "Where's the database schema?"
→ See [docs/ERD.md](./docs/ERD.md)

### "What needs to be tested?"
→ Look at [docs/Test_case.md](./docs/Test_case.md)

---

## ✅ Setup Checklist

After reading START.md:

- [ ] Run setup script: `.\setup-env.ps1 up`
- [ ] Access: http://localhost:8080
- [ ] Login: bikevn_user / bikevn_pass
- [ ] See bikevn_db database
- [ ] Review [docs/](./docs/) folder
- [ ] Bookmark [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- [ ] Ready to code! ✅

---

## 👥 By Role

### Frontend Developer
1. [START.md](./START.md) → New Developer section
2. [docs/GuideFrontend.md](./docs/GuideFrontend.md)
3. [docs/frontend-architecture.md](./docs/frontend-architecture.md)
4. Check `/frontend/` folder

### Backend Developer
1. [START.md](./START.md) → New Developer section
2. [docs/backend-analysis.md](./docs/backend-analysis.md)
3. [docs/API.md](./docs/API.md)
4. Check `/backend/` folder

### Database Engineer
1. [START.md](./START.md)
2. [docs/ERD.md](./docs/ERD.md)
3. [docs/Architecture.md](./docs/Architecture.md)
4. Check `/database/` folder

### Tech Lead
1. [README.md](./README.md)
2. [docs/Architecture.md](./docs/Architecture.md)
3. [docs/SRS.docx](./docs/SRS.docx)
4. [GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md)

### DevOps
1. [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)
2. [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. [GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md)
4. Check `/docker/` folder

---

## 🌟 Files You'll Use Most

**Bookmark these:**
- 📌 [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Daily commands
- 📌 [START.md](./START.md) - When onboarding someone
- 📌 [README.md](./README.md) - Project overview

---

## 🔗 All Files at a Glance

| File | Type | Purpose |
|------|------|---------|
| START.md | Getting Started | Quick start guide |
| README.md | Overview | Project info |
| QUICK_REFERENCE.md | Commands | Daily reference |
| SETUP_CHECKLIST.md | Setup | Setup verification |
| GIT_COMMIT_GUIDE.md | Deployment | Commit & deploy |
| PROJECT_STRUCTURE.md | Navigation | File structure |
| INDEX.md | This File | Find what you need |

---

## 📞 Need Help?

1. **Getting started?** → [START.md](./START.md)
2. **Finding files?** → [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
3. **Daily commands?** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
4. **Setup issues?** → [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)
5. **Everything else?** → Check [docs/](./docs/) folder

---

**Last Updated**: May 2026  
**Status**: ✅ Complete
