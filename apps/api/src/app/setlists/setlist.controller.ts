import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SetlistService } from './setlist.service';
import { CreateSetlistDto } from './create-setlist.dto';
import { UpdateSetlistDto } from './update-setlist.dto';

@Controller('setlists')
export class SetlistController {
  constructor(private readonly setlistService: SetlistService) {}

  /***************************************************************************
   * Manage the setlists themselve
   ***************************************************************************/
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

  @Patch(':id')
  async updateSetlist(
    @Param('id') id: string, 
    @Body() dto: UpdateSetlistDto
  ) { 
    console.log('Patch:', id)
    return this.setlistService.update(id, dto); 
  }

  @Delete(':id')
  async deleteSetlist(@Param('id') id: string) {
    return this.setlistService.delete(id)
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

  @Patch('entries/:entryId')
  async toggleEntry(
    @Param('entryId') entryId: string,
    @Body() dto: { field: 'isEncore' | 'isOptional'; value: boolean }
  ) {
    return this.setlistService.toggleEntry(entryId, dto.value, dto.field);
  }
}