import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import logger from 'src/app/shared/utils/logger';
import {
  CardModule,
  ColorModeService,
  ContainerComponent,
  GridModule,
} from '@coreui/angular';
import { ProductosService } from 'src/app/services/productos.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Producto } from '../../../models/Producto.model';
import { ProductoCrudFormComponent } from '../../../shared/components/forms/producto-crud-form/producto-crud-form.component';
import { Subject, takeUntil } from 'rxjs';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-producto-insertar',
  standalone: true,
  templateUrl: './producto-insertar.component.html',
  styleUrl: './producto-insertar.component.scss',
  imports: [
    CardModule,
    GridModule,
    ContainerComponent,
    ProductoCrudFormComponent,
  ],
})
export class ProductoInsertarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _ProductosService = inject(ProductosService);
  private _Router = inject(Router);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;

  FormsValues(producto: Producto) {
    logger.log(producto);
    this._HelpersService.loaderSweetAlert({
      title: 'Agregando producto',
      text: 'Esto puede demorar un momento.',
    });

    this._ProductosService
      .createProducto(producto)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data) => {
        this.loader = false;
        logger.log(data);
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Producto agregado con éxito',
            icon: 'success',
          })
          .then((result) => {
            this._Router.navigateByUrl(`/productos`);
            // this._Router.navigateByUrl(`/productos/editar/${data.producto.id}`);
          });
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
