import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsController } from './songs.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [AppController, SongsController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
