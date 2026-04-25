import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { generateShortId } from '../utils/generate-id';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const { name, message, blogId } = createCommentDto;

    const thaiNumericRegex = /^[ก-๙0-9\s.,!?-]+$/;
    if (!thaiNumericRegex.test(message)) {
      throw new BadRequestException('ข้อความต้องเป็นภาษาไทยและตัวเลขเท่านั้น');
    }

    return this.prisma.comment.create({
      data: {
        id: generateShortId(),
        name,
        message,
        blogId,
        status: 'PENDING',
      },
    });
  }

  async findAll(blogId?: string, status?: string) {
    return this.prisma.comment.findMany({
      where: {
        blogId,
        status: status as any,
      },
      orderBy: { createdAt: 'desc' },
      include: { blog: { select: { title: true } } },
    });
  }

  async approve(id: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async reject(id: string) {
    return this.prisma.comment.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async remove(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
