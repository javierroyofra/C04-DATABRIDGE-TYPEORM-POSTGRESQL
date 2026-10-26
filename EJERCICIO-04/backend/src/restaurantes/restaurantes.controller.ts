// restaurantes.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateRestauranteDto } from './create-restaurante.dto';
import { Restaurante } from './restaurante.entity';
import { RestaurantesService } from './restaurantes.service';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly service: RestaurantesService) {}

  @Post()
  create(
    @Body() dto: CreateRestauranteDto,
  ): Promise<Restaurante> {
    return this.service.create(dto);
  }
}