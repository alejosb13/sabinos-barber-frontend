import { Producto } from './Producto.model';

export interface Venta {
  id?: number;

  cliente_id: number;

  total: number;

  producto_id: number;
  Producto?: Producto;

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}
