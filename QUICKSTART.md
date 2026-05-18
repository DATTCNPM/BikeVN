# 🚀 BikeVN Database Quick Reference

## ⚡ Quick Start

```powershell
# Start all services
docker compose up -d

# Check status
docker compose ps

# Stop all services
docker compose down

# View logs
docker compose logs -f mysql
```

---

## 🌐 Web Access

| Service | URL | Login | Password |
|---------|-----|-------|----------|
| phpMyAdmin | http://localhost:8080 | bikevn_user | bikevn_pass |
| Adminer | http://localhost:8081 | bikevn_user | bikevn_pass |

---

## 💾 Database Connection Strings

### Node.js / JavaScript
```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  port: 3307,
  user: 'bikevn_user',
  password: 'bikevn_pass',
  database: 'bikevn_db',
  waitForConnections: true,
  connectionLimit: 10,
});
```

### Python / FastAPI
```python
DATABASE_URL = "mysql+pymysql://bikevn_user:bikevn_pass@localhost:3307/bikevn_db"
```

### Java / Spring Boot
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/bikevn_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=bikevn_user
spring.datasource.password=bikevn_pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### PHP / Laravel
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=bikevn_db
DB_USERNAME=bikevn_user
DB_PASSWORD=bikevn_pass
```

### MySQL Workbench / CLI
```bash
mysql -h localhost -P 3307 -u bikevn_user -p bikevn_db
# Enter password: bikevn_pass
```

---

## 📊 Sample Database Queries

### View all tables
```sql
USE bikevn_db;
SHOW TABLES;
```

### Count records
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM vehicles;
SELECT COUNT(*) FROM bookings;
```

### Sample data
```sql
-- View users
SELECT id, name, email, role FROM users LIMIT 5;

-- View branches
SELECT id, name, address FROM branches LIMIT 5;

-- View vehicles
SELECT id, name, brand, model, price_per_day FROM vehicles LIMIT 5;
```

---

## 🔧 Common Commands

### Access MySQL CLI inside container
```powershell
docker exec -it bikevn_mysql mysql -u bikevn_user -p bikevn_db
```

### Backup database
```powershell
docker exec bikevn_mysql mysqldump -u bikevn_user -p bikevn_pass bikevn_db > backup.sql
```

### Restore database
```powershell
docker exec -i bikevn_mysql mysql -u bikevn_user -p bikevn_pass bikevn_db < backup.sql
```

### Reset database (remove all data)
```powershell
docker compose down -v
docker compose up -d
```

### View container logs
```powershell
docker compose logs mysql
docker compose logs phpmyadmin
docker compose logs adminer
```

---

## 📝 Important Port Numbers

| Service | Port | Note |
|---------|------|------|
| MySQL | 3307 | ⚠️ NOT 3306 (due to local MySQL service) |
| phpMyAdmin | 8080 | Web UI for MySQL management |
| Adminer | 8081 | Lightweight alternative UI |

---

## 🔐 Credentials

**Root User** (for administration):
- Username: `root`
- Password: `root_bikevn`

**Application User** (for applications):
- Username: `bikevn_user`
- Password: `bikevn_pass`
- Database: `bikevn_db`

---

## 📂 File Locations

| File | Purpose | Location |
|------|---------|----------|
| Compose Config | Docker orchestration | `docker-compose.yml` |
| Environment | Configuration values | `.env` |
| MySQL Config | Database settings | `docker/mysql.cnf` |
| Schema | Database structure | `database/schema.sql` |
| Sample Data | Test data | `database/sample_data.sql` |

---

## ⚠️ Troubleshooting

### MySQL not starting?
```powershell
# Check logs
docker compose logs mysql

# Likely causes:
# 1. Port 3307 in use → Change DB_PORT in .env
# 2. Docker not running → Start Docker Desktop
# 3. Volume issues → Run: docker compose down -v
```

### Can't connect from application?
1. Verify port is **3307** (not 3306)
2. Check hostname: use **localhost** locally or **mysql** from Docker
3. Verify credentials match `.env` file
4. Ensure MySQL is healthy: `docker compose ps`

### phpMyAdmin won't load?
1. Wait 20+ seconds after docker up
2. Check: http://localhost:8080 (not 8081)
3. Verify phpmyadmin container is running
4. Try: `docker compose restart phpmyadmin`

---

## 🎓 Learning Resources

- Docker Documentation: https://docs.docker.com/compose/
- MySQL Documentation: https://dev.mysql.com/doc/
- phpMyAdmin: https://www.phpmyadmin.net/
- Adminer: https://www.adminer.org/

---

**Last Updated**: May 18, 2026  
**Status**: ✅ Ready for Use
