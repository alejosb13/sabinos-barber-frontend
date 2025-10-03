import dayjs from 'dayjs';

export interface Filtro {
  id: string; // Identificador, inicialmente vacío
  marca: string; // Marca, inicialmente vacío
  descripcion: string; // Descripción, inicialmente vacío
  fecha: {
    startDate: dayjs.Dayjs; // Fecha inicial (usando Dayjs para el tipo)
    endDate: dayjs.Dayjs; // Fecha final (usando Dayjs para el tipo)
  };
  allDates: boolean;
  estado: number | string;
  local_id: number | string;
  fecha_inicio?: string;
  fecha_fin?: string;
  user_id?: number | string;
  empleado_id?: number | string;
  inicioFecha?: string;
  finFecha?: string;
  tipo_gasto_id?: number | string;
}

export type FiltroKeys = keyof Filtro;
