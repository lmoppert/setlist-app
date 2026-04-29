import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('songs')
export class SongsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAllSongs() {
    return this.prisma.song.findMany({
      include: {
        instruments: {
          include: {
            member: true
          }
        }
      }
    });
  }

  @Get(':id')
  async getSong(@Param('id') id: string) {
    const song = await this.prisma.song.findUnique({
      where: { id },
      include: {
        instruments: {
          include: {
            member: true
          }
        }
      }
    });

    if (!song) throw new NotFoundException('Song nicht gefunden');
    return song;
  }
}