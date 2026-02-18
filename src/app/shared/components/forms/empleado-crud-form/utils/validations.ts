import { Validators } from '@angular/forms';
import {
  FormErrorMessages,
  FormGroupValidators,
} from '../../../../utils/interfaces';

export const EmpleadoCrudValidators: FormGroupValidators = {
  nombre_completo: [Validators.required, Validators.maxLength(80)],
  dni: [Validators.required, Validators.maxLength(10)],
  local_id: [Validators.required],
  porcentaje: [Validators.required, Validators.maxLength(3)],
  orden: [Validators.required, Validators.pattern(/^\d+$/)],
};

export const EmpleadoCrudErrorMessages: FormErrorMessages = {
  nombre_completo: {
    required: 'El nombre es requerido',
    maxlength: 'Solo se permite 80 caracteres.',
  },
  dni: {
    required: 'El dni es requerido',
    maxlength: 'Solo se permite 10 números.',
  },
  local_id: {
    required: 'El local es requerido',
  },
  porcentaje: {
    required: 'El porcentaje es requerido',
    maxlength: 'Solo se permite 3 números.',
  },
  orden: {
    required: 'El orden es requerido',
    pattern: 'Solo se permiten números enteros.',
  },
};
