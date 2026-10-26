// peliculas.service.ts
// Incluimos datos iniciales para poder concentrarnos en aprender find().
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './peliculas.entity';

@Injectable()
export class PeliculasService implements OnModuleInit {
  constructor(@InjectRepository(Pelicula) private readonly repository:Repository<Pelicula>){}

  async onModuleInit(){
    if(await this.repository.count()===0){
      await this.repository.save([
        this.repository.create({titulo:'Interstellar',genero:'Ciencia ficción',anio:2014,puntuacion:9.2}),
        this.repository.create({titulo:'Coco',genero:'Animación',anio:2017,puntuacion:8.8}),
      ]);
    }
  }

  // Concepto protagonista: find() recupera la colección.
  findAll():Promise<Pelicula[]>{
    return this.repository.find({order:{puntuacion:'DESC'}});
  }

  async toggleFavorita(id: number): Promise<Pelicula> {
    const pelicula = await this.repository.findOneBy({ id });
    if (!pelicula) {
      throw new NotFoundException(`No existe la película con id ${id}`);
    }

    pelicula.favorita = !pelicula.favorita;
    return this.repository.save(pelicula);
  }
}
