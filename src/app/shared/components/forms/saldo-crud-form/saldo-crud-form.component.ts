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
import { SaldoCrudFormBuilder } from './utils/form';
import { CommonModule } from '@angular/common';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import { SaldoCrudErrorMessages } from './utils/validations';
import Swal from 'sweetalert2';
import logger from 'src/app/shared/utils/logger';
import { environment } from 'src/environments/environment';
import { DirectivesModule } from '../../../directivas/directives.module';
import { LocalesService } from 'src/app/services/locales.service';
import { Saldo } from '../../../../models/Saldo.model';
import { SaldoService } from '../../../../services/saldo.service';
import { Subject, takeUntil } from 'rxjs';
import { MetodoPagoService } from '../../../../services/metodos_pago.service';
import { MetodoPago } from '../../../../models/MetodoPago.model';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-saldo-crud-form',
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
  templateUrl: './saldo-crud-form.component.html',
  styleUrl: './saldo-crud-form.component.scss',
})
export class SaldoCrudFormComponent {
  readonly SaldoCrudErrorMessages = SaldoCrudErrorMessages;
  SaldoCrudForm = SaldoCrudFormBuilder();
  #colorModeService = inject(ColorModeService);
  _LoginService = inject(LoginService);
  _SaldoService = inject(SaldoService);
  _MetodoPagoService = inject(MetodoPagoService);
  private destruir$: Subject<void> = new Subject<void>();

  @Input() Saldo!: Saldo;
  @Output() FormsValues = new EventEmitter<any>();

  loadingMetodosPagos: boolean = false;
  MetodosPagos: MetodoPago[] = [];

  ngOnInit(): void {
    this.getMetodosPagos();
  }

  ngOnChanges(): void {
    if (this.Saldo) this.setFormValues();
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.SaldoCrudForm.controls
      ? this.SaldoCrudForm.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.SaldoCrudForm.get(name) as FormControl;
  }

  setFormValues() {
    logger.log(this.Saldo);

    this.SaldoCrudForm.patchValue({
      monto: this.Saldo.monto,
      metodo_pago_id: this.Saldo.metodo_pago_id,
    });
  }

  getMetodosPagos() {
    this.loadingMetodosPagos = true;
    this._MetodoPagoService
      .getMetodoPago({
        estado: 1,
        disablePaginate: '1',
        link: null,
      })
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: MetodoPago[]) => {
        this.loadingMetodosPagos = false;
        this.MetodosPagos = [...data];
      });
  }

  sendValueFom() {
    if (this.SaldoCrudForm.valid) {
      const FORM_VALUES = this.SaldoCrudForm.getRawValue();
      this.FormsValues.emit({
        ...FORM_VALUES,
        local_id: this._LoginService.getUserData().local.id,
      });
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
