import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { delay, Subject, takeUntil, timer } from 'rxjs';
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
import { FacturasService } from '../../../services/facturas.service';
import { CommonModule } from '@angular/common';
import { ParametersUrl } from 'src/app/models/Parameter.model';
import { FiltrosListFormComponent } from '../../../shared/components/forms/filtros-list-form/filtros-list-form.component';
import logger from 'src/app/shared/utils/logger';
import { FormsModule } from '@angular/forms';
import { Factura } from '../../../models/Factura.model';
import {
  FacturaDetalle,
  FacturaDetalleMetodoPago,
} from '../../../models/FacturaDetail';
import dayjs from 'dayjs';
import { HelpersService } from '../../../services/helpers.service';
import { Filtro } from '../../../models/Filter.model';
import { IModalAction } from '@coreui/angular/lib/modal/modal.service';

type ServicioResumen = {
  id: number;
  descripcion: string;
  cantidad: number;
};

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [
    TableDirective,
    CardModule,
    GridModule,
    IconDirective,
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
    FiltrosListFormComponent,
  ],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss',
})
export class FacturaDetalleComponent {
  private destruir$: Subject<void> = new Subject<void>();
  private _FacturasService = inject(FacturasService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _HelpersService = inject(HelpersService);
  private _ModalService = inject(ModalService);

  ParametrosURL: ParametersUrl = {
    allDates: false,
    estado: 1,
    link: null,
    disablePaginate: '0',
    cliente_model: '1',
    empleado_model: '1',
    user_model: '1',
    factura_detalle_model: '1',
    metodo_pago_model: '1',
  };
  Id!: number;
  Factura!: Factura;
  loaderFactura: boolean = false;

  ContadorServicios: ServicioResumen[] = [];

  expandedRow: number | null = null;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getFactura();
  }

  getFactura() {
    this.loaderFactura = true;

    this._FacturasService
      .getFacturaById(this.Id, this.ParametrosURL)
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Factura) => {
        this.loaderFactura = false;
        this.Factura = { ...data };
        // logger.log(data);
        this.ContadorServicios = this.agruparServiciosPorId(
          data.factura_detalle || []
        );
      });
  }

  toggleDetail(index: number) {
    this.expandedRow = this.expandedRow === index ? null : index;
  }

  sumarTodosLosMetodosPagos(
    MetodoPagoDetalle: FacturaDetalleMetodoPago[] | undefined
  ): number {
    if (!MetodoPagoDetalle) return 0;

    return MetodoPagoDetalle.reduce((total, metodo) => {
      return Number(total) + Number(metodo.monto);
    }, 0);
  }

  filtroEvent(filtros: Filtro) {
    logger.log('filtros', filtros);

    // filtros.fecha_inicio = dayjs(filtros.fecha.startDate).format('YYYY-MM-DD');
    // filtros.fecha_fin = dayjs(filtros.fecha.endDate).format('YYYY-MM-DD');
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

    this.getFactura();
  }

  modalStatusById(id: string, show: boolean) {
    const action: IModalAction = { show, id };
    this._ModalService.toggle(action);
  }

  agruparServiciosPorId(FacturaDetalle: FacturaDetalle[]): ServicioResumen[] {
    const conteo = new Map<number, ServicioResumen>();

    for (const item of FacturaDetalle) {
      const Servicio = item.servicio;

      if (conteo.has(Number(Servicio?.id))) {
        conteo.get(Number(Servicio?.id))!.cantidad += 1;
      } else {
        conteo.set(Number(Servicio?.id), {
          id: Number(Servicio?.id),
          descripcion: String(Servicio?.descripcion),
          cantidad: 1,
        });
      }
    }

    return Array.from(conteo.values());
  }
}
