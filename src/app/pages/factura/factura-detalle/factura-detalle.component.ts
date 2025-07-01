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
import { FacturaDetalleMetodoPago } from '../../../models/FacturaDetail';

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
  ],
  templateUrl: './factura-detalle.component.html',
  styleUrl: './factura-detalle.component.scss',
})
export class FacturaDetalleComponent {
  private destruir$: Subject<void> = new Subject<void>();
  private _FacturasService = inject(FacturasService);
  private _ActivatedRoute = inject(ActivatedRoute);

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
        logger.log(data);
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
      return total + metodo.monto;
    }, 0);
  }
}
