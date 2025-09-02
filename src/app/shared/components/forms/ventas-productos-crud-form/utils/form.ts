import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { VentasCrudValidators } from './validations';

export function VentasProductosCrudFormBuilder() {
  const fb = new FormBuilder();
  return fb.group({
    user_id: [null, VentasCrudValidators['user_id']],
    cliente_id: [null, VentasCrudValidators['cliente_id']],
    local_id: [null, VentasCrudValidators['local_id']],
    ventas: fb.array([
      fb.group({
        producto_id: [null, VentasCrudValidators['producto_id']],
        cantidad: [
          { value: 0, disabled: true },
          VentasCrudValidators['cantidad'],
        ],
        // tipo_gasto_id: [null, VentasCrudValidators['tipo_gasto_id']],
        // venta_id: [null, VentasCrudValidators['venta_id']],
        precio_unitario: [
          { value: 0, disabled: true },
          VentasCrudValidators['precio_unitario'],
        ],
        precio: [{ value: 0, disabled: true }, VentasCrudValidators['precio']],
        id: [null],
      }),
    ]),
    metodos_pago: fb.array([
      fb.group({
        metodo_pago_id: [null, VentasCrudValidators['metodo_pago_id']],
        monto: [0, VentasCrudValidators['monto']],
        id: [null],
      }),
    ]),
  });
}

// Utilidad para agregar una venta al array
export function agregarVentaArray(form: FormGroup) {
  const ventas = form.get('ventas') as FormArray;
  ventas.push(
    new FormBuilder().group({
      // tipo_gasto_id: [null, VentasCrudValidators['tipo_gasto_id']],
      id: [null, VentasCrudValidators['venta_id']],
      producto_id: [null, VentasCrudValidators['producto_id']],
      cantidad: [1, VentasCrudValidators['cantidad']],
      precio_unitario: [0, VentasCrudValidators['precio_unitario']],
      precio: [0, VentasCrudValidators['precio']],
    })
  );
}

// Utilidad para agregar un método de pago al array
export function agregarMetodoPagoArray(form: FormGroup) {
  const metodos = form.get('metodos_pago') as FormArray;
  metodos.push(
    new FormBuilder().group({
      metodo_pago_id: [null, VentasCrudValidators['metodo_pago_id']],
      monto: [0, VentasCrudValidators['monto']],
    })
  );
}
