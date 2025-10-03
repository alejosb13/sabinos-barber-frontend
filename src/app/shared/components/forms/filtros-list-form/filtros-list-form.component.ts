import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ButtonModule,
  CardModule,
  ColComponent,
  ContainerComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormLabelDirective,
  FormSelectDirective,
  RowComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

import logger from 'src/app/shared/utils/logger';
import { DateRangePickerComponent } from '../../date-range-picker/date-range-picker.component';
import { LocalesService } from '../../../../services/locales.service';
import { Local } from 'src/app/models/Local.model';
import { ParametersUrl } from 'src/app/models/Parameter.model';
import { IniciarFiltro } from '../../../utils/constants/filtro';
import { Filtro } from '../../../../models/Filter.model';
import dayjs from 'dayjs';
import { Subject, takeUntil } from 'rxjs';
import { Usuario } from '../../../../models/Usuario.model';
import { Empleado } from '../../../../models/Empleado.model';
import { UsuarioesService } from '../../../../services/usuarios.service';
import { EmpleadosService } from '../../../../services/empleados.service';
import { LoginService } from '../../../../services/login.service';
import { InputSingleDateComponent } from '../../input-single-date/input-single-date.component';
import { TipoGastoService } from '../../../../services/tipo_gasto.service';
import { TipoGasto } from '../../../../models/TipoGasto.model';
import { get } from 'lodash';

@Component({
  selector: 'app-filtros-list-form',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    ButtonModule,
    IconDirective,
    DateRangePickerComponent,
    FormsModule,
    FormSelectDirective,
    FormLabelDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    InputSingleDateComponent,
  ],
  templateUrl: './filtros-list-form.component.html',
  styleUrl: './filtros-list-form.component.scss',
})
export class FiltrosListFormComponent {
  private destruir$: Subject<void> = new Subject<void>();

  @Input() showId: boolean = false;
  @Input() showMarca: boolean = false;
  @Input() showDescripcion: boolean = false;
  @Input() showDate: boolean = false;
  @Input() showLocales: boolean = false;
  @Input() showEstado: boolean = false;
  @Input() showValidDates: boolean = false;
  @Input() validDateValue!: boolean | undefined;
  @Input() showEmpleados: boolean = false;
  @Input() showUsers: boolean = false;
  @Input() showTiposGastos: boolean = false;
  @Input() showDateIniFin: boolean = false;
  @Input() fechaFilter?: any = undefined;
  @Input() limpiarTipo: 'mes-actual' | 'dia-actual' | 'personalizado' =
    'mes-actual';
  @Output() filtrar = new EventEmitter<Filtro>();

  private _LocalesServices = inject(LocalesService);
  private _UsuarioesService = inject(UsuarioesService);
  private _EmpleadosService = inject(EmpleadosService);
  private _LoginService = inject(LoginService);
  private _TipoGastoService = inject(TipoGastoService);

  private ParametrosURL: ParametersUrl = {
    allDates: false,
    link: null,
    disablePaginate: '1',
  };

  filtro: Filtro = {
    ...IniciarFiltro,
  };

  Locales: Local[] = [];
  Usuarios: Usuario[] = [];
  TiposGastos: TipoGasto[] = [];
  Empleados: Empleado[] = [];

  constructor() {
    effect(() => {
      this.eventChangeLocal();
    });
  }

  ngOnInit(): void {
    this.getLocales();
    this.getEmpleados();
    this.getUsers();
    this.getTiposGastos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    logger.log('changes', this.filtro);
    this.filtro = {
      ...this.filtro,
      estado: this.showEstado ? 1 : '',
      local_id: Number(this._LoginService.getUserData().local.id),
      allDates: this.validDateValue
        ? this.validDateValue
        : IniciarFiltro.allDates,
      // fecha_inicio: this.fechaFilter
      //   ? this.fechaFilter.fecha_inicio
      //   : IniciarFiltro.fecha.startDate,
      // fecha_fin: this.fechaFilter
      //   ? this.fechaFilter.fecha_fin
      //   : IniciarFiltro.fecha.endDate,
      fecha: {
        startDate: this.fechaFilter
          ? dayjs(this.fechaFilter.fecha_inicio)
          : IniciarFiltro.fecha.startDate,
        endDate: this.fechaFilter
          ? dayjs(this.fechaFilter.fecha_fin)
          : IniciarFiltro.fecha.endDate,
      },
    };
    logger.log('changes fin', this.filtro);
  }

  eventChangeLocal() {
    const USER_DATA = this._LoginService.getUserData();
    this.filtro.local_id = Number(USER_DATA.local.id);
  }

  getLocales() {
    if (this.showLocales) {
      this._LocalesServices
        .getLocales(this.ParametrosURL)
        .pipe(takeUntil(this.destruir$))
        .subscribe((locales: Local[]) => {
          this.Locales = locales;
        });
    }
  }

  getUsers() {
    if (this.showUsers) {
      this._UsuarioesService
        .getUsuarioes(this.ParametrosURL)
        .pipe(takeUntil(this.destruir$))
        .subscribe((Usuarios: Usuario[]) => {
          this.Usuarios = Usuarios;
        });
    }
  }

  getTiposGastos() {
    if (this.showTiposGastos) {
      this._TipoGastoService
        .getTipoGasto(this.ParametrosURL)
        .pipe(takeUntil(this.destruir$))
        .subscribe((TiposGastos: TipoGasto[]) => {
          this.TiposGastos = TiposGastos;
        });
    }
  }

  getEmpleados() {
    if (this.showEmpleados) {
      this._EmpleadosService
        .getEmpleadoes(this.ParametrosURL)
        .pipe(takeUntil(this.destruir$))
        .subscribe((Empleados: Empleado[]) => {
          this.Empleados = Empleados;
        });
    }
  }

  onFiltrar() {
    // logger.log(this.filtro);
    let filtro = {
      ...this.filtro,
    };
    this.filtrar.emit(filtro);
  }

  // Método para obtener las fechas según el tipo de limpieza
  private obtenerFechasLimpieza() {
    switch (this.limpiarTipo) {
      case 'dia-actual':
        return {
          startDate: dayjs().startOf('day'),
          endDate: dayjs().endOf('day'),
        };
      case 'mes-actual':
        return {
          startDate: dayjs().startOf('month'),
          endDate: dayjs().endOf('month'),
        };
      case 'personalizado':
        // Aquí puedes agregar lógica personalizada o retornar fechas por defecto
        return {
          startDate: dayjs().startOf('month'),
          endDate: dayjs().endOf('month'),
        };
      default:
        return {
          startDate: dayjs().startOf('month'),
          endDate: dayjs().endOf('month'),
        };
    }
  }

  // Método para limpiar los campos
  onLimpiar() {
    // Obtener las fechas según el tipo configurado
    const fechasLimpieza = this.obtenerFechasLimpieza();

    // Crear un nuevo objeto con fechas completamente nuevas para forzar detección de cambios
    this.filtro = {
      ...IniciarFiltro,
      fecha: fechasLimpieza,
    };
    console.log('limpiar', this.filtro, 'tipo:', this.limpiarTipo);
  }

  handleDate(event: { endDate: dayjs.Dayjs; startDate: dayjs.Dayjs }) {
    logger.log('range', event);
    this.filtro.fecha = event;
  }

  handleDateInicioFin(event: string, section: string) {
    logger.log('range', event);
    logger.log('section', section);

    if (section === 'fin') this.filtro.fecha.endDate = dayjs(event);
    if (section === 'inicio') this.filtro.fecha.startDate = dayjs(event);
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
