import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SongsController } from './songs/songs.controller';
import { SetlistService } from './setlists/setlist.service';
import { SetlistController } from './setlists/setlist.controller';
import { MemberController } from './members/members.controller';

@Module({
  imports: [],
  controllers: [
    SongsController,
    SetlistController,
    MemberController,
  ],
  providers: [
    PrismaService,
    SetlistService
  ],
})
export class AppModule {}
