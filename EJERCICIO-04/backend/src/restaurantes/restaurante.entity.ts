import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column()
  ciudad: string;

  @Column('decimal', { precision: 3, scale: 1 })
  puntuacion: number;

  @Column('int')
  precioMedio: number;
}

