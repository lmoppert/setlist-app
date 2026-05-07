import { IsString, IsOptional, IsNumber, Min, IsBoolean, ValidateNested, IsArray } from 'class-validator';
import { ISong } from '@setlist-app/shared-types'
import { Type } from 'class-transformer';

// Hilfs-DTO für die Instrumente innerhalb des Songs
export class CreateSongInstrumentDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  tuning?: string;

  @IsString()
  memberId!: string;
}

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSongInstrumentDto)
  instruments?: CreateSongInstrumentDto[];
}