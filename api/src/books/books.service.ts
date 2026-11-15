import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

type BookFilters = { genreId?: string; search?: string; page?: string; limit?: string };

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: BookFilters) {
    const page = this.parsePositiveInt(filters.page, 1, 'page');
    const limit = this.parsePositiveInt(filters.limit, 10, 'limit');
    if (limit > 100) throw new BadRequestException('limit cannot exceed 100.');

    const where: Prisma.BookWhereInput = {};

    if (filters.genreId !== undefined && filters.genreId !== '') {
      const genreId = Number(filters.genreId);
      if (!Number.isInteger(genreId) || genreId < 1) {
        throw new BadRequestException('genreId must be a positive integer.');
      }
      where.genreId = genreId;
    }

    if (filters.search?.trim()) {
      const term = filters.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { author: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        include: { genre: true },
        orderBy: { title: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} was not found.`);
    return book;
  }

  async create(dto: CreateBookDto) {
    await this.ensureGenreExists(dto.genreId);
    try {
      return await this.prisma.book.create({ data: dto, include: { genre: true } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A book with this ISBN already exists.');
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    if (dto.genreId !== undefined) await this.ensureGenreExists(dto.genreId);
    try {
      return await this.prisma.book.update({ where: { id }, data: dto, include: { genre: true } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A book with this ISBN already exists.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  private async ensureGenreExists(genreId: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre) throw new NotFoundException(`Genre ${genreId} was not found.`);
  }

  private parsePositiveInt(value: string | undefined, fallback: number, field: string): number {
    if (value === undefined || value === '') return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException(`${field} must be a positive integer.`);
    }
    return parsed;
  }
}
