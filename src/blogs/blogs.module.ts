import { Module } from '@nestjs/common'; // Trigger Recompile
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { AdminBlogsController } from './admin-blogs.controller';

import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [BlogsController, AdminBlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
