import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SongsController } from './songs/songs.controller';
import { SetlistService } from './setlists/setlist.service';
import { SetlistController } from './setlists/setlist.controller';

@Module({
  imports: [],
  providers: [PrismaService, SetlistService],
  controllers: [SongsController, SetlistController],
})
export class AppModule {}
