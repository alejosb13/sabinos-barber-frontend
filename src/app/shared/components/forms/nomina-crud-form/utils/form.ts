import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { NominaCrudValidators } from './validations';

export interface NominaCrudForm {
  extras_nomina: FormArray<FormGroup<ExtraNominaForm>>;
}
export interface ExtraNominaForm {
  extra_id: FormControl<number | null>;
  monto: FormControl<number | null>;
  monto_total: FormControl<number | null>;
}

export const NominaCrudFormBuilder = () =>
  new FormGroup<NominaCrudForm>({
    extras_nomina: new FormArray<FormGroup<ExtraNominaForm>>([
      crearExtraArrayForm(),
    ]), // Inicializar con un gasto
  });

const crearExtraArrayForm = (): FormGroup<ExtraNominaForm> => {
  return new FormGroup<ExtraNominaForm>(
    {
      extra_id: new FormControl({ disabled: false, value: 1 }, [
        ...NominaCrudValidators['extra_id'],
      ]),
      monto: new FormControl({ disabled: false, value: 0 }, [
        ...NominaCrudValidators['monto'],
      ]),
      monto_total: new FormControl({ disabled: false, value: 0 }, [
        ...NominaCrudValidators['monto_total'],
      ]),
    },
    { updateOn: 'change' }
  );
};

export const agregarExtraInArrayForm = (form: FormGroup<NominaCrudForm>) => {
  form.controls.extras_nomina.push(crearExtraArrayForm()); // Agregar una nueva instancia
};
