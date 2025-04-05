import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  ButtonDirective,
  ColComponent,
  ColorModeService,
  FormFloatingDirective,
  FormModule,
  ModalModule,
  RowComponent,
} from '@coreui/angular';
import { UsuarioCrudFormBuilder } from './utils/form';
import { CommonModule } from '@angular/common';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import { UsuarioCrudErrorMessages } from './utils/validations';
import Swal from 'sweetalert2';
import logger from 'src/app/shared/utils/logger';
import { environment } from 'src/environments/environment';
import { DirectivesModule } from '../../../directivas/directives.module';
import { UsuarioesService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/Usuario.model';
import { RolesService } from '../../../../services/role.service';
import { Role } from '../../../../models/Role.model';
import { Subject, takeUntil } from 'rxjs';
import { Local } from '../../../../models/Local.model';
import { LocalesService } from '../../../../services/locales.service';

@Component({
  selector: 'app-usuario-crud-form',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    ButtonDirective,
    FormFloatingDirective,
    FormModule,
    ReactiveFormsModule,
    ValidMessagesFormComponent,
    ModalModule,
    DirectivesModule,
  ],
  templateUrl: './usuario-crud-form.component.html',
  styleUrl: './usuario-crud-form.component.scss',
})
export class UsuarioCrudFormComponent {
  private destruir$: Subject<void> = new Subject<void>();
  readonly UsuarioCrudErrorMessages = UsuarioCrudErrorMessages;
  UsuarioCrudForm = UsuarioCrudFormBuilder();
  #colorModeService = inject(ColorModeService);
  _UsuarioesServices = inject(UsuarioesService);
  _RolesService = inject(RolesService);
  _LocalesServices = inject(LocalesService);

  Roles!: Role[];
  Locales!: Local[];

  @Input() Usuario!: Usuario;
  @Output() FormsValues = new EventEmitter<any>();

  ngOnInit(): void {
    this.getRoles();
    this.getLocales();
  }

  ngOnChanges(): void {
    if (this.Usuario) {
      this.setFormValues();

      this.UsuarioCrudForm.controls.passwords.disable();
    }
  }

  getLocales() {
    this._LocalesServices
      .getLocales({ disablePaginate: '1', link: null })
      .pipe(takeUntil(this.destruir$))
      .subscribe((locales: Local[]) => {
        this.Locales = locales;
      });
  }

  getRoles() {
    this._RolesService
      .getRoles({ link: null, disablePaginate: '1' })
      .pipe(takeUntil(this.destruir$))
      .subscribe((roles) => {
        // logger.log('Roles', roles);
        this.Roles = roles;
      });
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.UsuarioCrudForm.controls
      ? this.UsuarioCrudForm.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.UsuarioCrudForm.get(name) as FormControl;
  }

  getControlPasswordForm(name: string): FormControl {
    let Form = this.UsuarioCrudForm.get('passwords') as FormGroup;
    return Form.get(name) as FormControl;
  }
  getControlPasswordErrorForm(name: string): ValidationErrors | null {
    let Form = this.UsuarioCrudForm.get('passwords') as FormGroup;
    const control = Form.controls ? Form.get(name) : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  setFormValues() {
    logger.log(this.Usuario);

    this.UsuarioCrudForm.patchValue({
      nombre_completo: this.Usuario.nombre_completo,
      email: this.Usuario.email,
      role_id: this.Usuario.role_id,
    });
  }

  sendValueFom() {
    if (this.UsuarioCrudForm.valid) {
      const { email, nombre_completo, role_id, local_id } =
        this.UsuarioCrudForm.value;
      const { password } = this.UsuarioCrudForm.controls.passwords.value;

      const VALUES_RESPONSE = this.Usuario
        ? { email, nombre_completo, role_id, local_id }
        : { email, nombre_completo, role_id, local_id, password };
      this.FormsValues.emit(VALUES_RESPONSE);
    } else {
      Swal.mixin({
        customClass: {
          container: this.#colorModeService.getStoredTheme(
            environment.SabinosTheme
          ),
        },
      }).fire({
        text: 'Complete todos los campos obligatorios',
        icon: 'warning',
      });
    }
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
