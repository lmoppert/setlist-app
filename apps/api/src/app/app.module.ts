import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './prisma.service';

import { SongController } from './songs/song.controller';
import { SetlistService } from './setlists/setlist.service';
import { SetlistController } from './setlists/setlist.controller';
import { MemberController } from './members/members.controller';
import { SongService } from './songs/song.service';
import { ResourceController } from './resource/resource.controller';
import { ResourceService } from './resource/resource.service';
import { UserService } from './users/user.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [
    SongController,
    SetlistController,
    MemberController,
    ResourceController,
  ],
  providers: [
    PrismaService,
    UserService,
    SongService,
    SetlistService,
    ResourceService,
  ],
})
export class AppModule {}
