# BikeVN Database - Docker Setup Guide

**Última atualização**: 2024  
**Status**: ✅ Production Ready  
**Docker Compose Version**: 3.9  
**MySQL Version**: 8.0  

---

## 📋 Mục Đích

Hướng dẫn triển khai MySQL database cho BikeVN bằng Docker Compose, giúp:
- ✅ Một lệnh khởi động toàn bộ database environment
- ✅ Tự động khởi tạo schema và sample data
- ✅ Web UI để quản lý database (phpMyAdmin, Adminer)
- ✅ Dễ dàng reset database
- ✅ Consistent development environment cho toàn team

---

## 🚀 Bắt Đầu Nhanh (Quick Start)

### 1. Prerequisites

Đảm bảo đã cài đặt:
- 🐳 Docker Desktop: https://www.docker.com/products/docker-desktop
- 📦 Docker Compose: Bao gồm trong Docker Desktop

**Kiểm tra cài đặt:**
```powershell
docker --version
docker compose version
```

**Output mong đợi:**
```
Docker version 24.0.0+
Docker Compose version 2.20.0+
```

---

### 2. Cấu Hình Environment

**Copy file mẫu:**
```powershell
cd c:\Users\dat\OneDrive\Project\BikeVN
Copy-Item .env.example .env
```

**File `.env` (giữ nguyên mặc định hoặc chỉnh sửa):**
```env
DB_PORT=3306
DB_ROOT_PASSWORD=root_bikevn
DB_NAME=bikevn_db
DB_USER=bikevn_user
DB_PASSWORD=bikevn_pass
PHPMYADMIN_PORT=8080
ADMINER_PORT=8081
```

⚠️ **Quan trọng**: Thêm `.env` vào `.gitignore` (đã có sẵn)

---

### 3. Khởi Động Docker

**Khởi tạo container (lần đầu):**
```powershell
docker compose up -d
```

**Output mong đợi:**
```
[+] Running 3/3
 ✓ Network bikevn_network created
 ✓ Volume bikevn_mysql_data created
 ✓ Container bikevn_mysql created
 ✓ Container bikevn_phpmyadmin created
 ✓ Container bikevn_adminer created
```

---

### 4. Kiểm Tra Status

**Xem các container đang chạy:**
```powershell
docker compose ps
# hoặc
docker ps
```

**Output:**
```
CONTAINER ID   IMAGE              STATUS           PORTS
abc123...      mysql:8.0         Up 2 min (healthy)  0.0.0.0:3306->3306/tcp
def456...      phpmyadmin:latest Up 1 min            0.0.0.0:8080->80/tcp
ghi789...      adminer:latest    Up 1 min            0.0.0.0:8081->8080/tcp
```

**Xem logs MySQL:**
```powershell
docker compose logs -f mysql
```

---

### 5. Xác Minh Database

**Truy cập MySQL từ command line:**
```powershell
docker exec -it bikevn_mysql mysql -u bikevn_user -p bikevn_db
```

**Khi được yêu cầu password, nhập:**
```
bikevn_pass
```

**Chạy query kiểm tra:**
```sql
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT * FROM vehicles LIMIT 5;
```

---

## 🌐 Truy Cập Web UI

### phpMyAdmin
- **URL**: http://localhost:8080
- **Username**: bikevn_user
- **Password**: bikevn_pass
- **Server**: mysql

### Adminer (Lightweight)
- **URL**: http://localhost:8081
- **System**: MySQL
- **Server**: mysql
- **Username**: bikevn_user
- **Password**: bikevn_pass
- **Database**: bikevn_db

---

## 🔗 Connection Strings

### Node.js (Express/Fastify)
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'bikevn_user',
  password: process.env.DB_PASSWORD || 'bikevn_pass',
  database: process.env.DB_NAME || 'bikevn_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

### Python (FastAPI/Flask)
```python
import pymysql
from sqlalchemy import create_engine

# Direct connection
connection = pymysql.connect(
    host='localhost',
    port=3306,
    user='bikevn_user',
    password='bikevn_pass',
    database='bikevn_db',
    charset='utf8mb4'
)

# SQLAlchemy
DATABASE_URL = "mysql+pymysql://bikevn_user:bikevn_pass@localhost:3306/bikevn_db"
engine = create_engine(DATABASE_URL)
```

### Java/Spring Boot
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/bikevn_db?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=bikevn_user
spring.datasource.password=bikevn_pass
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

