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
import { Listado } from 'src/app/models/Listados.model';
import { Producto } from 'src/app/models/Producto.model';
import { ParametersUrl } from 'src/app/models/Parameter.model';
import { FiltrosListFormComponent } from '../../../shared/components/forms/filtros-list-form/filtros-list-form.component';
import { IModalAction } from '@coreui/angular/lib/modal/modal.service';
import logger from 'src/app/shared/utils/logger';
import { Filtro, FiltroKeys } from 'src/app/models/Filter.model';
import dayjs from 'dayjs';
import { HelpersService } from 'src/app/services/helpers.service';
import Swal from 'sweetalert2';
import { ColorModeService } from '@coreui/angular';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { Factura } from '../../../models/Factura.model';
import { GastoService } from '../../../services/gasto.service';
import { Gasto } from '../../../models/Gasto.model';

@Component({
  selector: 'app-gasto-editar',
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
  templateUrl: './gasto-editar.component.html',
  styleUrl: './gasto-editar.component.scss',
})
export class GastoEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();
  private _GastoService = inject(GastoService);
  private _ActivatedRoute = inject(ActivatedRoute);

  ParametrosURL: ParametersUrl = {
    allDates: false,
    estado: 1,
    link: null,
    disablePaginate: '0',
    empleado_model: '1',
    gasto_detalle_model: '1',
    user_model: '1',
    fecha_inicio: dayjs().startOf('month').format('YYYY-MM-DD'),
    fecha_fin: dayjs().endOf('month').format('YYYY-MM-DD'),
  };
  Id!: number;
  Gasto!: Gasto;
  loaderGasto: boolean = false;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getFactura();
  }

  getFactura() {
    this.loaderGasto = true;

    this._GastoService
      .getGastoById(this.Id, this.ParametrosURL)
      // .pipe(delay(3000))
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Gasto) => {
        this.loaderGasto = false;
        this.Gasto = { ...data };
        logger.log(data);
      });
  }
}
