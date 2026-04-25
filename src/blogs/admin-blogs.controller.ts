import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Admin/Blogs')
@ApiBearerAuth()
@Controller('admin/blogs')
@UseGuards(JwtAuthGuard)
export class AdminBlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiOperation({ summary: 'สร้างบล็อกใหม่' })
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลบล็อกทั้งหมดสำหรับ Admin (รวมถึงฉบับร่างและที่ถูกลบ)' })
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
      publishedOnly: false, // Admin sees everything
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'ดึงข้อมูลบล็อกเนื้อหาเดียวด้วย ID (สำหรับ Admin)' })
  findOne(@Param('id') id: string) {
    return this.blogsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'แก้ไขข้อมูลบล็อก' })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบบล็อก' })
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
