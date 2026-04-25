import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { generateShortId } from '../utils/generate-id';

@Injectable()
export class BlogsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const { additionalImages, ...data } = createBlogDto;
    return this.prisma.blog.create({
      data: {
        ...data,
        id: generateShortId(),
        additionalImages: {
          create: additionalImages?.map((url) => ({ 
            id: generateShortId(4),
            url 
          })) || [],
        },
      },
    });
  }

  async findAll(query?: { search?: string; page?: number; limit?: number; publishedOnly?: boolean }) {
    const { search, page = 1, limit = 10, publishedOnly = true } = query || {};
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };
    if (publishedOnly) where.published = true;
    if (search) {
      where.title = { contains: search };
    }

    const [items, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        skip,
        take: limit,
        include: {
          additionalImages: true,
          comments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.blog.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  async findBySlug(slug: string) {
    return this.prisma.blog.findFirst({
      where: { slug, deletedAt: null },
      include: { additionalImages: true, comments: { where: { status: 'APPROVED' } } },
    });
  }

  async findById(id: string) {
    return this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
      include: { additionalImages: true },
    });
  }

  async checkId(id: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    return { exists: !!blog };
  }

  async findOne(slug: string) {
    const blog = await this.prisma.blog.findFirst({
      where: { slug, deletedAt: null },
      include: {
        additionalImages: true,
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    // Increment view count
    await this.prisma.blog.update({
      where: { id: blog.id },
      data: { viewCount: { increment: 1 } },
    });

    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const { additionalImages, ...data } = updateBlogDto;

    // Handle additional images replacement
    if (additionalImages) {
      await this.prisma.blogImage.deleteMany({ where: { blogId: id } });
    }

    return this.prisma.blog.update({
      where: { id },
      data: {
        ...data,
        additionalImages: additionalImages
          ? {
              create: additionalImages.map((url) => ({ 
                id: generateShortId(4),
                url 
              })),
            }
          : undefined,
      },
    });
  }

  async remove(id: string) {
    // 1. Soft delete
    const blog = await this.prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    // 2. Trigger cleanup for others (deleted > 1 minute ago)
    this.cleanupDeletedBlogs();

    return blog;
  }

  private async cleanupDeletedBlogs() {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    
    // Find blogs to hard delete
    const blogsToCleanup = await this.prisma.blog.findMany({
      where: {
        deletedAt: {
          lt: oneMinuteAgo,
          not: null
        }
      },
      include: { additionalImages: true }
    });

    for (const blog of blogsToCleanup) {
      await this.hardDelete(blog);
    }
  }

  private async hardDelete(blog: any) {
    console.log(`[SoftDelete] Hard deleting blog: ${blog.id}`);
    
    // Delete physical files
    for (const image of blog.additionalImages) {
      try {
        await this.storageService.deleteFile(image.url);
      } catch (error) {
        console.error(`Failed to delete image ${image.url}:`, error.message);
      }
    }

    // Delete from DB
    await this.prisma.blog.delete({ where: { id: blog.id } });
  }
}
