import { Type } from 'class-transformer';
import { IsInt, IsISBN, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  author?: string;

  @IsOptional()
  @IsString()
  @IsISBN()
  isbn?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalCopies?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9999)
  publishedYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  genreId?: number;
}
