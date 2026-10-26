import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  autor: string;

  @Column()
  genero: string;

  @Column('boolean', { default: false })
  leido: boolean;
}
