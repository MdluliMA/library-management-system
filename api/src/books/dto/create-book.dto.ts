import { Type } from 'class-transformer';
import { IsInt, IsISBN, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  author!: string;

  @IsString()
  @IsNotEmpty()
  @IsISBN()
  isbn!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalCopies!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9999)
  publishedYear?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  genreId!: number;
}
