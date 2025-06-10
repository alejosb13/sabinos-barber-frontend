import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
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
  SpinnerModule,
} from '@coreui/angular';
import {
  agregarExtraInArrayForm,
  ExtraNominaForm,
  NominaCrudFormBuilder,
} from './utils/form';
import { CommonModule } from '@angular/common';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import { NominaCrudErrorMessages } from './utils/validations';
import Swal from 'sweetalert2';
import logger from 'src/app/shared/utils/logger';
import { environment } from 'src/environments/environment';
import { DirectivesModule } from '../../../directivas/directives.module';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { Empleado } from 'src/app/models/Empleado.model';
import { LocalesService } from '../../../../services/locales.service';
import { Local } from '../../../../models/Local.model';
import { Subject, takeUntil } from 'rxjs';
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
import { IconComponent, IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-nomina-crud-form',
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
    IconDirective,
  ],
  templateUrl: './nomina-crud-form.component.html',
  styleUrl: './nomina-crud-form.component.scss',
})
export class NominaCrudFormComponent {
  NominaCrudForm = NominaCrudFormBuilder();
  readonly NominaCrudErrorMessages = NominaCrudErrorMessages;

  private destruir$: Subject<void> = new Subject<void>();

  Fecha = {
    startDate: START_DATE, // Inicio del día de la fecha dada
    endDate: END_DATE, // Fin del día de la fecha dada
  };
  loadingEmpleados: boolean = false;
  Empleados: Empleado[] = [];
  EmpleadoId: number = 0;

  #colorModeService = inject(ColorModeService);
  private _EmpleadosService = inject(EmpleadosService);
  private _NominaService = inject(NominaService);
  private _LocalesService = inject(LocalesService);
  private _LoginService = inject(LoginService);

  @Input() NominaData: any;
  @Output() FormsValues = new EventEmitter<any>();

  Empleadoes: Empleado[] = [];

  loadingLocales = false;
  Locales: Local[] = [];

  loadingNomina: boolean = false;
  TotalExtras: number = 0;
  TotalSeccion: number = 0;
  constructor() {
    // this.changeSesionStorage();
  }

  ngOnInit(): void {
    logger.log('NominaData', this.NominaData);
    // this.getEmpleados();
    // this.changeEmpleado();
    // this.getLocales();
    this.changeExtraValues();
    this.changePresentismo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    logger.log('changes', changes);
    this.TotalExtras = this.NominaData.facturaFinal;
    // this.Presentismo = this.NominaData.facturaFinal;
  }

  // changeSesionStorage() {
  //   effect(() => {
  //     this._LoginService.getUserData();
  //     this.formInit();
  //   });
  // }

