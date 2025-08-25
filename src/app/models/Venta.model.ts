import { Producto } from './Producto.model';

export interface Venta {
  id?: number;
  producto_id: number;

  Producto?: Producto;

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}
