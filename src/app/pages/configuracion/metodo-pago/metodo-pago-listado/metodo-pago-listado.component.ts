import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
import { ProductosService } from '../../../../services/productos.service';
import { CommonModule } from '@angular/common';
import { Listado } from 'src/app/models/Listados.model';
import { Producto } from 'src/app/models/Producto.model';
import { ParametersUrl } from 'src/app/models/Parameter.model';
import { FiltrosListFormComponent } from '../../../../shared/components/forms/filtros-list-form/filtros-list-form.component';
import { IModalAction } from '@coreui/angular/lib/modal/modal.service';
import logger from 'src/app/shared/utils/logger';
import { Filtro } from 'src/app/models/Filter.model';
import dayjs from 'dayjs';
import { HelpersService } from 'src/app/services/helpers.service';
import Swal from 'sweetalert2';
import { ColorModeService } from '@coreui/angular';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { NominaService } from '../../../../services/nomina.service';
import { Nomina } from '../../../../models/Nomina.model';
import { MetodoPago } from '../../../../models/MetodoPago.model';
import { MetodoPagoService } from '../../../../services/metodos_pago.service';

@Component({
  selector: 'app-metodo-pago-listado',
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
  templateUrl: './metodo-pago-listado.component.html',
  styleUrl: './metodo-pago-listado.component.scss',
})
export class MetodoPagoListadoComponent {
  private destruir$: Subject<void> = new Subject<void>();

  private _MetodoPagoService = inject(MetodoPagoService);
  private _ModalService = inject(ModalService);
  private _HelpersService = inject(HelpersService);
  readonly #ColorModeService = inject(ColorModeService);

  loaderTable: boolean = true;
  ParametrosURL: ParametersUrl = {
    allDates: true,
    estado: 1,
    link: null,
    disablePaginate: '0',
    local_model: '1',
    // fecha_inicio: dayjs().startOf('month').format('YYYY-MM-DD'),
    // fecha_fin: dayjs().endOf('month').format('YYYY-MM-DD'),
    empleado_model: '1',
  };
  MetodoPagoList!: Listado<MetodoPago>;

  ngOnInit(): void {
    this.getNominas();
  }

  getNominas() {
    this.loaderTable = true;

    this._MetodoPagoService
      .getMetodoPago(this.ParametrosURL)
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Listado<MetodoPago>) => {
        this.loaderTable = false;
        this.MetodoPagoList = { ...data };
        logger.log(data);
      });
  }

  newPage(link: any) {
    if (link.url == null) return;
    // console.log(link);

    this.ParametrosURL.link = link.url;

    this.getNominas();
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
    logger.log('this.ParametrosURL', this.ParametrosURL);

    this.getNominas();
  }

  buscar() {
    this.getNominas();
  }

  eliminar(metodopago: MetodoPago) {
    Swal.mixin({
      customClass: {
        container: this.#ColorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
    })
      .fire({
        title: '¿Estás seguro?',
        text: 'Esta nomina se eliminará y no podrás recuperarla.',
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
            title: 'Eliminando nomina',
            text: 'Esto puede demorar un momento.',
          });

          this._MetodoPagoService
            .deleteMetodoPago(Number(metodopago.id))
            .pipe(takeUntil(this.destruir$))
            .subscribe((data) => {
              this.MetodoPagoList.data = this.MetodoPagoList.data.filter(
                (pago) => pago.id != metodopago.id
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