### PHP (Laravel)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bikevn_db
DB_USERNAME=bikevn_user
DB_PASSWORD=bikevn_pass
```

### MySQL Workbench
```
Connection Name: BikeVN Local
Hostname: 127.0.0.1
Port: 3306
Username: bikevn_user
Password: bikevn_pass
Default Schema: bikevn_db
```

---

## 📦 Cấu Trúc Docker Compose

### Services

#### 1. **MySQL Service**
```yaml
image: mysql:8.0                    # Official MySQL 8.0 image
container_name: bikevn_mysql        # Unique name
ports:
  - "3306:3306"                     # Host:Container port mapping
volumes:
  - bikevn_mysql_data:/var/lib/mysql        # Persistent data
  - ./database/schema.sql:/.../01-schema.sql # Init scripts
  - ./database/sample_data.sql:/.../02-sample_data.sql
```

#### 2. **phpMyAdmin Service**
- Web UI cho MySQL management
- Port: 8080
- Depends on MySQL

#### 3. **Adminer Service**
- Lightweight alternative to phpMyAdmin
- Port: 8081
- Single-file PHP application

---

## 💾 Volumes Giải Thích

### Named Volume: `bikevn_mysql_data`

**Mục đích:**
- Lưu trữ persistent data của MySQL
- Dữ liệu được giữ ngay cả khi container bị xóa
- Được lưu trữ trên host machine

**Vị trí trên host:**
```
Windows: %AppData%\Docker\volumes\bikevn_mysql_data\_data
Mac: /var/lib/docker/volumes/bikevn_mysql_data/_data
Linux: /var/lib/docker/volumes/bikevn_mysql_data/_data
```

**Xem volume:**
```powershell
docker volume ls
docker volume inspect bikevn_mysql_data
```

---

## 🔄 Docker Entrypoint Initdb.d

### Tương tác

Trong Docker MySQL image, folder `/docker-entrypoint-initdb.d` là nơi:
- Tất cả các `.sql` files trong folder này sẽ **tự động chạy** khi container khởi tạo
- Files được thực thi theo **thứ tự alphabetical**
- **Chỉ chạy lần đầu** khi volume trống

### File Initialization

```
/docker-entrypoint-initdb.d/
├── 01-schema.sql          # ← Chạy đầu tiên (tạo tables)
└── 02-sample_data.sql     # ← Chạy thứ hai (insert data)
```

**Lý do đặt tên với số:**
- Đảm bảo thứ tự thực thi
- 01 = schema (phải chạy trước)
- 02 = data (chạy sau)

### Tại Sao Chỉ Init Một Lần?

**Nguyên nhân:**
1. MySQL kiểm tra file `/var/lib/mysql/.dockerenv` hoặc `/var/lib/mysql/mysql/user.MYI`
2. Nếu database đã được khởi tạo → bỏ qua scripts
3. Nếu volume `bikevn_mysql_data` tồn tại → data được restore

**Kết quả:**
- ✅ Lần đầu: Scripts chạy, database được tạo
- ✅ Lần thứ 2+: Volume được reuse, scripts không chạy lại

---

## 🔧 Các Lệnh Hữu Ích

### Khởi động/Dừng

```powershell
# Khởi động containers
docker compose up -d

# Dừng containers (dữ liệu được giữ)
docker compose down

# Dừng + xóa volumes (⚠️ XÓA DỮ LIỆU)
docker compose down -v

# Xem logs
docker compose logs -f mysql
docker compose logs -f phpmyadmin

# Restart container
docker compose restart mysql
```

### Truy Cập MySQL

```powershell
# Interactive MySQL shell
docker exec -it bikevn_mysql mysql -u bikevn_user -p bikevn_db

# Run SQL command trực tiếp
docker exec bikevn_mysql mysql -u bikevn_user -p bikevn_pass -e "SELECT * FROM users;"

# Backup database
docker exec bikevn_mysql mysqldump -u bikevn_user -p bikevn_pass bikevn_db > backup.sql

# Restore database
docker exec -i bikevn_mysql mysql -u bikevn_user -p bikevn_pass bikevn_db < backup.sql
```

### Kiểm Tra & Debug

```powershell
# Xem container stats
docker stats bikevn_mysql

# Xem file system trong container
docker exec bikevn_mysql ls -la /var/lib/mysql

# Kiểm tra network
docker network inspect bikevn_network

# View MySQL config
docker exec bikevn_mysql cat /etc/mysql/conf.d/mysql.cnf
```

---

## 🔄 Reset Database

### Scenario: Cần reset về trạng thái ban đầu

**Cách 1: Giữ code, xóa data**
```powershell
# Dừng containers và xóa volumes (XÓA DỮ LIỆU)
docker compose down -v

# Khởi động lại (database được reinit từ scripts)
docker compose up -d

# Verify
docker exec -it bikevn_mysql mysql -u bikevn_user -p bikevn_db
mysql> SELECT COUNT(*) FROM users;
```

**Cách 2: Soft reset (thông qua SQL)**
```powershell
# Truy cập MySQL
docker exec -it bikevn_mysql mysql -u bikevn_user -p bikevn_db

