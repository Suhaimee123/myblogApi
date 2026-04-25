import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลบล็อกที่เผยแพร่แล้วทั้งหมด พร้อมระบบค้นหาและแบ่งหน้า' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'คำค้นหา' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'หน้าที่ (ค่าเริ่มต้น: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'จำนวนต่อหน้า (ค่าเริ่มต้น: 10)' })
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.blogsService.findAll({
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      publishedOnly: true, // Public sees only published
    });
  }

  @Get('check-id/:id')
  @ApiOperation({ summary: 'ตรวจสอบว่ามี ID บล็อกนี้อยู่ในระบบแล้วหรือไม่' })
  checkId(@Param('id') id: string) {
    return this.blogsService.checkId(id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'ดึงข้อมูลบล็อกเนื้อหาเดียวด้วย Slug' })
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findOne(slug);
  }
}
