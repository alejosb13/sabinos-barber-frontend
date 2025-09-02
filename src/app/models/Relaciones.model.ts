export interface Relaciones extends IdRelaciones {
  user_model?: string;
  cliente_model?: string;
  empleado_model?: string;
  metodo_pago_model?: string;
  local_model?: string;
  gasto_detalle_model?: string;
  factura_model?: string;
  factura_detalle_model?: string;
  factura_producto_model?: string;
  venta_detalle_model?: string;
}

interface IdRelaciones {
  user_id?: string | number;
  cliente_id?: string | number;
  empleado_id?: string | number;
  metodo_pago_id?: string | number;
  local_id?: string | number;
  factura_detalle_id?: string | number;
  gasto_detalle_id?: string | number;
}
