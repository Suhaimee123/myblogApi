# Portfolio & Blog Backend API

ระบบหลังบ้าน (Backend) สำหรับจัดการ Blog และ Portfolio พัฒนาด้วย **NestJS** และ **Prisma ORM** พร้อมระบบเอกสาร API ด้วย **Swagger**

## 🚀 เทคโนโลยีที่ใช้

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL (บน TiDB Cloud)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Token) และ Passport
- **Storage**: Firebase Storage (สำหรับอัปโหลดรูปภาพผ่าน Signed URLs)
- **API Docs**: Swagger (OpenAPI)

---

## 🛠 การติดตั้ง (Installation)

1. **Clone Repository**

   ```bash
   git clone https://github.com/Suhaimee123/myblogApi.git
   cd myblogApi
   ```
2. **ติดตั้ง Dependencies**

   ```bash
   npm install
   ```
3. **ตั้งค่า Environment Variables**
   สร้างไฟล์ `.env` ที่โฟลเดอร์หลัก และใส่ค่าดังนี้:

   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   JWT_SECRET="your_secret_key"

   # Firebase Config (ตัวอย่าง)
   FIREBASE_PROJECT_ID="..."
   FIREBASE_CLIENT_EMAIL="..."
   FIREBASE_PRIVATE_KEY="..."
   FIREBASE_STORAGE_BUCKET="..."
   ```
4. **Sync Database Schema**
   ใช้ Prisma เพื่อสร้าง Table ในฐานข้อมูล:

   ```bash
   npx prisma db push
   ```

---

## 🏃 การรันโปรเจกต์ (Running)

```bash
# พัฒนา (Development)
npm run start:dev

# โปรดักชั่น (Production)
npm run build
npm run start:prod
```

---

## 📖 เอกสาร API (Swagger)

เมื่อรันโปรเจกต์แล้ว สามารถเข้าดูเอกสาร API และทดสอบยิง API ได้ที่:
👉 **[http://localhost:8080/api/docs](http://localhost:8080/api/docs)**

---

## 🏗 โครงสร้างโปรเจกต์ (Project Structure)

โปรเจกต์นี้ใช้โครงสร้างแบบ **Modular Architecture** ของ NestJS โดยแบ่งตามหน้าที่การทำงาน:

### 📂 โฟลเดอร์ `src/` (Core Logic)
- **`auth/`**: ระบบความปลอดภัย, Login (JWT), และ Guard ป้องกัน API
- **`blogs/`**: ระบบบล็อก (มีทั้ง `Controller` สำหรับบุคคลทั่วไป และ `AdminController` สำหรับผู้ดูแล)
- **`comments/`**: ระบบแสดงความคิดเห็น (รองรับการอนุมัติ/ไม่อนุมัติ โดย Admin)
- **`storage/`**: จัดการไฟล์ภาพ (สร้าง Signed URL เพื่ออัปโหลดเข้า Firebase Storage)
- **`prisma/`**: ตัวเชื่อมต่อฐานข้อมูล (Database Client)
- **`utils/`**: เครื่องมือเสริมอื่นๆ เช่น ตัวสร้าง ID สั้น 4 หลัก

### 📂 ไฟล์การตั้งค่า (Configurations)
- **`prisma/schema.prisma`**: นิยามโครงสร้าง Database Table
- **`nest-cli.json`**: ตั้งค่า NestJS และเปิดใช้งาน Swagger Plugin อัตโนมัติ
- **`.env`**: เก็บค่าความลับ เช่น Database URL และ JWT Secret

---

## 📝 คุณสมบัติเด่น

- **ระบบแอดมิน**: แยก Route ชัดเจน (`/admin/...`) และมีการป้องกันด้วย JwtAuthGuard
- **Swagger ภาษาไทย**: คำอธิบายแต่ละเส้น API เป็นภาษาไทยเพื่อให้เข้าใจง่าย
- **การจัดการรูปภาพ**: ใช้การสร้าง Signed URL เพื่อให้ Frontend อัปโหลดไฟล์ตรงไปที่ Firebase ได้อย่างปลอดภัย
- **Pagination & Search**: ระบบค้นหาบล็อกและแบ่งหน้าแบบมีประสิทธิภาพ
