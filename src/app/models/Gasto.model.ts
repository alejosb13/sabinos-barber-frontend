import { Empleado } from './Empleado.model';
import { Local } from './Local.model';
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

  // gasto_detalle:

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
  estado: number;
  created_at?: string;
  updated_at?: string;
  gasto_id: number;

  producto?: Producto;
  tipo_gasto?: TipoGasto;
}
