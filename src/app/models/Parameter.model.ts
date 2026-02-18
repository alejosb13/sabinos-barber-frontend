import { Relaciones } from './Relaciones.model';

export interface ParametersUrl extends Relaciones {
  link: null | string;
  page?: string | number;
  filtro?: string;
  estado?: string | number;
  fecha_inicio?: string;
  fecha_fin?: string;
  allDates?: boolean;
  disablePaginate?: string;
  fecha_creacion_factura?: string;
  local?: string | number;
  total_facturado?: string | number;
  estado_detalle?: string | number;
  orden?: string | number;
}
