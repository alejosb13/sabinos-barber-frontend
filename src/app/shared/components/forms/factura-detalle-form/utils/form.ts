import { FormGroup, FormControl } from '@angular/forms';
import { PedidoCrudValidators } from './validations';

export interface FacturaDetalleCrudForm {
  cliente_id: FormControl<number | null>;
  servicio_id: FormControl<number | null>;
  // metodo_pago_id: FormControl<number | null>;
}

export const FacturaDetalleCrudFormBuilder = () =>
  new FormGroup<FacturaDetalleCrudForm>({
    cliente_id: new FormControl(null, [...PedidoCrudValidators['cliente_id']]),
    servicio_id: new FormControl(null, [
      ...PedidoCrudValidators['servicio_id'],
    ]),
    // metodo_pago_id: new FormControl(null, [
    //   ...PedidoCrudValidators['metodo_pago_id'],
    // ]),
  });
