export interface Servicios {
  id?: number;

  descripcion: string;
  precio: number;
  precio_nomina: number;

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}
