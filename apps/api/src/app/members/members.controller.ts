import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('members')
export class MemberController {
  constructor(private prisma: PrismaService) {}
  
  @Get()
  async getAllMembers() {
    return this.prisma.member.findMany();
  }
}