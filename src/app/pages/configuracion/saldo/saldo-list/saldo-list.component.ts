import { Component, effect, inject } from '@angular/core';
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
  SpinnerComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

import { CommonModule } from '@angular/common';
import { Listado } from 'src/app/models/Listados.model';

import { ParametersUrl } from 'src/app/models/Parameter.model';
// import { FiltrosListFormComponent } from '../../../shared/components/forms/filtros-list-form/filtros-list-form.component';
import { IModalAction } from '@coreui/angular/lib/modal/modal.service';
import logger from 'src/app/shared/utils/logger';
import { Filtro } from 'src/app/models/Filter.model';
import dayjs from 'dayjs';
import { HelpersService } from 'src/app/services/helpers.service';
import Swal from 'sweetalert2';
import { ColorModeService } from '@coreui/angular';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
// import { LocalesService } from '../../../services/locales.service';
import { Subject, takeUntil } from 'rxjs';
import { FiltrosListFormComponent } from '../../../../shared/components/forms/filtros-list-form/filtros-list-form.component';

import { Saldo } from '../../../../models/Saldo.model';
import { SaldoService } from '../../../../services/saldo.service';
import { LoginService } from '../../../../services/login.service';

@Component({
  selector: 'app-saldo-list',
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
    SpinnerComponent,
  ],
  templateUrl: './saldo-list.component.html',
  styleUrl: './saldo-list.component.scss',
})
export class SaldoListComponent {
  private destruir$: Subject<void> = new Subject<void>();

  private _SaldoService = inject(SaldoService);
  private _ModalService = inject(ModalService);
  private _HelpersService = inject(HelpersService);
  private _LoginService = inject(LoginService);
  readonly #ColorModeService = inject(ColorModeService);

  loaderTable: boolean = true;
  ParametrosURL: ParametersUrl = {
    allDates: false,
    estado: 1,
    link: null,
    disablePaginate: '0',
    fecha_inicio: dayjs().startOf('month').format('YYYY-MM-DD'),
    fecha_fin: dayjs().endOf('month').format('YYYY-MM-DD'),
  };
  SaldoList!: Listado<Saldo>;

  constructor() {
    effect(() => {
      this.ParametrosURL.local_id = this._LoginService.getUserData().local.id;

      this.getSaldos();
    });
  }

  getSaldos() {
    this.loaderTable = true;

    this._SaldoService
      .getSaldos({
        ...this.ParametrosURL,
        local_id: this._LoginService.getUserData().local.id,
      })
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Listado<Saldo>) => {
        this.loaderTable = false;
        this.SaldoList = { ...data };
        // logger.log(data);
      });
  }

  newPage(link: any) {
    if (link.url == null) return;
    // console.log(link);

    this.ParametrosURL.link = link.url;

    this.getSaldos();
  }

  modalStatusById(id: string, show: boolean) {
    const action: IModalAction = { show, id };
    this._ModalService.toggle(action);
  }

  filtroEvent(filtros: Filtro) {
    logger.log('filtros', filtros);

    filtros.fecha_inicio = dayjs(filtros.fecha.startDate).format('YYYY-MM-DD');
    filtros.fecha_fin = dayjs(filtros.fecha.endDate).format('YYYY-MM-DD');
    const FILTROS_SANETIZE = this._HelpersService.filterData(filtros);

    this.ParametrosURL = {
      ...this.ParametrosURL,
      ...FILTROS_SANETIZE,
      fecha_inicio: FILTROS_SANETIZE.fecha_inicio,
    };

    if (this.ParametrosURL.allDates) {
      delete this.ParametrosURL.fecha_fin;
      delete this.ParametrosURL.fecha_inicio;
    }
    logger.log('this.ParametrosURL', this.ParametrosURL);

    this.getSaldos();
  }

  buscar() {
    this.getSaldos();
  }

  eliminar(saldo: Saldo) {
    Swal.mixin({
      customClass: {
        container: this.#ColorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
    })
      .fire({
        title: '¿Estás seguro?',
        text: 'Este saldo se eliminará y no podrás recuperarlo.',
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
            title: 'Eliminando saldo',
            text: 'Esto puede demorar un momento.',
          });
          // Swal.mixin({
          //   customClass: {
          //     container: this.#ColorModeService.getStoredTheme(
          //       environment.SabinosTheme
          //     ),
          //   },
          // }).fire({
          //   title: 'Eliminando local',
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
          this._SaldoService
            .deleteSaldo(Number(saldo.id))
            .pipe(takeUntil(this.destruir$))
            .subscribe((data) => {
              // this.LocalList.data = this.LocalList.data.filter(
              //   (local) => local.id != Local.id
              // );

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
