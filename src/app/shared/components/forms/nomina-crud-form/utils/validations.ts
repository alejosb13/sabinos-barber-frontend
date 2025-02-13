import { Validators } from '@angular/forms';
import {
  FormErrorMessages,
  FormGroupValidators,
} from '../../../../utils/interfaces';

export const NominaCrudValidators: FormGroupValidators = {
  empleado_id: [Validators.required],
  nombre: [Validators.required],
  monto_facturado: [Validators.required],
  adicional: [Validators.required],
  porcentaje_adicional: [Validators.required],
  total: [Validators.required],
  local_id: [Validators.required],
};

export const NominaCrudErrorMessages: FormErrorMessages = {
  empleado_id: {
    required: 'El Empleado es requerido',
    maxlength: 'Solo se permite 80 caracteres.',
  },
  nombre: {
    required: 'El nombre es requerido',
    maxlength: 'Solo se permite 80 caracteres.',
  },
  monto_facturado: {
    required: 'El monto facturado es requerido',
  },
  local_id: {
    required: 'El local es requerido',
  },
  adicional: {
    required: 'El adicional es requerido',
    maxlength: 'Solo se permite 80 caracteres.',
  },
  porcentaje_adicional: {
    required: 'El porcentaje es requerido',
    maxlength: 'Solo se permite 80 caracteres.',
  },
  total: {
    required: 'El total es requerido',
  },
};
