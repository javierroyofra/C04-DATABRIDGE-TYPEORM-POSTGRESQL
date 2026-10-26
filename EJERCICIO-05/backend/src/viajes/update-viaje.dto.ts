// Todas las propiedades son opcionales porque PATCH modifica solo una parte.
export class UpdateViajeDto {
  destino?: string;
  pais?: string;
  fecha?: string;
  estado?: string;
}
