import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourceService } from "./resource.service";
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('resources')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  /***************************************************************************
   * Manage song resources themselve
   ***************************************************************************/
  @Get('song/:songId')
  async getAllResources(@Param('songId') songId: string) {
    return this.service.findById(songId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: process.env.UPLOAD_DIR || './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(pdf|txt|md|mp3)$/)) {
        return cb(new BadRequestException('Nur PDF, TXT, MD und MP3 Dateien sind erlaubt!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 1024 * 1024 * 10 }, // Limit: 10MB
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('songId') songId: string,
    @Body('type') type: string,
  ) {
    if (!file) throw new BadRequestException('Datei fehlt!');
    return this.service.createResourceReference(songId, {
      filename: file.filename,
      type: type,
      filetype: file.originalname.endsWith('.pdf') ? 'PDF' : 'TXT'
    });
  }
}