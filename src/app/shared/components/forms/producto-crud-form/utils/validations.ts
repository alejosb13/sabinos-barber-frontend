import { Validators } from '@angular/forms';
import {
  FormErrorMessages,
  FormGroupValidators,
} from '../../../../utils/interfaces';

export const ProductoCrudValidators: FormGroupValidators = {
  marca: [Validators.required, Validators.maxLength(20)],
  descripcion: [Validators.required, Validators.maxLength(20)],
  cantidad: [Validators.required, Validators.maxLength(3)],
  precio: [Validators.required, Validators.maxLength(15)],
  local_id: [Validators.required],
  // ilimitado: [Validators.required],
};

export const ProductoCrudErrorMessages: FormErrorMessages = {
  marca: {
    required: 'La marca es requerida',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  descripcion: {
    required: 'La descripción es requerida.',
    maxlength: 'Solo se permite 20 caracteres.',
  },
  cantidad: {
    required: 'La cantidad es requerida.',
    maxlength: 'Solo se permite 3 caracteres.',
  },
  precio: {
    required: 'El precio es requerido.',
    maxlength: 'Solo se permite 15 números.',
  },
  local_id: {
    required: 'El local es requerido.',
  },
  ilimitado: {
    required: 'El tipo es requerido.',
  },
};
