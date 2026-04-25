import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function generateShortId(length: number = 4): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  console.log('🌱 Starting seeding...');

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.blogImage.deleteMany();
  await prisma.blog.deleteMany();

  // 1. Create Admin User
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: 'h5dN',
      username: 'admin',
      password: '$2b$10$cVg9u.vtnUEHmP8SWi/rgODCYuCLndWolCI36VdiU7GdYzcfZ.FPi', // เดิมของพี่
      name: 'Administrator',
    },
  });
  console.log('👤 Admin user is ready.');

  const blogs = [
    { title: 'เริ่มต้นเขียน Blog ด้วย Next.js และ NestJS', summary: 'แชร์ประสบการณ์การสร้างบล็อกส่วนตัวแบบพรีเมียม' },
    { title: '10 เทคนิคการแต่ง CSS ให้ดูแพง', summary: 'เปลี่ยนเว็บธรรมดาให้ดูเหมือนมืออาชีพด้วย CSS Variables' },
    { title: 'ทำไมต้องใช้ Prisma ในปี 2024?', summary: 'สรุปข้อดีของการใช้ Type-safe ORM สำหรับโปรเจกต์ขนาดใหญ่' },
    { title: 'สรุป Roadmap การเป็น Full-stack Developer', summary: 'เส้นทางลัดสำหรับผู้ที่ต้องการเริ่มต้นสายงานโปรแกรมเมอร์' },
    { title: 'จัดการรูปภาพด้วย Firebase Storage', summary: 'วิธีอัปโหลดและจัดการรูปภาพแบบไร้รอยต่อในแอปของคุณ' },
    { title: 'เรียนรู้เรื่อง Soft Delete ในฐานข้อมูล', summary: 'ลบข้อมูลยังไงให้ไม่หาย และกู้คืนได้ง่ายๆ' },
    { title: 'เทคนิคการทำ SEO ให้บล็อกติดหน้าแรก', summary: 'รวมวิธีปรับแต่งคอนเทนต์ให้ถูกใจ Google' },
    { title: 'Next.js 15 มีอะไรใหม่บ้าง?', summary: 'อัปเดตฟีเจอร์ล่าสุดของ React Framework ยอดนิยม' },
    { title: 'ใช้ Tailwind CSS ยังไงให้ไม่รก', summary: 'การจัดการ Class ใน Tailwind ให้ดูเป็นระเบียบและอ่านง่าย' },
    { title: 'ความลับของระบบ Admin ที่ดี', summary: 'เบื้องหลังการทำ Dashboard ให้ลื่นไหลและใช้งานง่าย' },
  ];

  for (let i = 0; i < blogs.length; i++) {
    const b = blogs[i];
    const blogId = generateShortId(4);
    
    await prisma.blog.create({
      data: {
        id: blogId,
        title: b.title,
        slug: `${b.title.toLowerCase().replace(/\s+/g, '-')}-${blogId}`,
        summary: b.summary,
        content: `นี่คือเนื้อหาของบทความเรื่อง ${b.title}. การเขียนบล็อกเป็นวิธีที่ดีในการแบ่งปันความรู้และบันทึกประสบการณ์ของเรา...`,
        published: Math.random() > 0.3,
        viewCount: Math.floor(Math.random() * 1000),
        comments: {
          create: [
            {
              id: generateShortId(6),
              name: 'ผู้อ่านขี้สงสัย',
              message: 'บทความดีมากเลยครับ ขอบคุณที่แชร์ครับ!',
              status: 'APPROVED',
            },
            {
              id: generateShortId(6),
              name: 'Developer หน้าใหม่',
              message: 'สอนทำระบบ Login ด้วยได้ไหมครับ?',
              status: 'PENDING',
            },
          ],
        },
        additionalImages: {
          create: [
            {
              id: generateShortId(4),
              url: `https://picsum.photos/seed/${blogId}/800/400`,
            },
          ],
        },
      },
    });
    console.log(`✅ Created blog: ${b.title}`);
  }

  console.log('🚀 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
