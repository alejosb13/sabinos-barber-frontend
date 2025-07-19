import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
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
  SpinnerModule,
} from '@coreui/angular';
import { NominaCrudFormBuilder } from './utils/form';
import { CommonModule } from '@angular/common';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import { NominaSeleccionCrudErrorMessages } from './utils/validations';
import logger from 'src/app/shared/utils/logger';
import { DirectivesModule } from '../../../directivas/directives.module';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { Empleado } from 'src/app/models/Empleado.model';
import { LocalesService } from '../../../../services/locales.service';
import { Local } from '../../../../models/Local.model';
import { Subject, takeUntil } from 'rxjs';
import { Nomina, NominaEmpleado } from '../../../../models/Nomina.model';
import { DateRangePickerComponent } from '../../date-range-picker/date-range-picker.component';
import {
  END_DATE,
  formatearFecha,
  START_DATE,
} from '../../../utils/constants/filtro';
import dayjs from 'dayjs';
import { Factura } from '../../../../models/Factura.model';
import { LoginService } from '../../../../services/login.service';
import { NominaService } from '../../../../services/nomina.service';

@Component({
  selector: 'app-nomina-seleccion-empleado-form',
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
    SpinnerModule,
    DateRangePickerComponent,
  ],
  templateUrl: './nomina-seleccion-empleado-form.component.html',
  styleUrl: './nomina-seleccion-empleado-form.component.scss',
})
export class NominaSeleccionEmpleadoFormComponent {
  NominaCrudForm = NominaCrudFormBuilder();
  readonly NominaSeleccionCrudErrorMessages = NominaSeleccionCrudErrorMessages;

  private destruir$: Subject<void> = new Subject<void>();

  Fecha = {
    startDate: START_DATE, // Inicio del día de la fecha dada
    endDate: END_DATE, // Fin del día de la fecha dada
  };
  loadingEmpleados: boolean = false;
  Empleados: Empleado[] = [];
  EmpleadoId: number = 0;
  NominaEmpleado!: NominaEmpleado;

  #colorModeService = inject(ColorModeService);
  private _EmpleadosService = inject(EmpleadosService);
  private _NominaService = inject(NominaService);
  private _LocalesService = inject(LocalesService);
  private _LoginService = inject(LoginService);

  @Input() Nomina!: Nomina;
  @Output() FormsValues = new EventEmitter<any>();

  loadingLocales = false;
  Locales: Local[] = [];

  // constructor() {
  //   this.changeSesionStorage();
  // }

  ngOnInit(): void {
    this.getEmpleados();
    this.changeEmpleado();
    this.changeComentario();
    this.getLocales();
  }

  // changeSesionStorage() {
  //   effect(() => {
  //     this._LoginService.getUserData();
  //     this.formInit();
  //   });
  // }

  // formInit() {}

  getControlError(name: string): ValidationErrors | null {
    const control = this.NominaCrudForm.controls
      ? this.NominaCrudForm.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.NominaCrudForm.get(name) as FormControl;
  }

  changeComentario() {
    this.getControl('descripcion').valueChanges.subscribe((descripcion) => {
      if (this.NominaEmpleado) {
        this.sendValueFom();
      }
    });
  }

  changeEmpleado() {
    this.getControl('empleado_id').valueChanges.subscribe((idEmpleado) => {
      this._NominaService.LoadingCrud = true;
      logger.log('idEmpleado', idEmpleado);

      this.EmpleadoId = idEmpleado;
      this.getNominaEmpleado();
    });
  }

  validPorcentaje(total: number) {
    if (this.getControl('adicional').value) {
      const porcentajeAdicional = this.getControl('porcentaje_adicional').value;

      // Verifica que el porcentajeAdicional sea un número válido
      if (porcentajeAdicional && !isNaN(porcentajeAdicional)) {
        // Divide el porcentaje entre 100 para convertirlo a decimal
        const montoAdicional = (total * porcentajeAdicional) / 100;
        total = Number(montoAdicional) + Number(total);
      }
    }
    return total;
  }

  setFormValues() {
    logger.log(this.Nomina);

    this.NominaCrudForm.patchValue({
      empleado_id: this.Nomina.empleado_id,
      descripcion: this.Nomina.descripcion,
    });
  }

  getEmpleados() {
    this.loadingEmpleados = true;
    this._EmpleadosService
      .getEmpleadoes({
        estado: 1,
        disablePaginate: '1',
        link: null,
      })
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Empleado[]) => {
        this.loadingEmpleados = false;
        this.Empleados = [...data];
      });
  }

  getNominaEmpleado() {
    this._NominaService.LoadingCrud = true;
    this._NominaService
      .getNominaEmpleado(this.EmpleadoId, {
        estado: 1,
        disablePaginate: '1',
        link: null,
        fecha_inicio: formatearFecha(this.Fecha.startDate, 'YYYY-MM-DD'),
        fecha_fin: formatearFecha(this.Fecha.endDate, 'YYYY-MM-DD'),
      })
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((nominaEmpleado: NominaEmpleado) => {
        logger.log('data nomina', nominaEmpleado);

        this._NominaService.LoadingCrud = false;
        this.NominaEmpleado = nominaEmpleado;
        this.sendValueFom();
      });
  }

  sendValueFom() {
    let nominaSelection = this.NominaCrudForm.getRawValue();
    logger.log('nominaSelection', nominaSelection);
    this.FormsValues.emit({
      empleado: this.EmpleadoId,
      comentario: nominaSelection.descripcion,
      fecha_inicio: formatearFecha(this.Fecha.startDate, 'YYYY-MM-DD'),
      fecha_fin: formatearFecha(this.Fecha.endDate, 'YYYY-MM-DD'),
      nomina_empleado: this.NominaEmpleado,
    });
  }

  getLocales() {
    this.loadingLocales = true;

    this._LocalesService
      .getLocales({
        link: null,
        disablePaginate: '1',
      })
      // .pipe(delay(3000))
      // .pipe(takeUntil(this.destruir$))
      .subscribe((data: Local[]) => {
        this.loadingLocales = false;
        this.Locales = [...data];
        logger.log(data);
      });
  }

  handleDate(event: { endDate: dayjs.Dayjs; startDate: dayjs.Dayjs }) {
    logger.log('range', event);
    this.Fecha = event;
    this.getNominaEmpleado();
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
