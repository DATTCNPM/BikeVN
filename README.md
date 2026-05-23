# BikeVN

Ứng dụng cho thuê xe máy tay ga theo vị trí, hỗ trợ đặt xe và chat realtime giữa khách và chủ xe.

## Features

- Authentication (JWT)
- Booking system (check trùng lịch)
- Map tìm xe gần (Google Maps)
- Chat realtime (WebSocket)
- Admin dashboard

## Tech Stack

Frontend: React  
Backend: Spring Boot  
Database: MySQL  
Map: Google Maps API  
Realtime: WebSocket

## Architecture

## 📁 Folder Structure

```
BikeVN/
│
├── frontend/                # React + TypeScript (pnpm monorepo)
│   ├── apps/
│   │   ├── admin/          # Admin dashboard
│   │   └── client-web/     # Client web app
│   ├── packages/           # Shared packages (ui, api, hooks, etc)
│   └── pnpm-workspace.yaml
│
├── backend/                 # Spring Boot
│   ├── src/main/java/com/app/
│   │   ├── controller/      # API endpoints
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access
│   │   ├── model/           # JPA entities
│   │   ├── dto/             # Request/Response DTO
│   │   └── config/          # Security, WebSocket config
│   ├── pom.xml
│   └── docker-compose.yml   # Backend services
│
├── database/
│   ├── schema.sql           # 10 tables with UUID PKs
│   ├── sample_data.sql      # 64+ sample records
│   └── QUERIES_REFERENCE.sql
│
├── docker/                  # Docker configuration
│   ├── docker-compose.yml   # MySQL, phpMyAdmin, Adminer
│   └── mysql.cnf           # MySQL configuration
│
├── docs/                    # Project documentation
│   ├── API.md              # API endpoints
│   ├── Architecture.md      # System architecture
│   ├── ERD.md              # Entity relationship diagram
│   ├── SRS.docx            # Software requirements
│   └── ...
│
├── diagrams/               # Project diagrams
│   └── BikeVN.drawio.png
│
├── README.md               # This file
├── START.md                # Quick start guide
├── QUICK_REFERENCE.md      # Daily commands
├── SETUP_CHECKLIST.md      # Step-by-step setup
├── GIT_COMMIT_GUIDE.md     # Git deployment guide
│
├── setup-env.ps1           # Windows PowerShell setup
├── setup-env.bat           # Windows CMD setup
├── setup-env.sh            # Linux/Mac Bash setup
│
├── .env                    # Environment configuration
├── .env.example            # Configuration template
└── .gitignore
```

## 🐳 Docker Setup

The project includes Docker configuration for easy local development setup.

### Quick Start

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd BikeVN
   ```

2. **Start Docker services** (choose your OS)
   
   **Windows (PowerShell)**
   ```powershell
   .\setup-env.ps1 up
   ```
   
   **Windows (CMD)**
   ```cmd
   setup-env.bat up
   ```
   
   **Linux/Mac**
   ```bash
   chmod +x setup-env.sh
   ./setup-env.sh up
   ```

3. **Access services**
   - phpMyAdmin: http://localhost:8080
   - Adminer: http://localhost:8081
   - MySQL: localhost:3307
   - Credentials: `bikevn_user` / `bikevn_pass`

### Docker Structure

```
docker/
├── docker-compose.yml   # 3 services (MySQL, phpMyAdmin, Adminer)
└── mysql.cnf           # MySQL configuration
```

### Available Commands

```bash
# Start containers
setup-env.ps1 up          # PowerShell
setup-env.bat up          # Windows CMD
./setup-env.sh up         # Linux/Mac

# Stop containers
setup-env.ps1 down
setup-env.bat down
./setup-env.sh down

# View status
setup-env.ps1 status
setup-env.bat status
./setup-env.sh status

# View logs
setup-env.ps1 logs
setup-env.bat logs
./setup-env.sh logs
```

## 📚 Documentation

### Quick Start
- **[START.md](./START.md)** - Begin here! Choose your role
- **[INDEX.md](./INDEX.md)** - Find any documentation quickly

### Daily Reference
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Commands cheat sheet (bookmark!)
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step setup guide

### Project Info
- **[README.md](./README.md)** - This file (project overview)
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete file organization

### Deployment
- **[GIT_COMMIT_GUIDE.md](./GIT_COMMIT_GUIDE.md)** - How to commit and deploy

### Additional Documentation
- See **[docs/](./docs/)** folder for API, Architecture, ERD, and more
- See **[INDEX.md](./INDEX.md)** for complete documentation index

## 👥 Team Members

- Trần Hải Đăng (Frontend)
- Trần Hoàng Phương (Backend)
- Hồ Tấn Đạt (Database, API docs, Project management)
