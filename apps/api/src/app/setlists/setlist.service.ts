import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSetlistDto } from './create-setlist.dto';
import { slugify } from 'apps/api/prisma/utils';

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

  async findOneBySlug(slug: string) {
    const setlist = await this.prisma.setlist.findUnique({
      where: { slug },
      include: {
        entries: {
          include: {
            song: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      }
    });
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
}