import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule, ColorModeService, GridModule } from '@coreui/angular';
import logger from 'src/app/shared/utils/logger';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
// import { EmpleadoCrudFormComponent } from '../../../shared/components/forms/empleado-crud-form/empleado-crud-form.component';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { HelpersService } from '../../../services/helpers.service';
import { GastoCrudFormComponent } from '../../../shared/components/forms/gasto-crud-form/gasto-crud-form.component';
import { GastoService } from '../../../services/gasto.service';
import { Gasto } from '../../../models/Gasto.model';
import { HttpErrorResponse } from '@angular/common/http';
import { VentasProductosCrudFormComponent } from 'src/app/shared/components/forms/ventas-productos-crud-form/ventas-productos-crud-form.component';

@Component({
  selector: 'app-ventas-productos-insertar',
  standalone: true,
  imports: [
    CardModule,
    GridModule,
    VentasProductosCrudFormComponent,
    VentasProductosCrudFormComponent,
  ],
  templateUrl: './ventas-productos-insertar.component.html',
  styleUrl: './ventas-productos-insertar.component.scss',
})
export class VentasProductosInsertarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _GastoService = inject(GastoService);
  private _Router = inject(Router);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;

  FormsValues(Gasto: Gasto) {
    logger.log(Gasto);
    this._HelpersService.loaderSweetAlert({
      title: 'Agregando gasto',
      text: 'Esto puede demorar un momento.',
    });

    this._GastoService
      .createGasto(Gasto)
      .pipe(
        takeUntil(this.destruir$),
        catchError((error: HttpErrorResponse) => {
          Swal.mixin({
            customClass: {
              container: this.#colorModeService.getStoredTheme(
                environment.SabinosTheme
              ),
            },
          }).fire({
            text: 'Contraseña incorrecta',
            icon: 'info',
          });
          return throwError(() => error);
        })
      )
      .subscribe((response) => {
        this.loader = false;
        logger.log(response);
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Gasto agregado con éxito',
            icon: 'success',
          })
          .then((result) => {
            this._Router.navigateByUrl(`/gastos`);
          });
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
