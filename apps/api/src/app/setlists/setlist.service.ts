import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSetlistDto } from './create-setlist.dto';

@Injectable()
export class SetlistService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.gig.findMany({
      include: {
        setlist: {
          include: {
            entries: {
              include: {
                song: true // Holt die Song-Details direkt mit
              },
              orderBy: { order: 'asc' } // Wichtig für die Reihenfolge!
            }
          }
        }
      },
      orderBy: { date: 'desc' } // Aktuellste Gigs zuerst
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
        //slug: dto.date + dto.location.
        location: dto.location,
        name: dto.name,
        date: new Date(dto.date), 
        duration: dto.duration,
      }
    })
  }
}