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
}
