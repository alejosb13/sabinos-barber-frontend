import { Empleado } from './Empleado.model';
import { Local } from './Local.model';
import { MetodoPago } from './MetodoPago.model';
import { Producto } from './Producto.model';
import { TipoGasto } from './TipoGasto.model';
import { Usuario } from './Usuario.model';

export interface Gasto {
  id?: number;

  user_id: number;
  empleado_id: number;
  total?: number;
  detalle_gasto_id: number;

  is_local: number;
  pagado: number;

  empleado?: Empleado;
  user?: Usuario;
  gasto_detalle?: GastoDetalle[];
  local?: Local;
  nomina_id?: number;

  // gasto_detalle:
  metodo_pago?: MetodoPagoGasto[];
  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface GastoDetalle {
  id?: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  precio: number;
  tipo_gasto_id: number;
  comentario: string | null;

  estado: number;
  created_at?: string;
  updated_at?: string;
  gasto_id: number;

  producto?: Producto;
  tipo_gasto?: TipoGasto;
}

export interface MetodoPagoGasto {
  id?: number;

  gasto_id: number;
  local_id: number;
  metodo_pago_id: number;
  monto: number;
  metodo_pago?: MetodoPago;

  estado: number;
  updated_at?: string;
  created_at?: string;
}
