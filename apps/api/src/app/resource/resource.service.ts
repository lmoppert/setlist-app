import { NotFoundException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { join } from 'node:path';
import { readFile, unlink } from 'node:fs/promises';
import type { Category, FileType } from '../database/client';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);
  readonly uploadDir = process.env.UPLOAD_DIR || 'uploads';

  constructor(private prisma: PrismaService) {}

  /***************************************************************************
   * Query resources
   ***************************************************************************/
  async findById(songId: string) {
    const resources = await this.prisma.songResource.findMany({
      where: { songId },
      orderBy: [{ type: 'asc' }],
    });
    return Promise.all(
      resources.map(async (res) => {
        if (res.filetype === 'TXT') {
          try {
            const absolutePath = join(this.uploadDir, res.path);
            const content = await readFile(absolutePath, 'utf-8');
            return { ...res, content };
          } catch (error) {
            this.logger.error(`Fehler beim Lesen der Datei ${res.path}:`, error);
            return { ...res, content: 'Fehler beim Laden der Datei.' };
          }
        }
        return res;
      })
    )
  }

  /***************************************************************************
   * Manage resources
   ***************************************************************************/
  async createResource(songId: string, data: { filename: string, type: Category, filetype: FileType }) {
    return this.prisma.songResource.create({
      data: {
        songId,
        type: data.type,
        filetype: data.filetype,
        path: data.filename,
      }
    });
  }

  async deleteResource(id: string) {
    const res = await this.prisma.songResource.findUnique({ where: { id } });
    if (res) {
      const fullPath = join(this.uploadDir, res.path);
      await unlink(fullPath).catch(() => {}); // Datei löschen (Fehler ignorieren falls weg)
      await this.prisma.songResource.delete({ where: { id } });
    }
  }
}