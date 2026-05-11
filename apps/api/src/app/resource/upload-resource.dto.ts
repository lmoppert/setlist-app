import { IsEnum, IsUUID } from 'class-validator';

import {
  Category,
  FileType,
} from '../database/client';

export class UploadResourceDto {
  @IsUUID()
  songId!: string;

  @IsEnum(Category)
  type!: Category;

  @IsEnum(FileType)
  filetype!: FileType;
}