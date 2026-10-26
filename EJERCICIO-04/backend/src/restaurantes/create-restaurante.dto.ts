// Describe los datos que el cliente envía al crear un restaurante.
export class CreateRestauranteDto {
  nombre: string;
  tipo: string;
  ciudad: string;
  puntuacion: number;
  precioMedio: number;
}
