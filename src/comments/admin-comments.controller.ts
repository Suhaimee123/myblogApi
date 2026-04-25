import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Admin/Comments')
@ApiBearerAuth()
@Controller('admin/comments')
@UseGuards(JwtAuthGuard)
export class AdminCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลความคิดเห็นทั้งหมดสำหรับ Admin (กรองตาม blogId หรือสถานะ)' })
  @ApiQuery({ name: 'blogId', required: false, type: String, description: 'ID ของบล็อก' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'APPROVED', 'REJECTED'], description: 'สถานะของความคิดเห็น' })
  findAll(@Query('blogId') blogId?: string, @Query('status') status?: string) {
    return this.commentsService.findAll(blogId, status);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'อนุมัติความคิดเห็น' })
  approve(@Param('id') id: string) {
    return this.commentsService.approve(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'ไม่อนุมัติความคิดเห็น' })
  reject(@Param('id') id: string) {
    return this.commentsService.reject(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'ลบความคิดเห็น' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
