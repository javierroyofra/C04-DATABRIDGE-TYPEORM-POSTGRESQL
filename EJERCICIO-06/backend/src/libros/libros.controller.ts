import { Controller, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { Libro } from './libro.entity';
import { LibrosService } from './libros.service';

@Controller('libros')
export class LibrosController {
  constructor(private readonly service: LibrosService) {}

  @Get()
  findAll(): Promise<Libro[]> {
    return this.service.findAll();
  }

  @Patch(':id/leido')
  markAsRead(@Param('id', ParseIntPipe) id: number): Promise<Libro> {
    return this.service.markAsRead(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
