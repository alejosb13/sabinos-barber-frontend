import { Empleado } from './Empleado.model';
import { Local } from './Local.model';
import { Usuario } from './Usuario.model';
import { FacturaDetalle } from './FacturaDetail';

export interface Factura {
  id?: number;

  cantidad_facturas?: number;

  // cliente_id: number;
  // empleado_id: number;
  // productos: Producto[];
  // metodo_pago_id: number;
  // total: number;
  // sub_total?: number;
  // descripcion: string;
  // descuento: string;

  local_id: number;
  local?: Local;

  empleado_id: number;
  empleado?: Empleado;

  user_id: number;
  user?: Usuario;

  factura_detalle?: FacturaDetalle[];

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}
