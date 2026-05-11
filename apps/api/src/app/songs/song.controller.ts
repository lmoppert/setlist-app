import { Controller, Get, Param, Patch, Body, Post, UseGuards } from '@nestjs/common';
import { SongService } from './song.service';
import { CreateSongDto } from './create-song.dto';
import { UpdateSongDto } from './update-song.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('songs')
export class SongController {
  constructor(private readonly service: SongService) {}

  /***************************************************************************
   * Manage the songs themselve
   ***************************************************************************/
  @Get()
  async getAllSongs() {
    return this.service.findAll();
  }

  @Get(':slug')
  async getSong(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Post()
  async createSong(@Body() dto: CreateSongDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  async updateSong(
    @Param('id') id: string,
    @Body() dto: UpdateSongDto
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id/toggle-active')
  async toggleSong(@Param('id') id: string) {
    return this.service.toggleSong(id);
  }
}