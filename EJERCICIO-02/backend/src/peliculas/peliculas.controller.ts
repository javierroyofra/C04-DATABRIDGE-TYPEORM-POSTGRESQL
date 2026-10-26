// peliculas.controller.ts
// RESPONSABILIDAD: exponer GET /peliculas.
import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { Pelicula } from './peliculas.entity';
import { PeliculasService } from './peliculas.service';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly service: PeliculasService) {}

  @Get()
  findAll(): Promise<Pelicula[]> {
    return this.service.findAll();
  }

  @Patch(':id/favorita')
  toggleFavorita(@Param('id', ParseIntPipe) id: number): Promise<Pelicula> {
    return this.service.toggleFavorita(id);
  }
}
