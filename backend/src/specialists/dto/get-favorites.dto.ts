import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { GetSpecialistsQueryDto } from './get-specialists.dto';

export class GetFavoritesQueryDto extends GetSpecialistsQueryDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    // Accept both ids=sp-1,sp-2 and ids[]=sp-1&ids[]=sp-2
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(',').filter(Boolean);
    return [];
  })
  ids?: string[];
}

