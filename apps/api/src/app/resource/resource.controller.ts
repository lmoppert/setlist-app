import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourceService } from "./resource.service";
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadResourceDto } from "./upload-resource.dto";
import { Category, FileType } from '../database/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
    @Body() dto: UploadResourceDto,
  ) {
    if (!file) throw new BadRequestException('Datei fehlt!');
    const extension = extname(file.originalname).toLocaleLowerCase();
    const extensionMap: Record<string, FileType>= {
      '.txt': FileType.TXT,
      '.pdf': FileType.PDF,
      '.md': FileType.MD,
      '.mp3': FileType.MP3,
    }
    const filetype = extensionMap[extension];
    if (!filetype) { throw new BadRequestException('Ungültiger Dateityp'); }

    return this.service.createResource(
      dto.songId,
      {
        filename: file.filename,
        type: dto.type,
        filetype: filetype, 
      },
    );
  }

  @Delete(':id')
  async deleteSetlist(@Param('id') id: string) {
    return this.service.deleteResource(id)
  }
}