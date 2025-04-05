import { FormGroup, FormControl } from '@angular/forms';
import { passwordMatchValidator, UsuarioCrudValidators } from './validations';

export interface UsuarioCrudForm {
  nombre_completo: FormControl<string | null>;
  email: FormControl<string | null>;
  role_id: FormControl<string | null>;
  local_id: FormControl<string | null>;
  passwords: FormGroup;
}

export interface UsuarioPasswordCrudForm {
  password: FormControl<string | null>;
  password_repeat: FormControl<string | null>;
}

export const UsuarioCrudFormBuilder = () =>
  new FormGroup<UsuarioCrudForm>({
    nombre_completo: new FormControl('', [
      ...UsuarioCrudValidators['nombre_completo'],
    ]),
    email: new FormControl('', [...UsuarioCrudValidators['email']]),
    role_id: new FormControl('', [...UsuarioCrudValidators['role_id']]),
    local_id: new FormControl('', [...UsuarioCrudValidators['local_id']]),
    // passwords: new FormGroup<UsuarioPasswordCrudForm>({
    //   password: new FormControl('', [...UsuarioCrudValidators['password']]),
    //   password_repeat: new FormControl('', [
    //     ...UsuarioCrudValidators['password_repeat'],
    //   ]),
    // }),
    passwords: UsuarioPasswordCrudForm(),
  });

export const UsuarioPasswordCrudForm = () =>
  new FormGroup<UsuarioPasswordCrudForm>(
    {
      password: new FormControl('', [...UsuarioCrudValidators['password']]),
      password_repeat: new FormControl('', [
        ...UsuarioCrudValidators['password_repeat'],
      ]),
    },
    { validators: passwordMatchValidator('password', 'password_repeat') }
  );
