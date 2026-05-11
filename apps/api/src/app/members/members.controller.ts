import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('members')
export class MemberController {
  constructor(private prisma: PrismaService) {}
  
  @Get()
  async getAllMembers() {
    return this.prisma.member.findMany();
  }
}