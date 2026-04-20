import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SetlistService } from './setlist.service';
import { CreateSetlistDto } from './create-setlist.dto';

@Controller('setlists')
export class SetlistController {
  constructor(private readonly setlistService: SetlistService) {}

  @Get(':slug')
  async getSetlistBySlug(@Param('slug') slug: string) {
    return this.setlistService.findBySlug(slug);
  }

  @Get()
  async getAllSetlists() {
    return this.setlistService.findAll();
  }

  @Post()
  async createSetlist(@Body() dto: CreateSetlistDto) {
    return this.setlistService.create(dto);
  }

  /***************************************************************************
   * Manage the entries of a setlist
   ***************************************************************************/
  @Post(':slug/entries')
  async addSongToSetlist(
    @Param('slug') slug: string,
    @Body() dto: { songId: string; position: number }
  ) {
    return this.setlistService.addSongToSetlist(slug, dto.songId, dto.position);
  }

  @Delete('entries/:entryId')
  async removeSongFromSetlist(@Param('entryId') entryId: string) {
    return this.setlistService.removeSongFromSetlist(entryId);
  }

  @Patch(':slug/entries/reorder')
  async reorderEntries(
    @Param('slug') slug: string,
    @Body() dto: { entryId: string; newPosition: number }
  ) {
    return this.setlistService.reorder(slug, dto.entryId, dto.newPosition);
  }
}