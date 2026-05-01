import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSetlistDto } from './create-setlist.dto';
import { UpdateSetlistDto } from './update-setlist.dto';
import { slugify } from '@setlist-app/shared-utils';

@Injectable()
export class SetlistService {
  constructor(private prisma: PrismaService) {}

  /***************************************************************************
   * Query setlists
   ***************************************************************************/
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

  /***************************************************************************
   * Manage setlists
   ***************************************************************************/
  async create(dto: CreateSetlistDto) {
    const setlistDate = dto.date ? new Date(dto.date) : null;
    const slugBase = dto.date
      ? `${dto.date}-${dto.location}`
      : `${dto.location}-${Math.floor(Math.random() * 1000)}`;

    return this.prisma.setlist.create({
      data: {
        date: setlistDate, 
        location: dto.location,
        slug: slugify(slugBase),
        name: dto.name,
        duration: dto.duration,
      }
    })
  }

  async update(id: string, dto: UpdateSetlistDto) {
    const setlistDate = dto.date ? new Date(dto.date) : null;
    const slugBase = dto.date ? `${dto.date.substring(0,10)}-${dto.location}` : `${dto.location}`;

    return this.prisma.setlist.update({
      where: { id },
      data: {
        date: setlistDate,
        location: dto.location,
        slug: slugify(slugBase),
        name: dto.name,
        duration: dto.duration,
      }
    });
  }

  async delete(id: string) {
    return this.prisma.setlist.delete({ where: { id } })
  }

  /***************************************************************************
   * Manage setlist entries
   ***************************************************************************/
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
          setlistId: setlist.id,
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
          isAccustic: false,
          isEncore: false,
        },
      });
    });
  }

  async removeSongFromSetlist(entryId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Search entry to identify the position and setlistId
      const entry = await tx.setlistEntry.findUnique({
        where: { id: entryId }
      });
      if (!entry) {
        console.error(`Eintrag ${entryId} nicht gefunden.`)
        return;
      }

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

  async toggleEntry(entryId: string, value: boolean, field: 'isEncore' | 'isAccustic') {
    return this.prisma.$transaction(async (tx) => {
      // 1. Search entry to identify the field to toggle
      const entry = await tx.setlistEntry.findUnique({
        where: { id: entryId }
      });
      if (!entry) {
        console.error(`Eintrag ${entryId} nicht gefunden.`)
        return;
      }

      // 2. Toggle field
      await tx.setlistEntry.update({
        where: { id: entryId },
        data: { [field]: value }
      });
    })
  }

  async reorder(slug: string, entryId: string, newPosition: number) {
    return this.prisma.$transaction(async (tx) => {
      const setlist = await this.prisma.setlist.findUnique({
        where: { slug },
        select: { id: true }
      })
      if (!setlist) throw new NotFoundException('Setliste nicht gefunden');

      const entry = await tx.setlistEntry.findUnique({ where: { id: entryId } });
      if (!entry) throw new Error('Entry not found');

      const oldPosition = entry.position;

      if (newPosition < oldPosition) {
        // Move up all entries between the positions
        await tx.setlistEntry.updateMany({
          where: { setlistId: setlist.id, position: { gte: newPosition, lt: oldPosition } },
          data: { position: { increment: 1 } },
        });
      } else {
        // Move down all entries between the positions
        await tx.setlistEntry.updateMany({
          where: { setlistId: setlist.id, position: { gt: oldPosition, lte: newPosition } },
          data: { position: { decrement: 1 } },
        });
      }

      // Move song to final position
      return tx.setlistEntry.update({
        where: { id: entryId },
        data: { position: newPosition },
      });
    });
  }
}