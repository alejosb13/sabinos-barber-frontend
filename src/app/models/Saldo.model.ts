import { Local } from './Local.model';
import { MetodoPago } from './MetodoPago.model';

export interface Saldo {
  id?: number;

  metodo_pago_id: number;
  local_id: number;
  monto: number;

  metodo_pago?: MetodoPago;
  local?: Local;

  estado?: number;
  created_at?: Date;
  updated_at?: Date;
}
