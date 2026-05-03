import { IsString, IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';
import { ISong } from '@setlist-app/shared-types'

export class CreateSongDto implements ISong {
  @IsBoolean()
  isActive: boolean = true;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  artist?: string;

  @IsNumber()
  @Min(0)
  duration: number=0;

  @IsOptional()
  @IsString()
  tempo?: number;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  leadVocals?: string;
}