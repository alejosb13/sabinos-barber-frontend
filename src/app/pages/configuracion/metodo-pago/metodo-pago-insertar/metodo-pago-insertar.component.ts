import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule, ColorModeService, GridModule } from '@coreui/angular';
import { Empleado } from 'src/app/models/Empleado.model';
import { EmpleadosService } from 'src/app/services/empleados.service';
import logger from 'src/app/shared/utils/logger';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
// import { EmpleadoCrudFormComponent } from '../../../shared/components/forms/empleado-crud-form/empleado-crud-form.component';
import { Subject, takeUntil } from 'rxjs';
import { HelpersService } from '../../../../services/helpers.service';
import { MetodoPago } from '../../../../models/MetodoPago.model';
import { MetodoPagoService } from '../../../../services/metodos_pago.service';
import { MetodoPagoCrudFormComponent } from '../../../../shared/components/forms/metodo-pago-crud-form/metodo-pago-crud-form.component';

@Component({
  selector: 'app-metodo-pago-insertar',
  standalone: true,
  imports: [CardModule, GridModule, MetodoPagoCrudFormComponent],
  templateUrl: './metodo-pago-insertar.component.html',
  styleUrl: './metodo-pago-insertar.component.scss',
})
export class MetodoPagoInsertarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _MetodoPagoService = inject(MetodoPagoService);
  private _Router = inject(Router);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this._Router.navigateByUrl(`/ajustes/metodo-pago/editar/6`);
  }
  FormsValues(MetodoPago: MetodoPago) {
    logger.log(MetodoPago);
    this._HelpersService.loaderSweetAlert({
      title: 'Agregando método pago',
      text: 'Esto puede demorar un momento.',
    });

    this._MetodoPagoService
      .createMetodoPago(MetodoPago)
      .pipe(takeUntil(this.destruir$))
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
            text: 'Método de pago agregado con éxito',
            icon: 'success',
          })
          .then((result) => {
            // this._Router.navigateByUrl(
            //   `/ajustes/metodo-pago/editar/${response.id}`
            // );
            this._Router.navigateByUrl(`/ajustes/metodo-pago`);
          });
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
