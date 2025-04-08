import { FormGroup, FormControl } from '@angular/forms';
import { ProductoCrudValidators } from './validations';

export interface ProductoCrudForm {
  marca: FormControl<string | null>;
  descripcion: FormControl<string | null>;
  cantidad: FormControl<number | null>;
  precio: FormControl<number | null>;
  local_id: FormControl<string | number | null>;
  // ilimitado: FormControl<boolean | null>;
}

export const ProductoCrudFormBuilder = () =>
  new FormGroup<ProductoCrudForm>({
    marca: new FormControl('', [...ProductoCrudValidators['marca']]),
    descripcion: new FormControl(null, [
      ...ProductoCrudValidators['descripcion'],
    ]),
    cantidad: new FormControl(null, [...ProductoCrudValidators['cantidad']]),
    precio: new FormControl(null, [...ProductoCrudValidators['precio']]),
    local_id: new FormControl({ value: '0', disabled: true }, [
      ...ProductoCrudValidators['local_id'],
    ]),
    // ilimitado: new FormControl(false, [...ProductoCrudValidators['ilimitado']]),
  });
