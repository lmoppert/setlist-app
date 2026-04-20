import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSetlistDto } from './create-setlist.dto';
import { slugify } from '@setlist-app/shared-utils';

@Injectable()
export class SetlistService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.setlist.findMany({
      include: {
        entries: {
          include: {
            song: true
          },
          orderBy: { position: 'asc' }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  async findBySlug(slug: string) {
    const setlist = await this.prisma.setlist.findUnique({
      where: { slug },
      include: {
        entries: {
          include: { song: true, },
          orderBy: { position: 'asc', },
        },
      }
    });

    if (!setlist) {
      throw new NotFoundException(`Setliste mit Slug ${slug} nicht gefunden!`);
    }
    return setlist;
  }

  async create(dto: CreateSetlistDto) {
    return this.prisma.setlist.create({
      data: {
        date: new Date(dto.date), 
        location: dto.location,
        slug: slugify(dto.date + '-' + dto.location),
        name: dto.name,
        duration: dto.duration,
      }
    })
  }

  async addSongToSetlist(slug: string, songId: string, position: number) {
    const setlist = await this.prisma.setlist.findUnique({
      where: { slug },
      select: { id: true }
    })
    if (!setlist) throw new NotFoundException('Setliste nicht gefunden');

    return this.prisma.$transaction(async (tx) => {
      // 1. Move all songs by one position, starting with the new entries position
      await tx.setlistEntry.updateMany({
        where: {
          slug: slug,
          position: { gte: position },
        },
        data: {
          position: { increment: 1 },
        },
      });

      // 2. Add new entry
      return tx.setlistEntry.create({
        data: {
          setlistId: setlist.id,
          songId: songId,
          position: position,
          isOptional: false,
          isEncore: false,
        },
      });
    });
  }

  async removeSongFromSetlist(entryId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Search entry to identify the position and setlistId
      const entry = await tx.setlistEntry.findUnique({ where: { id: entryId } });
      if (!entry) throw new Error('Entry not found');

      // 2. Delete entry
      await tx.setlistEntry.delete({ where: { id: entryId } });

      // 3. Move all following entries by one position
      await tx.setlistEntry.updateMany({
        where: {
          setlistId: entry.setlistId,
          position: { gt: entry.position },
        },
        data: {
          position: { decrement: 1 },
        },
      });
    });
  }

  async reorder(slug: string, entryId: string, newPosition: number) {
    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.setlistEntry.findUnique({ where: { id: entryId } });
      if (!entry) throw new Error('Entry not found');

      const oldPosition = entry.position;

      if (newPosition < oldPosition) {
        // Nach oben schieben: Alles dazwischen +1
        await tx.setlistEntry.updateMany({
          where: { slug, position: { gte: newPosition, lt: oldPosition } },
          data: { position: { increment: 1 } },
        });
      } else {
        // Nach unten schieben: Alles dazwischen -1
        await tx.setlistEntry.updateMany({
          where: { slug, position: { gt: oldPosition, lte: newPosition } },
          data: { position: { decrement: 1 } },
        });
      }

      // Den verschobenen Song auf seine finale Position setzen
      return tx.setlistEntry.update({
        where: { id: entryId },
        data: { position: newPosition },
      });
    });
  }
}