import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  FormErrorMessages,
  FormGroupValidators,
} from '../../../../utils/interfaces';

export const PedidoCrudValidators: FormGroupValidators = {
  cliente_id: [Validators.required, Validators.maxLength(20)],
  servicio_id: [Validators.required, Validators.maxLength(20)],
  metodo_pago_id: [Validators.required, Validators.maxLength(20)],
  producto_id: [Validators.required, Validators.maxLength(20)],
  cantidad: [Validators.required, Validators.maxLength(20)],
  precio_unitario: [Validators.required, Validators.maxLength(20)],
  precio: [Validators.required, Validators.maxLength(20)],
  monto: [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(20),
  ],
  gratis: [],
};

export const PedidoCrudErrorMessages: FormErrorMessages = {
  cliente_id: {
    required: 'El cliente es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  servicio_id: {
    required: 'El servicio es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  metodo_pago_id: {
    required: 'El metodo de pago es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  producto_id: {
    required: 'El producto es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  cantidad: {
    required: 'La cantidad es requerida',
    maxlength: 'Solo se permite 20 caracteres.',
    max: 'Excede al numero en el inventario.',
  },
  precio_unitario: {
    required: 'El precio es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  precio: {
    required: 'El precio es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  monto: {
    required: 'El monto es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
    min: 'El mínimo de caracteres es de 1.',
  },
  gratis: {
    required: '',
    // maxlength: 'Solo se permite 20 caracteres.',
  },
};

export const validarProductosCargados: ValidatorFn = (
  form: AbstractControl
): ValidationErrors | null => {
  const productosArray = (form.get('productos') as FormArray)?.controls;
  return productosArray.length > 0 ? null : { productosVacios: true };
};
