import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SongController } from './songs/song.controller';
import { SetlistService } from './setlists/setlist.service';
import { SetlistController } from './setlists/setlist.controller';
import { MemberController } from './members/members.controller';
import { SongService } from './songs/song.service';
import { ResourceController } from './resource/resource.controller';
import { ResourceService } from './resource/resource.service';

@Module({
  imports: [],
  controllers: [
    SongController,
    SetlistController,
    MemberController,
    ResourceController,
  ],
  providers: [
    PrismaService,
    SongService,
    SetlistService,
    ResourceService,
  ],
})
export class AppModule {}
