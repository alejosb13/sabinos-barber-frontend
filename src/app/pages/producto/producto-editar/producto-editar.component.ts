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

@Component({
  selector: 'app-producto-editar',
  standalone: true,
  templateUrl: './producto-editar.component.html',
  styleUrl: './producto-editar.component.scss',
  imports: [
    CardModule,
    GridModule,
    ProductoCrudFormComponent,
    SpinnerComponent,
  ],
})
export class ProductoEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _ProductosService = inject(ProductosService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;
  Id!: number;
  Producto!: Producto;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getProductoById();
  }

  FormsValues(producto: Producto) {
    logger.log(producto);

    this._HelpersService.loaderSweetAlert({
      title: 'Actualizando producto',
      text: 'Esto puede demorar un momento.',
    });

    // this.loader = true;

    this._ProductosService
      .updateProducto(this.Id, producto)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data) => {
        this.loader = false;
        // console.log(data);
        this.Producto = data.producto;
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

  getProductoById() {
    this._ProductosService
      .getProductoById(this.Id)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Producto) => {
        this.loader = false;
        this.Producto = { ...data };
        logger.log(data);
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
