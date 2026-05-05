import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SetlistService } from './setlist.service';
import { CreateSetlistDto } from './create-setlist.dto';
import { UpdateSetlistDto } from './update-setlist.dto';

@Controller('setlists')
export class SetlistController {
  constructor(private readonly service: SetlistService) {}

  /***************************************************************************
   * Manage the setlists themselve
   ***************************************************************************/
  @Get(':slug')
  async getSetlistBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get()
  async getAllSetlists() {
    return this.service.findAll();
  }

  @Post()
  async createSetlist(@Body() dto: CreateSetlistDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  async updateSetlist(
    @Param('id') id: string, 
    @Body() dto: UpdateSetlistDto
  ) { 
    return this.service.update(id, dto); 
  }

  @Delete(':id')
  async deleteSetlist(@Param('id') id: string) {
    return this.service.delete(id)
  }

  /***************************************************************************
   * Manage the entries of a setlist
   ***************************************************************************/
  @Post(':slug/entries')
  async addSongToSetlist(
    @Param('slug') slug: string,
    @Body() dto: { songId: string; position: number }
  ) {
    return this.service.addSongToSetlist(slug, dto.songId, dto.position);
  }

  @Delete('entries/:entryId')
  async removeSongFromSetlist(@Param('entryId') entryId: string) {
    return this.service.removeSongFromSetlist(entryId);
  }

  @Patch(':slug/entries/reorder')
  async reorderEntries(
    @Param('slug') slug: string,
    @Body() dto: { entryId: string; newPosition: number }
  ) {
    return this.service.reorder(slug, dto.entryId, dto.newPosition);
  }

  @Patch('entries/:entryId')
  async toggleEntry(
    @Param('entryId') entryId: string,
    @Body() dto: { field: 'isEncore' | 'isAccustic'; value: boolean }
  ) {
    return this.service.toggleEntry(entryId, dto.value, dto.field);
  }
}