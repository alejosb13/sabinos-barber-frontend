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

export const VentasCrudValidators: FormGroupValidators = {
  user_id: [Validators.required],
  cliente_id: [Validators.required],
  local_id: [Validators.required],
  ventas: [],
  metodos_pago: [],
  // Validaciones para los campos internos de ventas
  tipo_gasto_id: [Validators.required],
  venta_id: [],
  producto_id: [Validators.required],
  cantidad: [Validators.required, Validators.min(1)],
  precio_unitario: [Validators.required, Validators.min(0)],
  precio: [Validators.required, Validators.min(0)],
  // Validaciones para los campos internos de metodos_pago
  metodo_pago_id: [Validators.required],
  monto: [Validators.required, Validators.min(1)],
};

export const VentasProductosCrudErrorMessages: FormErrorMessages = {
  user_id: {
    required: 'El usuario es obligatorio.',
  },
  cliente_id: {
    required: 'El cliente es obligatorio.',
  },
  local_id: {
    required: 'El local es obligatorio.',
  },
  producto_id: {
    required: 'El producto es obligatorio.',
  },
  cantidad: {
    required: 'La cantidad es obligatoria.',
    min: 'La cantidad debe ser mayor a 0.',
    max: 'La cantidad supera el máximo en stock.',
  },
  precio_unitario: {
    required: 'El precio unitario es obligatorio.',
    min: 'El precio unitario debe ser mayor o igual a 0.',
  },
  precio: {
    required: 'El precio es obligatorio.',
    min: 'El precio debe ser mayor o igual a 0.',
  },
  tipo_gasto_id: {
    required: 'El tipo de gasto es obligatorio.',
  },
  metodo_pago_id: {
    required: 'El método de pago es obligatorio.',
  },
  monto: {
    required: 'El monto es obligatorio.',
    min: 'El monto debe ser mayor o igual a 0.',
  },
};
