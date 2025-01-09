import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonDirective,
  FormControlDirective,
  InputGroupComponent,
  TableDirective,
  PaginationComponent,
  PageItemDirective,
  PageLinkDirective,
  GridModule,
  CardModule,
  TooltipDirective,
  ModalModule,
  ButtonModule,
  ModalService,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

import { CommonModule } from '@angular/common';
import { Listado } from 'src/app/models/Listados.model';
import { Empleado } from 'src/app/models/Empleado.model';
import { ParametersUrl } from 'src/app/models/Parameter.model';
import { FiltrosListFormComponent } from '../../../shared/components/forms/filtros-list-form/filtros-list-form.component';
import { IModalAction } from '@coreui/angular/lib/modal/modal.service';
import logger from 'src/app/shared/utils/logger';
import { Filtro } from 'src/app/models/Filter.model';
import dayjs from 'dayjs';
import { HelpersService } from 'src/app/services/helpers.service';
import Swal from 'sweetalert2';
import { ColorModeService } from '@coreui/angular';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { EmpleadosService } from '../../../services/empleados.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-empleado-listado',
  standalone: true,
  imports: [
    TableDirective,
    CardModule,
    GridModule,
    InputGroupComponent,
    FormControlDirective,
    ButtonDirective,
    IconDirective,
    PaginationComponent,
    PageItemDirective,
    PageLinkDirective,
    RouterLink,
    CommonModule,
    TooltipDirective,
    FiltrosListFormComponent,
    ModalModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './empleado-listado.component.html',
  styleUrl: './empleado-listado.component.scss',
})
export class EmpleadoListadoComponent {
  private destruir$: Subject<void> = new Subject<void>();

  private _EmpleadosService = inject(EmpleadosService);
  private _ModalService = inject(ModalService);
  private _HelpersService = inject(HelpersService);
  readonly #ColorModeService = inject(ColorModeService);

  loaderTable: boolean = true;
  ParametrosURL: ParametersUrl = {
    allDates: true,
    estado: 1,
    link: null,
    disablePaginate: '0',
    dateIni: dayjs().startOf('month').format('YYYY-MM-DD'),
    dateFin: dayjs().endOf('month').format('YYYY-MM-DD'),
  };
  EmpleadoList!: Listado<Empleado>;

  ngOnInit(): void {
    this.getEmpleados();
  }

  getEmpleados() {
    this.loaderTable = true;

    this._EmpleadosService
      .getEmpleadoes(this.ParametrosURL)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Listado<Empleado>) => {
        this.loaderTable = false;
        this.EmpleadoList = { ...data };
        console.log(data);
      });
  }

  newPage(link: any) {
    if (link.url == null) return;
    // console.log(link);

    this.ParametrosURL.link = link.url;

    this.getEmpleados();
  }

  modalStatusById(id: string, show: boolean) {
    const action: IModalAction = { show, id };
    this._ModalService.toggle(action);
  }

  filtroEvent(filtros: Filtro) {
    logger.log('filtros', filtros);

    filtros.dateIni = dayjs(filtros.fecha.startDate).format('YYYY-MM-DD');
    filtros.dateFin = dayjs(filtros.fecha.endDate).format('YYYY-MM-DD');
    const FILTROS_SANETIZE = this._HelpersService.filterData(filtros);

    this.ParametrosURL = {
      ...this.ParametrosURL,
      ...FILTROS_SANETIZE,
      dateIni: FILTROS_SANETIZE.dateIni,
    };
    logger.log('this.ParametrosURL', this.ParametrosURL);

    this.getEmpleados();
  }

  buscar() {
    this.getEmpleados();
  }

  eliminar(Empleado: Empleado) {
    Swal.mixin({
      customClass: {
        container: this.#ColorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
    })
      .fire({
        title: '¿Estás seguro?',
        text: 'Este Empleado se eliminará y no podrás recuperarlo.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#51cbce',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._HelpersService.loaderSweetAlert({
            title: 'Eliminando Empleado',
            text: 'Esto puede demorar un momento.',
          });
          // Swal.mixin({
          //   customClass: {
          //     container: this.#ColorModeService.getStoredTheme(
          //       environment.SabinosTheme
          //     ),
          //   },
          // }).fire({
          //   title: 'Eliminando Empleado',
          //   text: 'Esto puede demorar un momento.',
          //   timerProgressBar: true,
          //   allowEscapeKey: false,
          //   allowOutsideClick: false,
          //   // allowEnterKey: false,
          //   focusConfirm: false,
          //   didOpen: () => {
          //     Swal.showLoading();
          //   },
          // });
          this._EmpleadosService
            .deleteEmpleado(Number(Empleado.id))
            .pipe(takeUntil(this.destruir$))
            .subscribe((data) => {
              this.EmpleadoList.data = this.EmpleadoList.data.filter(
                (Empleado) => Empleado.id != Empleado.id
              );

              Swal.mixin({
                customClass: {
                  container: this.#ColorModeService.getStoredTheme(
                    environment.SabinosTheme
                  ),
                },
              }).fire({
                text: data[0],
                icon: 'success',
              });
            });
        }
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}