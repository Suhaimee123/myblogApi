import { Controller, Get, Query, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Admin/Storage')
@ApiBearerAuth()
@Controller('admin/upload')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('signed-url')
  @ApiOperation({ summary: 'สร้าง URL สำหรับอัปโหลดไฟล์ไปยัง Firebase Storage' })
  async getSignedUrl(
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
    @Query('folder') folder: string,
  ) {
    return this.storageService.getSignedUrl(filename, contentType, folder);
  }

  @Delete()
  @ApiOperation({ summary: 'ลบไฟล์ออกจาก Firebase Storage' })
  async deleteFile(@Query('url') url: string) {
    await this.storageService.deleteFile(url);
    return { success: true };
  }
}
