export interface Panel {
  total_productos: number;
  total_gastos: number;
  caja_factura: Cajafactura[];
  caja_gastos: Cajafactura[];
  caja_nomina: Cajafactura[];
  Servicios_Contador: ContadoServicios[];
  Servicios_mensual: Serviciosmensual;
  saldo: SaldoPanel[];
}

interface Cajafactura {
  id: number;
  tipo: string;
  total: number;
}

interface ContadoServicios {
  id: number;
  descripcion: string;
  precio: number;
  precio_nomina: number;
  cantidad: number;
}

interface Serviciosmensual {
  precioTotal: number;
  precio_nominaTotal: number;
  cantidadTotal: number;
}

interface SaldoPanel {
  id: number;
  tipo: string;
  total: number | string;
}

// export interface Gasto {
//   id: number;
//   user_id: number;
//   empleado_id: number | null;
//   total: number;
//   tipo_usuario: number;
//   is_local: number;
//   estado: number;
//   pagado: number;
//   created_at: string;
//   updated_at: string;
//   user: User;
//   empleado: any | null; // si luego sabes la estructura de empleado podés reemplazar "any"
//   gasto_detalle: GastoDetalle[];
//   metodo_pago: MetodoPagoPanel[];
// }

// export interface User {
//   id: number;
//   nombre_completo: string;
//   email: string;
//   email_verified_at: string | null;
//   estado: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface GastoDetalle {
//   id: number;
//   gasto_id: number;
//   producto_id: number | null;
//   tipo_gasto_id: number;
//   cantidad: number;
//   precio_unitario: number;
//   precio: number;
//   comentario: string | null;
//   estado: number;
//   created_at: string;
//   updated_at: string;
//   producto: any | null; // igual que con empleado: reemplazar "any" si conocés la estructura
//   tipo_gasto: TipoGasto;
// }

// export interface TipoGasto {
//   id: number;
//   descripcion: string;
//   estado: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface MetodoPagoPanel {
//   id: number;
//   gasto_id: number;
//   metodo_pago_id: number;
//   local_id: number;
//   monto: string; // porque viene como "2000.00" en string
//   estado: number;
//   created_at: string;
//   updated_at: string;
//   metodo_pago: MetodoPago;
// }
