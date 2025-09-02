import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  SpinnerComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { ParametersUrl } from 'src/app/models/Parameter.model';
import { FiltrosListFormComponent } from '../../../shared/components/forms/filtros-list-form/filtros-list-form.component';
import logger from 'src/app/shared/utils/logger';
import dayjs from 'dayjs';
import { FormsModule } from '@angular/forms';
import { GastoService } from '../../../services/gasto.service';
import { Gasto } from '../../../models/Gasto.model';
import { Venta } from '../../../models/Venta.model';
import { VentaService } from '../../../services/venta.service';

@Component({
  selector: 'app-ventas-producto-detalle',
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
  templateUrl: './ventas-producto-detalle.component.html',
  styleUrl: './ventas-producto-detalle.component.scss',
})
export class VentasProductoDetalleComponent {
  private destruir$: Subject<void> = new Subject<void>();
  private _VentaService = inject(VentaService);
  private _ActivatedRoute = inject(ActivatedRoute);

  ParametrosURL: ParametersUrl = {
    allDates: false,
    estado: 1,
    cliente_model: '1',
    link: null,
    disablePaginate: '0',
    venta_detalle_model: '1',
    metodo_pago_model: '1',
    user_model: '1',
    fecha_inicio: dayjs().startOf('month').format('YYYY-MM-DD'),
    fecha_fin: dayjs().endOf('month').format('YYYY-MM-DD'),
  };
  Id!: number;
  Venta!: Venta;
  loaderGasto: boolean = false;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getVenta();
  }

  getVenta() {
    this.loaderGasto = true;

    this._VentaService
      .getVentasById(this.Id, this.ParametrosURL)
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Venta) => {
        this.loaderGasto = false;
        this.Venta = { ...data };
        logger.log(data);
      });
  }
}
