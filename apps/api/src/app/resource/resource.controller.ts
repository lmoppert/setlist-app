import { Controller, Get, Param } from "@nestjs/common";
import { ResourceService } from "./resource.service";

@Controller('songs')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  /***************************************************************************
   * Manage song resources themselve
   ***************************************************************************/
  @Get(':songId')
  async getAllResources(@Param('id') songId: string) {
    return this.service.findById(songId);
  }
}