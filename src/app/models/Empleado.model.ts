import { Factura } from './Factura.model';

export interface Empleado {
  id?: number;

  nombre_completo: string;
  dni: string;
  local_id: number;

  facturas?: Factura[];

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}
