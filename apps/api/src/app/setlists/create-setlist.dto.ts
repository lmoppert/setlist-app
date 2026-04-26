import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ISetlistBase } from '@setlist-app/shared-types'

export class CreateSetlistDto implements ISetlistBase {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  date?: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}