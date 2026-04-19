import { Body, Controller, Get, Post } from '@nestjs/common';
import { SetlistService } from './setlist.service';
import { CreateSetlistDto } from './create-setlist.dto';

@Controller('gigs')
export class SetlistController {
  constructor(private readonly setlistService: SetlistService) {}

  @Get()
  async getAllGigs() {
    return this.setlistService.findAll();
  }

  @Post()
  async createGig(@Body() dto: CreateSetlistDto) {
    return this.setlistService.create(dto);
  }
}