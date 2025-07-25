import { Validators } from '@angular/forms';
import {
  FormErrorMessages,
  FormGroupValidators,
} from '../../../../utils/interfaces';

export const SaldoCrudValidators: FormGroupValidators = {
  monto: [Validators.required, Validators.maxLength(20)],
  metodo_pago_id: [Validators.required],
};

export const SaldoCrudErrorMessages: FormErrorMessages = {
  monto: {
    required: 'El monto es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  metodo_pago_id: {
    required: 'El monto es requerido',
    maxlength: 'Solo se permite 20 caracteres.',
  },
};
