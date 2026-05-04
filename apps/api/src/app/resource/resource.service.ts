import { NotFoundException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  /***************************************************************************
   * Query resources
   ***************************************************************************/
  async findById(songId: string) {
    return this.prisma.songResource.findMany({
      where: { songId },
      orderBy: [
        { type: 'asc' }
      ]
    });
  }
}