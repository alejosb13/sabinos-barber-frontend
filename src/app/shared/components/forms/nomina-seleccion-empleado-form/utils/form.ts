import { FormGroup, FormControl } from '@angular/forms';
import { NominaSeleccionCrudValidators } from './validations';

export interface NominaSeleccionCrudForm {
  empleado_id: FormControl<number | null>;
  descripcion: FormControl<string | null>;
}

export const NominaCrudFormBuilder = () =>
  new FormGroup<NominaSeleccionCrudForm>({
    empleado_id: new FormControl(0, [
      ...NominaSeleccionCrudValidators['empleado_id'],
    ]),
    descripcion: new FormControl('', [
      ...NominaSeleccionCrudValidators['descripcion'],
    ]),
  });
