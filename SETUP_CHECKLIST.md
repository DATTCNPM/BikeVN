# 🎯 BikeVN Docker Setup - Checklist for Team

Use this checklist when setting up BikeVN locally for the first time.

---

## ✅ Pre-Setup Checklist

- [ ] Git installed and working
- [ ] Docker Desktop installed (v29+)
- [ ] Docker running on your machine
- [ ] Have 2GB+ free disk space
- [ ] Ports available: 3307, 8080, 8081
- [ ] Administrator/sudo access (may be needed)

### Check Ports in Use (Optional)
```bash
# Windows (PowerShell)
netstat -ano | findstr "3307|8080|8081"

# Linux/Mac
lsof -i :3307
lsof -i :8080
lsof -i :8081
```

---

## 🚀 Setup Steps

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd BikeVN
```
- [ ] Repository cloned
- [ ] In BikeVN folder

### Step 2: Verify Files
```bash
# Windows
dir | findstr "docker setup-env"

# Linux/Mac
ls -la | grep docker
ls -la | grep setup-env
```
- [ ] `docker/` folder exists
- [ ] `setup-env.ps1` exists (Windows)
- [ ] `setup-env.bat` exists (Windows)
- [ ] `setup-env.sh` exists (Linux/Mac)
- [ ] `.env` file exists

### Step 3: Check Environment File
```bash
# Verify .env exists and readable
cat .env | head -10
```
Should show:
```
# ========================================
# BikeVN Docker Environment Configuration
```
- [ ] `.env` file is readable
- [ ] Has database configuration

### Step 4: Start Docker Services

**Choose ONE based on your OS:**

#### Windows (PowerShell)
```powershell
.\setup-env.ps1 up
```
- [ ] Command executed
- [ ] See "Containers started" message
- [ ] Wait 10 seconds for MySQL to be healthy

#### Windows (CMD)
```cmd
setup-env.bat up
```
- [ ] Command executed
- [ ] See "Containers started" message
- [ ] Wait 10 seconds for MySQL to be healthy

#### Linux/Mac (Bash)
```bash
chmod +x setup-env.sh
./setup-env.sh up
```
- [ ] Script permissions set
- [ ] Command executed
- [ ] See "Containers started" message
- [ ] Wait 10 seconds for MySQL to be healthy

### Step 5: Verify Containers Running
```bash
# Windows (PowerShell)
.\setup-env.ps1 status

# Windows (CMD)
setup-env.bat status

# Linux/Mac
./setup-env.sh status
```

Should see:
```
NAME                     STATUS              PORTS
bikevn_mysql            Up X seconds        0.0.0.0:3307->3306/tcp
bikevn_phpmyadmin       Up X seconds        0.0.0.0:8080->80/tcp
bikevn_adminer          Up X seconds        0.0.0.0:8081->8080/tcp
```

- [ ] bikevn_mysql is "Up"
- [ ] bikevn_phpmyadmin is "Up"
- [ ] bikevn_adminer is "Up"

---

## 🗄️ Database Access Tests

### Test 1: phpMyAdmin Web UI
1. Open browser: http://localhost:8080
2. Login with:
   - Username: `bikevn_user`
   - Password: `bikevn_pass`
3. Should see `bikevn_db` database

- [ ] phpMyAdmin loads
- [ ] Login successful
- [ ] See bikevn_db

### Test 2: Adminer Web UI
1. Open browser: http://localhost:8081
2. Fill in form:
   - System: MySQL
   - Server: mysql
   - Username: `bikevn_user`
   - Password: `bikevn_pass`
   - Database: bikevn_db (optional)
3. Click "Login"

- [ ] Adminer loads
- [ ] Login successful
- [ ] See bikevn_db

### Test 3: Direct MySQL Connection
**From Windows (PowerShell):**
```powershell
# Try to connect via localhost:3307
mysql -h 127.0.0.1 -P 3307 -u bikevn_user -p

# Enter password: bikevn_pass
# Try this command:
SHOW DATABASES;
```

**From Linux/Mac:**
```bash
mysql -h localhost -P 3307 -u bikevn_user -p
# Enter password: bikevn_pass
SHOW DATABASES;
```

- [ ] MySQL client installed locally (optional)
- [ ] Can connect to localhost:3307
- [ ] Can run queries

### Test 4: Check Database Schema
From phpMyAdmin or Adminer, verify tables:
```sql
USE bikevn_db;
SHOW TABLES;
```

Should show 10 tables:
- [ ] users
- [ ] branches
- [ ] vehicles
- [ ] bookings
- [ ] payments
- [ ] vehicle_returns
- [ ] conversations
- [ ] conversation_members
- [ ] messages
- [ ] reviews

### Test 5: Check Sample Data
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM vehicles;
```

Should show:
- [ ] 6 users
- [ ] 19 vehicles

---

## 🔧 Common Issues & Fixes

### Issue: Containers not starting
**Solution:**
```bash
# Check Docker is running
docker ps

# Check logs
.\setup-env.ps1 logs        # Windows
./setup-env.sh logs         # Linux/Mac

# Restart
.\setup-env.ps1 down
.\setup-env.ps1 up
```

- [ ] Docker daemon running
- [ ] Checked logs for errors
- [ ] Restarted if needed

### Issue: Cannot connect to port 3307
**Solution:**
```bash
# Check if port is in use
netstat -ano | findstr "3307"     # Windows
lsof -i :3307                     # Linux/Mac

# If occupied, change in .env:
# DB_PORT=3308
```

- [ ] Port not in use
- [ ] If needed, changed DB_PORT in .env

### Issue: phpMyAdmin/Adminer not loading
**Solution:**
```bash
# Check container status
.\setup-env.ps1 status

# Wait 20 seconds for MySQL to be healthy
# Then try again
```

- [ ] Waited for MySQL to be healthy
- [ ] Checked firewall settings

---

## 📚 Documentation References

After setup, check these files for more info:
- [ ] Read [QUICKSTART.md](./QUICKSTART.md) - Quick reference
- [ ] Read [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Complete guide
- [ ] Read [DOCKER_ORGANIZATION.md](./DOCKER_ORGANIZATION.md) - File structure
- [ ] Check [.env](./.env) - Configuration details

---

## 🧪 Verification Summary

### All Tests Passed?
- [ ] Docker containers running
- [ ] phpMyAdmin accessible (8080)
- [ ] Adminer accessible (8081)
- [ ] Can login with credentials
- [ ] Database tables visible
- [ ] Sample data present
- [ ] No errors in logs

---

## ✅ Setup Complete!

Once all checkmarks are done, you have:
- ✅ Fully configured MySQL database
- ✅ Access via web UIs
- ✅ Direct database connection
- ✅ Ready for backend/frontend development

---

## 🆘 Need Help?

1. Check [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) troubleshooting section
2. Review logs: `.\setup-env.ps1 logs`
3. Ask team members for help
4. Check if Docker Desktop is running

---

**Checklist Version**: 1.0  
**Last Updated**: May 21, 2026  
**Estimated Setup Time**: 10-15 minutes (including Docker startup)

---

**Remember:** 
- Docker must be running on your machine
- First-time setup takes longer for MySQL to initialize
- Be patient with the 20-second health check startup
- All credentials are in `.env` file
