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