  getControlError(name: string): ValidationErrors | null {
    const control = this.NominaCrudForm.controls
      ? this.NominaCrudForm.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  changeExtraValues() {
    this.NominaCrudForm.controls.extras_nomina.valueChanges.subscribe(
      (extras) => {
        this.TotalExtras = this.NominaData.facturaFinal;
        let totalFinalSalario = this.NominaData.facturaFinal || 0;
        extras.forEach((extra, index) => {
          if (extra.extra_id == 1) {
            totalFinalSalario += Number(extra.monto);
          } else {
            totalFinalSalario -= Number(extra.monto);
          }
          this.ExtraNominaFormArray.at(index).patchValue(
            {
              monto_total: totalFinalSalario,
            },
            { emitEvent: false }
          );
        });
        this.TotalExtras = totalFinalSalario;

        // const presentismovalue =
        //   this.NominaCrudForm.controls.presentismo.value || 0;
        // const Porcentaje = 1 + presentismovalue / 100;
        // this.Presentismo = this.TotalExtras * Porcentaje;
        // this.NominaCrudForm.patchValue(
        //   {
        //     presentismo: this.Presentismo,
        //   },
        //   { emitEvent: false }
        // );

        // logger.log('total ', this.NominaData.facturaFinal);
      }
    );
  }

  changePresentismo() {
    this.NominaCrudForm.controls.presentismo.valueChanges.subscribe(
      (presentismo) => {
        const TotalExtras = this.TotalExtras || 0;
        const Porcentaje = 1 + Number(presentismo) / 100;
        // this.Presentismo = TotalExtras * Porcentaje;

        // this.NominaCrudForm.patchValue(
        //   {
        //     presentismo: this.Presentismo,
        //   },
        //   { emitEvent: false }
        // );
      }
    );
  }

  getPresentismo(): number {
    const presentismoPorcentaje =
      this.NominaCrudForm.controls.presentismo.value || 0;
    const presentismo =
      this.NominaData.facturaFinal * (presentismoPorcentaje / 100);
    return presentismo;
  }

  getTotalSeccion() {
    const presentismovalue = this.getPresentismo();

    this.TotalExtras + presentismovalue;
    return this.TotalExtras + presentismovalue;
  }

  getControl(name: string): FormControl {
    return this.NominaCrudForm.get(name) as FormControl;
  }

  changeEmpleado() {
    this.getControl('empleado_id').valueChanges.subscribe((idEmpleado) => {
      this.loadingNomina = true;
      logger.log('idEmpleado', idEmpleado);

      this.EmpleadoId = idEmpleado;
      this.getNominaEmpleado();
    });
  }

  get ExtraNominaFormArray(): FormArray<FormGroup<ExtraNominaForm>> {
    return this.NominaCrudForm.get('extras_nomina') as FormArray<
      FormGroup<ExtraNominaForm>
    >;
  }

  getExtraNominaFormControlError(
    index: number,
    controlName: string
  ): ValidationErrors | null {
    const extraFormGroup = this.ExtraNominaFormArray.at(index) as FormGroup;
    const control = extraFormGroup.get(controlName);
    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  agregarExtraInNomina() {
    // agregarMetodoPagoArray(this.PedidoCrudForm);
    agregarExtraInArrayForm(this.NominaCrudForm);
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
    // logger.log(this.Nomina);
    // this.NominaCrudForm.patchValue({
    //   empleado_id: this.Nomina.empleado_id,
    //   descripcion: this.Nomina.descripcion,
    // });
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
    // this.loadingEmpleados = true;
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
      .subscribe((facturas: Factura[]) => {
        logger.log('data nomina', facturas);
        this.loadingNomina = false;
        // const sumaTotal = facturas.reduce(
        //   (acumulador, item) => acumulador + item.total,
        //   0
        // );

        // logger.log(sumaTotal);
        // this.NominaCrudForm.patchValue({
        //   monto_facturado: sumaTotal,
        // });
      });
  }

  sendValueFom() {
    if (this.NominaCrudForm.valid) {
      // const USER_DATA = this._LoginService.userData();
      const SERVICIOS_FACTURADOS_TOTAL =
        this.NominaData.nomina_empleado.servicios.find(
          (serv: any) => serv.descripcion === 'TOTAL'
        );
      const USER_DATA = this._LoginService.getUserData();

      const NOMINA = {
        // ...this.NominaCrudForm.value,
        empleado_id: this.NominaData.empleado,
        descripcion: this.NominaData.comentario,
        monto_facturado: SERVICIOS_FACTURADOS_TOTAL.facturado,
        presentismo: this.NominaCrudForm.controls.presentismo.value,
        presentismoTotal: this.getPresentismo(),
        total_facturado: this.NominaData.facturaFinal,
        vales: this.NominaCrudForm.controls.extras_nomina
          .getRawValue()
          .map((extra: any) => ({
            tipo: extra.extra_id,
            monto: Number(extra.monto),
            descripcion: extra.descripcion,
            // monto_total: extra.monto_total,
          })),
        servicios: this.NominaData.nomina_empleado.servicios.filter(
          (item: any) => item.descripcion !== 'TOTAL'
        ),
        factura_detalle: this.NominaData.nomina_empleado.factura_detalle,
        local_id: USER_DATA.local.id,
        // presentismoTotal: this.getPresentismo(),
        // totalSeccion: this.getTotalSeccion(),

        // userNominaSelected: {
        //   facturaFinal: this.NominaData.facturaFinal,
        //   fecha_fin: this.NominaData.fecha_fin,
        //   fecha_inicio: this.NominaData.fecha_inicio,
        //   nomina_empleado: this.NominaData.nomina_empleado,
        // },
      };
      logger.log(NOMINA);

      this.FormsValues.emit(NOMINA);
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
    this.getNominaEmpleado();
    this.Fecha = event;
  }

  eliminarExtraForm(index: number) {
    this.ExtraNominaFormArray.removeAt(index);
  }

  ChangeMontoInput(NominaForm: FormGroup<ExtraNominaForm>, index: number) {
    logger.log('NominaForm change', NominaForm);
    logger.log('index change', index);

    //  NominaForm.at(index).patchValue({
    //       pendienteEliminado: false,
    //     });
    const { extra_id, monto, monto_total } = NominaForm.getRawValue();

    NominaForm.patchValue({
      // extra_id: extra_id ?? null,
      // monto: this.OperacionExtra(Number(extra_id), Number(monto)) ?? null,
      // monto_total: this.OperacionExtra(Number(extra_id), Number(monto)) ?? null,
    });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
