import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Cambia 'es' al idioma que necesites
dayjs.locale('es'); // Configura el idioma global

export const START_DATE = dayjs().startOf('month');
export const END_DATE = dayjs().endOf('month');
export const NOW = dayjs();

export const IniciarFiltro = {
  id: '',
  marca: '',
  descripcion: '',
  fecha: {
    startDate: START_DATE,
    endDate: END_DATE,
  },
  estado: 1,
  allDates: false,
  user_id: 0,
  empleado_id: 0,
  local_id: 0,
  tipo_gasto_id: 0,
};

export function obtenerRangoFecha(fecha?: string | Date) {
  const baseDate = fecha ? dayjs(fecha) : dayjs(); // Si no hay fecha, usa la fecha actual

  return {
    startDate: baseDate.startOf('day'), // Inicio del día de la fecha dada
    endDate: baseDate.endOf('day'), // Fin del día de la fecha dada
  };
}

export function formatearFecha(
  date?: dayjs.Dayjs,
  formato: string = 'DD/MM/YYYY'
) {
  if (!date) {
    // Si no se pasa un objeto dayjs, se usa la fecha actual
    date = dayjs();
  }

  return date.format(formato); // Devuelve la fecha formateada según el patrón dado
}
