import { UserAuth } from './Auth';
import { Cliente } from './Cliente.model';
import { MetodoPago } from './MetodoPago.model';
import { Producto } from './Producto.model';
import { Usuario } from './Usuario.model';

export interface Venta {
  id?: number;

  cliente_id: number;
  cliente?: Cliente;

  total: number;

  venta_detalle?: VentaDetalle[];

  producto_id: number;
  Producto?: Producto;

  metodo_pago_sum_monto?: number;

  metodo_pago?: any[];

  user_id: number;
  user?: Usuario;

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface VentaDetalle {
  id?: number;

  venta_id: number;
  precio: number;
  precio_unitario: number;
  cantidad: number;
  estado: number;
  gratis: number;

  producto_id: number;
  producto?: Producto;

  created_at?: string;
  updated_at?: string;
}
