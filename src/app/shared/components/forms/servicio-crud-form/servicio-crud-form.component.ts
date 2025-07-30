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
  FormSelectDirective,
  ModalModule,
  RowComponent,
} from '@coreui/angular';
import { SelectComponent } from 'src/app/documentacion/forms/select/select.component';
import { CommonModule } from '@angular/common';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import Swal from 'sweetalert2';
import logger from 'src/app/shared/utils/logger';
import { environment } from 'src/environments/environment';
import { DirectivesModule } from '../../../directivas/directives.module';
import { Cliente } from 'src/app/models/Cliente.model';
import { LocalesService } from 'src/app/services/locales.service';
import { Local } from 'src/app/models/Local.model';
import { Subject, takeUntil } from 'rxjs';
import { InputSingleDateComponent } from '../../input-single-date/input-single-date.component';
import { ServicioCrudFormBuilder } from './utils/form';
import {
  formatearFecha,
  IniciarFiltro,
  NOW,
  obtenerRangoFecha,
} from '../../../utils/constants/filtro';
import { ServicioCrudErrorMessages } from './utils/validations';
import { Servicios } from '../../../../models/Servicios.model';

@Component({
  selector: 'app-servicio-crud-form',
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
    InputSingleDateComponent,
  ],
  templateUrl: './servicio-crud-form.component.html',
  styleUrl: './servicio-crud-form.component.scss',
})
export class ServicioCrudFormComponent {
  private destruir$: Subject<void> = new Subject<void>();

  readonly ClienteCrudErrorMessages = ServicioCrudErrorMessages;
  ServicioCrudForm = ServicioCrudFormBuilder();
  #colorModeService = inject(ColorModeService);
  _LocalesServices = inject(LocalesService);

  fecha_nacimiento: any = {};

  @Input() Servicio!: Servicios;
  @Output() FormsValues = new EventEmitter<any>();

  // Locales: Local[] = [];
  ngOnInit(): void {
    if (this.Servicio) this.setFormValues();

    if (!this.Servicio) {
      // this.fecha_nacimiento = obtenerRangoFecha();
      this.ServicioCrudForm.patchValue({
        // fecha_nacimiento: formatearFecha(
        //   this.fecha_nacimiento.startDate,
        //   'YYYY-MM-DD'
        // ),
      });
    }
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.ServicioCrudForm.controls
      ? this.ServicioCrudForm.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.ServicioCrudForm.get(name) as FormControl;
  }

  setFormValues() {
    logger.log(this.Servicio);

    this.ServicioCrudForm.patchValue({
      descripcion: this.Servicio.descripcion,
      precio: this.Servicio.precio,
      precio_nomina: this.Servicio.precio_nomina,
    });
    // this.fecha_nacimiento = obtenerRangoFecha(this..fecha_nacimiento);
  }

  sendValueFom() {
    if (this.ServicioCrudForm.valid) {
      this.FormsValues.emit(this.ServicioCrudForm.getRawValue());
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
    // this.destruir$.next();
    // this.destruir$.complete();
  }
}
