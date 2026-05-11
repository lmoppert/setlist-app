import { NotFoundException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /***************************************************************************
   * Query uers
   ***************************************************************************/
  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) throw new NotFoundException('Song nicht gefunden');
    return user;
  }
}