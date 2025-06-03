import { Validators } from '@angular/forms';
import {
  FormErrorMessages,
  FormGroupValidators,
} from '../../../../utils/interfaces';

export const ServicioCrudValidators: FormGroupValidators = {
  descripcion: [Validators.required, Validators.maxLength(20)],
  precio: [Validators.required, Validators.maxLength(14)],
  precio_nomina: [Validators.required, Validators.maxLength(14)],
};

export const ServicioCrudErrorMessages: FormErrorMessages = {
  descripcion: {
    required: 'La descripción es requerida',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  precio: {
    required: 'El precio es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  precio_nomina: {
    required: 'El precio es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
};
