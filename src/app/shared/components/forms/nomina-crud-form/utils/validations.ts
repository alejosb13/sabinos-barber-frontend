import { Validators } from '@angular/forms';
import {
  FormErrorMessages,
  FormGroupValidators,
} from '../../../../utils/interfaces';

export const NominaCrudValidators: FormGroupValidators = {
  extra_id: [Validators.required],
  monto: [Validators.required],
  monto_total: [Validators.required],
};

export const NominaCrudErrorMessages: FormErrorMessages = {
  extra_id: {
    required: 'El extra es requerido',
  },
  monto: {
    required: 'El monto es requerido',
    maxlength: 'Solo se permite 14 números.',
  },
  monto_total: {
    required: 'El monto total es requerido',
    maxlength: 'Solo se permite 14 números.',
  },
};
