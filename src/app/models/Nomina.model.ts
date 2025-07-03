import { Empleado } from './Empleado.model';
export interface Nomina {
  id?: number;
  empleado_id: number;
  descripcion: string;
  monto_facturado: number;
  adicional: boolean | number;
  porcentaje_adicional: number;
  total: number;

  empleado?: Empleado;
  total_facturado?: number;
  presentismo?: number;
  fecha_fin: string;
  fecha_inicio: string;
  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface NominaEmpleado {
  nombre: string;
  porcentaje: null;
  servicios: ServicioNomina[];
}
interface ServicioNomina {
  id: number;
  descripcion: string;
  precio: number;
  precio_nomina: number;
  facturado?: number;
  cantidad: number;
}
