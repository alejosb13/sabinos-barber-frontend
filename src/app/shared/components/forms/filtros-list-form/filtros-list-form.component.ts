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
  @Input() fechaFilter?: any = undefined;
  @Output() filtrar = new EventEmitter<Filtro>();

  private _LocalesServices = inject(LocalesService);
  private _UsuarioesService = inject(UsuarioesService);
  private _EmpleadosService = inject(EmpleadosService);
  private _LoginService = inject(LoginService);

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
  }

  ngOnChanges(changes: SimpleChanges): void {
    logger.log(changes, this.filtro);
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

  // Método para limpiar los campos
  onLimpiar() {
    this.filtro = { ...IniciarFiltro };
  }

  handleDate(event: { endDate: dayjs.Dayjs; startDate: dayjs.Dayjs }) {
    logger.log('range', event);
    this.filtro.fecha = event;
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
