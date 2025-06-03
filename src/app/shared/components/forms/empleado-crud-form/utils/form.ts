import { FormGroup, FormControl } from '@angular/forms';
import { EmpleadoCrudValidators } from './validations';

export interface EmpleadoCrudForm {
  nombre_completo: FormControl<string | null>;
  dni: FormControl<string | null>;
  local_id: FormControl<number | string | null>;
  porcentaje: FormControl<number | null>;
}

export const EmpleadoCrudFormBuilder = () =>
  new FormGroup<EmpleadoCrudForm>({
    nombre_completo: new FormControl('', [
      ...EmpleadoCrudValidators['nombre_completo'],
    ]),
    dni: new FormControl('', [...EmpleadoCrudValidators['dni']]),
    local_id: new FormControl({ value: '', disabled: true }, [
      ...EmpleadoCrudValidators['local_id'],
    ]),
    porcentaje: new FormControl({ value: 40, disabled: false }, [
      ...EmpleadoCrudValidators['porcentaje'],
    ]),
  });
