import { Validators } from '@angular/forms';
import {
  FormErrorMessages,
  FormGroupValidators,
} from '../../../../utils/interfaces';
import { emailValidator } from '../../../../utils/validaciones';

export const GastoCrudValidators: FormGroupValidators = {
  user_id: [Validators.required],
  empleado_id: [],
  producto_id: [
    Validators.required,
    Validators.min(1),
    // Validators.pattern(/^[0-9]+$/),
  ],
  // email: [Validators.required, Validators.maxLength(30), emailValidator()],
  password: [Validators.required, Validators.maxLength(30)],
  cantidad: [
    Validators.required,
    Validators.min(1),
    Validators.max(1000),
    Validators.pattern(/^[0-9]+$/),
  ],
  precio_unitario: [
    Validators.required,
    Validators.min(0.01),
    Validators.pattern(/^\d+(\.\d{1,2})?$/),
  ],
  precio: [
    Validators.required,
    Validators.min(1),
    Validators.pattern(/^[0-9]+$/),
  ],
  tipo_gasto_id: [Validators.required],
  is_local: [Validators.required],
  tipo_usuario: [],
  metodo_pago_id: [Validators.required, Validators.min(1)],
};

export const GastoCrudErrorMessages: FormErrorMessages = {
  user_id: {
    required: 'El usuario es requerido',
    maxlength: 'Máximo 80 caracteres permitidos',
  },
  empleado_id: {
    required: 'El empleado es requerido',
    maxlength: 'Máximo 80 caracteres permitidos',
  },
  email: {
    required: 'El email es requerido.',
    maxlength: 'Solo se permite 30 caracteres.',
    emailInvalid: 'El tipo de email no es valido',
  },
  password: {
    required: 'La contraseña es requerida.',
    maxlength: 'Solo se permite 30 caracteres.',
  },
  producto_id: {
    required: 'El producto es requerido',
    min: 'Debe ser un ID válido',
    pattern: 'Solo números enteros permitidos',
  },
  cantidad: {
    required: 'La cantidad es requerida',
    min: 'Mínimo 1 unidad',
    max: 'Excede el máximo en stock',
    pattern: 'Solo números enteros permitidos',
  },
  precio_unitario: {
    required: 'El precio unitario es requerido',
    min: 'El precio mínimo es 0.01',
    pattern: 'Formato monetario inválido (ej: 123.45)',
  },
  precio: {
    required: 'El precio unitario es requerido',
    min: 'El precio mínimo es 0.01',
    pattern: 'Formato monetario inválido (ej: 123.45)',
  },
  tipo_gasto_id: {
    required: 'El tipo de gasto es requerido',
    min: 'Seleccione un tipo válido',
    pattern: 'Solo números enteros permitidos',
  },
  is_local: {
    required: 'El local es requerido',
    min: 'Seleccione un tipo válido',
    pattern: 'Solo números enteros permitidos',
  },
  metodo_pago_id: {
    required: 'El método de pago es requerido',
  },
  monto: {
    required: 'El monto es requerido',
  },
};
