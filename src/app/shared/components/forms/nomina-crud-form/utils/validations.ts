import { Validators } from '@angular/forms';
import {
  FormErrorMessages,
  FormGroupValidators,
} from '../../../../utils/interfaces';

export const NominaCrudValidators: FormGroupValidators = {
  extra_id: [Validators.required],
  monto: [Validators.required, Validators.min(1)],
  monto_total: [Validators.required, Validators.min(1)],
  presentismo: [Validators.required],
  metodo_pago_id: [Validators.required, Validators.min(1)],
  descripcion: [Validators.maxLength(100)],
};

export const NominaCrudErrorMessages: FormErrorMessages = {
  extra_id: {
    required: 'El extra es requerido',
  },
  monto: {
    required: 'El monto es requerido',
    min: 'El monto debe ser diferente de 0',
    maxlength: 'Solo se permite 14 números.',
  },
  monto_total: {
    required: 'El monto total es requerido',
    min: 'El monto total debe ser diferente de 0',
    maxlength: 'Solo se permite 14 números.',
  },
  presentismo: {
    required: 'El presentismo es requerido',
  },
  descripcion: {
    maxlength: 'El máximo es de 100 caracteres.',
  },
  metodo_pago_id: {
    required: 'El método de pago es requerido.',
  },
};
