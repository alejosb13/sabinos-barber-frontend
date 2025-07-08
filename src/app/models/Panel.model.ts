export interface Panel {
  total_productos: number;
  total_gastos: number;
  caja_factura: Cajafactura[];
  caja_gastos: Cajafactura[];
  caja_nomina: Cajafactura[];
  Servicios_Contador: ContadoServicios[];
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
