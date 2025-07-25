import { FormGroup, FormControl } from '@angular/forms';
import { SaldoCrudValidators } from './validations';

export interface SaldoCrudForm {
  monto: FormControl<number | null>;
  metodo_pago_id: FormControl<number | null>;
}

export const SaldoCrudFormBuilder = () =>
  new FormGroup<SaldoCrudForm>({
    monto: new FormControl(null, [...SaldoCrudValidators['monto']]),
    metodo_pago_id: new FormControl(0, [
      ...SaldoCrudValidators['metodo_pago_id'],
    ]),
  });
