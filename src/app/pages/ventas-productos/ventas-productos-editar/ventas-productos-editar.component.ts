import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CardModule,
  ColorModeService,
  GridModule,
  SpinnerComponent,
} from '@coreui/angular';
import { Producto } from 'src/app/models/Producto.model';
import { ProductosService } from 'src/app/services/productos.service';
import logger from 'src/app/shared/utils/logger';
import { ProductoCrudFormComponent } from '../../../shared/components/forms/producto-crud-form/producto-crud-form.component';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { HelpersService } from '../../../services/helpers.service';
import { VentaService } from '../../../services/venta.service';
import { Venta } from '../../../models/Venta.model';
import { VentasProductosCrudFormComponent } from '../../../shared/components/forms/ventas-productos-crud-form/ventas-productos-crud-form.component';

@Component({
  selector: 'app-ventas-productos-editar',
  standalone: true,
  imports: [
    CardModule,
    GridModule,
    VentasProductosCrudFormComponent,
    SpinnerComponent,
  ],
  templateUrl: './ventas-productos-editar.component.html',
  styleUrl: './ventas-productos-editar.component.scss',
})
export class VentasProductosEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  // private _ProductosService = inject(ProductosService);
  private _VentaService = inject(VentaService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;
  Id!: number;
  Venta!: Venta;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getVentaById();
  }

  FormsValues(venta: Venta) {
    logger.log(venta);

    this._HelpersService.loaderSweetAlert({
      title: 'Actualizando producto',
      text: 'Esto puede demorar un momento.',
    });

    // this.loader = true;

    this._VentaService
      .updateVentas(this.Id, venta)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data) => {
        this.loader = false;
        // console.log(data);
        this.Venta = data.producto;
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Producto modificado con éxito',
            icon: 'success',
          })
          .then((result) => {
            logger.log(result);
          });
      });
  }

  getVentaById() {
    this._VentaService
      .getVentasById(this.Id, {
        link: null,
        cliente_model: '1',
        user_model: '1',
        venta_detalle_model: '1',
      })
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Venta) => {
        this.loader = false;
        this.Venta = { ...data };
        logger.log(data);
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
