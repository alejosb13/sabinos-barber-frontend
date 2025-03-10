import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { GastoCrudValidators } from './validations';

export interface GastoCrudForm {
  user_id: FormControl<number | null>;
  // email: FormControl<string | null>;
  password: FormControl<string | null>;
  empleado_id: FormControl<number | null>;
  tipo_usuario: FormControl<boolean | null>;
  gastos: FormArray<FormGroup<GastoItemForm>>;
}

export interface GastoItemForm {
  producto_id: FormControl<number | null>;
  cantidad: FormControl<number | null>;
  precio_unitario: FormControl<number | null>;
  precio: FormControl<number | null>;
  tipo_gasto_id: FormControl<number | null>;
}

// Función para crear un nuevo FormGroup de GastoItemForm
const crearGastoForm = (): FormGroup<GastoItemForm> => {
  return new FormGroup<GastoItemForm>({
    producto_id: new FormControl(0, [...GastoCrudValidators['producto_id']]),
    cantidad: new FormControl(0, [...GastoCrudValidators['cantidad']]),
    precio_unitario: new FormControl({ disabled: true, value: 0 }, [
      ...GastoCrudValidators['precio_unitario'],
    ]),
    precio: new FormControl(0, [...GastoCrudValidators['precio']]),
    tipo_gasto_id: new FormControl(0, [
      ...GastoCrudValidators['tipo_gasto_id'],
    ]),
  });
};

// Builder del formulario principal
export const GastoCrudFormBuilder = () =>
  new FormGroup<GastoCrudForm>({
    user_id: new FormControl(0, [...GastoCrudValidators['user_id']]),
    // email: new FormControl({ value: '', disabled: true }, [
    //   ...GastoCrudValidators['email'],
    // ]),
    password: new FormControl('', [...GastoCrudValidators['password']]),
    empleado_id: new FormControl(0, [...GastoCrudValidators['empleado_id']]),
    tipo_usuario: new FormControl(false, [
      ...GastoCrudValidators['tipo_usuario'],
    ]),
    gastos: new FormArray<FormGroup<GastoItemForm>>([crearGastoForm()]), // Inicializar con un gasto
  });

// Función para agregar un nuevo gasto al FormArray
export const agregarGasto = (form: FormGroup<GastoCrudForm>) => {
  form.controls.gastos.push(crearGastoForm()); // Agregar una nueva instancia
};
