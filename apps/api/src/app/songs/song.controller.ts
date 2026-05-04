import { Controller, Get, Param, NotFoundException, Patch, Body, Post } from '@nestjs/common';
import { SongService } from './song.service';
import { CreateSongDto } from './create-song.dto';
import { UpdateSongDto } from './update-song.dto';

@Controller('songs')
export class SongController {
  constructor(private readonly songsService: SongService) {}

  /***************************************************************************
   * Manage the songs themselve
   ***************************************************************************/
  @Get()
  async getAllSongs() {
    return this.songsService.findAll();
  }

  @Get(':slug')
  async getSong(@Param('slug') slug: string) {
    return this.songsService.findBySlug(slug);
  }

  @Post()
  async createSong(@Body() dto: CreateSongDto) {
    return this.songsService.create(dto);
  }

  @Patch(':id')
  async updateSong(
    @Param('id') id: string,
    @Body() dto: UpdateSongDto
  ) {
    return this.songsService.update(id, dto);
  }

  @Patch(':id/toggle-active')
  async toggleSong(@Param('id') id: string) {
    return this.songsService.toggleSong(id);
  }

}