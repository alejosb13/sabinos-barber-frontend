import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormControl,
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
  SpinnerComponent,
} from '@coreui/angular';
import { LocalChangeFormBuilder } from './utils/form';
import { CommonModule } from '@angular/common';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import { LocalChangeErrorMessages } from './utils/validations';
import Swal from 'sweetalert2';
import logger from 'src/app/shared/utils/logger';
import { environment } from 'src/environments/environment';
import { DirectivesModule } from '../../../directivas/directives.module';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { Empleado } from 'src/app/models/Empleado.model';
import { Subject, takeUntil } from 'rxjs';
import { LocalesService } from '../../../../services/locales.service';
import { Local } from '../../../../models/Local.model';

@Component({
  selector: 'app-cambiar-local-form',
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
    SpinnerComponent,
  ],
  templateUrl: './cambiar-local-form.component.html',
  styleUrl: './cambiar-local-form.component.scss',
})
export class CambiarLocalFormComponent {
  private destruir$: Subject<void> = new Subject<void>();
  readonly LocalChangeErrorMessages = LocalChangeErrorMessages;
  LocalChangeForm = LocalChangeFormBuilder();
  #colorModeService = inject(ColorModeService);
  _EmpleadosService = inject(EmpleadosService);
  private _LocalsService = inject(LocalesService);

  @Input() Local!: Local;
  @Output() FormsValues = new EventEmitter<Local>();

  loadingLocales = false;
  Locales: Local[] = [];

  ngOnInit(): void {
    this.getLocales();
  }

  ngOnChanges(): void {
    if (this.Local) this.setFormValues();
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.LocalChangeForm.controls
      ? this.LocalChangeForm.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.LocalChangeForm.get(name) as FormControl;
  }

  setFormValues() {
    logger.log(this.Local);

    this.LocalChangeForm.patchValue({
      local_id: this.Local.id,
      // apellido: this.Empleado.nombre,
    });
  }

  getLocales() {
    this.loadingLocales = true;

    this._LocalsService
      .getLocales({
        link: null,
        disablePaginate: '1',
        estado: '1',
      })
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Local[]) => {
        this.loadingLocales = false;
        this.Locales = [...data];
        logger.log(data);
      });
  }

  sendValueFom() {
    if (this.LocalChangeForm.valid) {
      const VALUE_FORM = this.LocalChangeForm.value;
      let LocalSelected = this.Locales.find(
        (local) => local.id == VALUE_FORM.local_id,
      );
      this.FormsValues.emit(LocalSelected);
    } else {
      Swal.mixin({
        customClass: {
          container: this.#colorModeService.getStoredTheme(
            environment.SabinosTheme,
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
