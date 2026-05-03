import { NotFoundException, Injectable } from '@nestjs/common';
import { slugify } from '@setlist-app/shared-utils';
import { PrismaService } from '../prisma.service';
import { CreateSongDto } from './create-song.dto';
import { UpdateSongDto } from './update-song.dto';

@Injectable()
export class SongService {
  constructor(private prisma: PrismaService) {}

  /***************************************************************************
   * Query songs
   ***************************************************************************/
  async findAll() {
    return this.prisma.song.findMany({
      include: {
        instruments: {
          include: {
            member: true
          }
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { title: 'asc' }
      ]
    });
  }
  async findBySlug(slug: string) {
    const song = await this.prisma.song.findUnique({
      where: { slug },
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

  /***************************************************************************
    * Manage songs
    ***************************************************************************/
  async create(dto: CreateSongDto) {
    return this.prisma.song.create({
      data: {
        title: dto.title,
        slug: slugify(dto.title),
        artist: dto.artist,
        duration: dto.duration,
        leadVocals: dto.leadVocals,
      }
    })
  }
  async update(slug: string, dto: UpdateSongDto) {
    const song = await this.prisma.song.findUnique({
      where: { slug },
      select: { title: true }
    });
    if (!song) throw new NotFoundException('Song nicht gefunden');
    const title = dto.title ? dto.title : song.title;
    
    return this.prisma.song.update({
      where: { slug },
      data: {
        title: title,
        slug: slugify(title),
        artist: dto.artist,
        duration: dto.duration,
        leadVocals: dto.leadVocals,
      }
    });
  }

  /***************************************************************************
   * Update song status
   ***************************************************************************/
  async toggleSong(id: string) { 
    const song = await this.prisma.song.findUnique({
      where: { id },
      select: { isActive: true }
    });
    if (!song) throw new NotFoundException('Song nicht gefunden');
    return this.prisma.song.update({
      where: { id },
      data: {
        isActive: { set: !song.isActive }
      }
    });
  }

}
