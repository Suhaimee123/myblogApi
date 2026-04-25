import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'ส่งความคิดเห็นใหม่' })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'ดึงข้อมูลความคิดเห็น (กรองตาม blogId ถ้ามี)' })
  @ApiQuery({ name: 'blogId', required: false, type: String, description: 'ID ของบล็อก' })
  findAll(@Query('blogId') blogId?: string) {
    // Public only sees approved comments
    return this.commentsService.findAll(blogId, 'APPROVED');
  }
}
