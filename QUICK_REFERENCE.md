# 🎴 BikeVN Docker - Quick Reference Card

**Print this or bookmark it for daily use**

---

## 🚀 STARTUP

### Windows
```powershell
.\setup-env.ps1 up
```

### Linux/Mac
```bash
./setup-env.sh up
```

---

## 🛑 SHUTDOWN

### Windows
```powershell
.\setup-env.ps1 down
```

### Linux/Mac
```bash
./setup-env.sh down
```

---

## 📊 CHECK STATUS

### Windows
```powershell
.\setup-env.ps1 status
```

### Linux/Mac
```bash
./setup-env.sh status
```

**Expected Output:**
```
NAME                 STATUS          PORTS
bikevn_mysql        Up 10s          0.0.0.0:3307->3306/tcp
bikevn_phpmyadmin   Up 5s           0.0.0.0:8080->80/tcp
bikevn_adminer      Up 5s           0.0.0.0:8081->8080/tcp
```

---

## 📋 VIEW LOGS

### Windows
```powershell
.\setup-env.ps1 logs
```

### Linux/Mac
```bash
./setup-env.sh logs
```

**Exit**: Press `Ctrl+C`

---

## 🌐 SERVICE URLS

| Service | URL | Login |
|---------|-----|-------|
| phpMyAdmin | http://localhost:8080 | bikevn_user / bikevn_pass |
| Adminer | http://localhost:8081 | mysql / mysql / bikevn_user |
| MySQL | localhost:3307 | bikevn_user / bikevn_pass |

---

## 🗄️ DATABASE INFO

```
Host: localhost
Port: 3307
User: bikevn_user
Password: bikevn_pass
Database: bikevn_db
```

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `docker/docker-compose.yml` | Service definitions |
| `docker/mysql.cnf` | MySQL config |
| `.env` | Environment variables |
| `database/schema.sql` | Database schema |
| `database/sample_data.sql` | Test data |

---

## 🔧 MANUAL DOCKER COMMANDS

```bash
# From project root, go to docker folder
cd docker

# Start services
docker-compose -f docker-compose.yml up -d

# Check status
docker-compose -f docker-compose.yml ps

# View logs
docker-compose -f docker-compose.yml logs -f

# Stop services
docker-compose -f docker-compose.yml down

# Remove data (WARNING: deletes database)
docker-compose -f docker-compose.yml down -v

# Execute command in MySQL
docker-compose -f docker-compose.yml exec mysql mysql -u bikevn_user -p
```

---

## 🐛 TROUBLESHOOTING

### Containers won't start
```powershell
# Stop everything
.\setup-env.ps1 down

# Wait 5 seconds
Start-Sleep -Seconds 5

# Start again
.\setup-env.ps1 up
```

### Port already in use
```powershell
# Change port in .env
# Find: DB_PORT=3307
# Change to: DB_PORT=3308

# Then restart
.\setup-env.ps1 down
.\setup-env.ps1 up
```

### MySQL won't connect
```powershell
# Check logs
.\setup-env.ps1 logs

# Wait longer (MySQL takes 20+ seconds first time)
# Try again in a minute
```

### Can't access web UI
```powershell
# Verify containers running
.\setup-env.ps1 status

# Check firewall isn't blocking ports 8080/8081
# Try: http://127.0.0.1:8080 instead of localhost
```

---

## 📖 DOCUMENTATION

| Need | File |
|------|------|
| Getting started | [WELCOME.md](./WELCOME.md) |
| Step by step | [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) |
| Quick commands | [QUICKSTART.md](./QUICKSTART.md) |
| Full Docker guide | [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) |
| File structure | [DOCKER_ORGANIZATION.md](./DOCKER_ORGANIZATION.md) |
| All docs index | [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) |

---

## ⏱️ TYPICAL DAY

```
Morning:
  .\setup-env.ps1 up              # Start work
  (Access http://localhost:8080)  # Check DB if needed
  
During Day:
  .\setup-env.ps1 status          # Check if running
  .\setup-env.ps1 logs            # If something wrong
  
Evening:
  .\setup-env.ps1 down            # End work
```

---

## 🔑 IMPORTANT PATHS

| Path | Contains |
|------|----------|
| `docker/` | Docker configuration |
| `database/` | SQL files (auto-loaded) |
| `.env` | Configuration (DO NOT commit) |
| `backend/` | Java/Spring Boot code |
| `frontend/` | React code |

---

## 📞 EMERGENCY COMMANDS

```bash
# If everything breaks
cd docker
docker-compose down -v           # Remove everything
docker-compose up -d             # Start fresh

# If still broken
docker system prune -a           # Remove all Docker stuff
# Then clone repo fresh and start over
```

---

## ✅ QUICK CHECKLIST

New day setup:
- [ ] Docker Desktop running
- [ ] Ran `.\setup-env.ps1 up`
- [ ] Can access http://localhost:8080
- [ ] Can login with bikevn_user / bikevn_pass
- [ ] Ready to code!

---

## 💾 BACKUP TIPS

```bash
# Database persists in Docker volume
# Automatically backed up when you do:
docker-compose down

# To manually backup:
docker-compose exec mysql mysqldump -u root -p bikevn_db > backup.sql

# To restore:
docker-compose exec mysql mysql -u root -p bikevn_db < backup.sql
```

---

## 🆘 NEED HELP?

| Issue | Command |
|-------|---------|
| Check what's running | `.\setup-env.ps1 status` |
| See errors | `.\setup-env.ps1 logs` |
| Restart everything | `.\setup-env.ps1 down` then `.\setup-env.ps1 up` |
| Reset data | Delete volumes (see docs) |

---

**Saved Time**: 📋 Print this for your desk!

**Updated**: May 21, 2026  
**Version**: 1.0