# Xóa data nhưng giữ schema
mysql> TRUNCATE TABLE reviews;
mysql> TRUNCATE TABLE messages;
mysql> TRUNCATE TABLE conversations;
mysql> TRUNCATE TABLE vehicle_returns;
mysql> TRUNCATE TABLE payments;
mysql> TRUNCATE TABLE bookings;
mysql> TRUNCATE TABLE vehicles;
mysql> TRUNCATE TABLE branches;
mysql> TRUNCATE TABLE users;

# Reimport sample data
mysql> SOURCE /database/sample_data.sql;
```

**Cách 3: Hard reset (xóa volume)**
```powershell
# Xóa volume trực tiếp
docker volume rm bikevn_mysql_data

# Khởi tạo lại từ đầu
docker compose up -d
```

---

## 📊 Database Statistics

```sql
-- Xem kích thước database
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'bikevn_db'
GROUP BY table_schema;

-- Xem thống kê từng table
SELECT
    table_name,
    table_rows,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'bikevn_db'
ORDER BY (data_length + index_length) DESC;
```

---

## 🐛 Troubleshooting

### Problem: "Container bikevn_mysql exited with code 1"

**Giải pháp:**
```powershell
# Xem logs chi tiết
docker compose logs mysql

# Xóa volume và reset
docker compose down -v
docker compose up -d
```

### Problem: "Can't connect to MySQL: Connection refused"

**Giải pháp:**
```powershell
# Kiểm tra MySQL đã ready chưa
docker compose ps  # Kiểm tra status

# Chờ vài giây (healthcheck cần ~20s)
Start-Sleep -Seconds 30

# Thử lại
docker exec -it bikevn_mysql mysql -u bikevn_user -p bikevn_pass -e "SELECT 1;"
```

### Problem: "Port 3306 is already in use"

**Giải pháp:**
```powershell
# Thay đổi port trong .env
# DB_PORT=3307

# Hoặc kill process cũ
netstat -ano | findstr :3306
taskkill /PID <PID> /F

# Restart Docker
docker compose restart
```

### Problem: "Permission denied: /docker-entrypoint-initdb.d"

**Giải pháp:**
```powershell
# Kiểm tra quyền file
ls -la ./database/

# Cấp quyền đọc
chmod +r ./database/schema.sql ./database/sample_data.sql
```

---

## 🎯 Onboarding Guide cho Team Member Mới

### Bước 1: Setup máy development

```powershell
# Clone repo
git clone <repo-url>
cd BikeVN

# Copy .env
Copy-Item .env.example .env

# Verify Docker
docker --version
```

### Bước 2: Khởi động database

```powershell
# Một lệnh duy nhất
docker compose up -d

# Verify
docker compose ps
```

### Bước 3: Test connection

```powershell
# Truy cập phpMyAdmin
# Mở browser → http://localhost:8080
# Login với credentials từ .env
```

### Bước 4: Sử dụng trong code

**Node.js example:**
```javascript
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'bikevn_user',
  password: 'bikevn_pass',
  database: 'bikevn_db',
});

const [rows] = await connection.execute('SELECT * FROM vehicles');
console.log(rows);
```

---

## 📝 Best Practices

### ✅ DO

- ✅ Commit `docker-compose.yml` vào git
- ✅ Commit `.env.example` vào git (không commit `.env`)
- ✅ Dùng `docker compose down -v` để reset
- ✅ Specify exact MySQL version (`mysql:8.0`)
- ✅ Dùng named volumes cho persistent data
- ✅ Thêm healthcheck trong compose
- ✅ Document environment variables

### ❌ DON'T

- ❌ Không commit `.env` file (bao gồm secrets)
- ❌ Không dùng `root` user cho application
- ❌ Không lưu credentials trong code
- ❌ Không mount database files từ Windows trực tiếp
- ❌ Không dùng `docker compose up` (luôn dùng `-d`)
- ❌ Không xóa volume nếu cần backup data

---

## 📚 Tài Liệu Tham Khảo

- Docker Compose Docs: https://docs.docker.com/compose/
- MySQL Docker Image: https://hub.docker.com/_/mysql
- phpMyAdmin: https://www.phpmyadmin.net/
- Adminer: https://www.adminer.org/

---

## 📞 Support

Nếu có vấn đề:

1. Kiểm tra logs: `docker compose logs mysql`
2. Reset database: `docker compose down -v && docker compose up -d`
3. Verify status: `docker compose ps`
4. Test connection: `docker exec -it bikevn_mysql mysql -u bikevn_user -p bikevn_db`

---

**Happy Developing! 🚀**
