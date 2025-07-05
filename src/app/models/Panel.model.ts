export interface Panel {
  total_productos: number;
  total_gastos: number;
  caja_factura: Cajafactura[];
  caja_gastos: Cajafactura[];
  caja_nomina: Cajafactura[];
}

interface Cajafactura {
  id: number;
  tipo: string;
  total: number;
}
