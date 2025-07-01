import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { NominaCrudValidators } from './validations';

export interface NominaCrudForm {
  extras_nomina: FormArray<FormGroup<ExtraNominaForm>>;
  presentismo: FormControl<number | null>;
  metodos_pago: FormArray<FormGroup<MontoItemForm>>;
}
export interface ExtraNominaForm {
  extra_id: FormControl<number | null>;
  monto: FormControl<number | null>;
  monto_total: FormControl<number | null>;
  descripcion: FormControl<string | null>;
}

export interface MontoItemForm {
  metodo_pago_id: FormControl<number | null>;
  monto: FormControl<number | null>;
}

export const NominaCrudFormBuilder = () =>
  new FormGroup<NominaCrudForm>({
    extras_nomina: new FormArray<FormGroup<ExtraNominaForm>>([
      // crearExtraArrayForm(),
    ]), // Inicializar con un gasto
    presentismo: new FormControl({ disabled: false, value: 5 }, [
      ...NominaCrudValidators['presentismo'],
    ]),
    metodos_pago: new FormArray<FormGroup<MontoItemForm>>([crearMetodosForm()]),
  });

export const crearMetodosForm = (): FormGroup<MontoItemForm> => {
  return new FormGroup<MontoItemForm>({
    metodo_pago_id: new FormControl(0, [
      ...NominaCrudValidators['metodo_pago_id'],
    ]),
    monto: new FormControl(0, [...NominaCrudValidators['monto']]),
  });
};

const crearExtraArrayForm = (): FormGroup<ExtraNominaForm> => {
  return new FormGroup<ExtraNominaForm>(
    {
      extra_id: new FormControl({ disabled: false, value: 1 }, [
        ...NominaCrudValidators['extra_id'],
      ]),
      monto: new FormControl({ disabled: false, value: 0 }, [
        ...NominaCrudValidators['monto'],
      ]),
      monto_total: new FormControl({ disabled: true, value: 0 }, [
        ...NominaCrudValidators['monto_total'],
      ]),
      descripcion: new FormControl({ disabled: false, value: '' }, [
        ...NominaCrudValidators['descripcion'],
      ]),
    },
    { updateOn: 'change' }
  );
};

export const agregarExtraInArrayForm = (form: FormGroup<NominaCrudForm>) => {
  form.controls.extras_nomina.push(crearExtraArrayForm()); // Agregar una nueva instancia
};
