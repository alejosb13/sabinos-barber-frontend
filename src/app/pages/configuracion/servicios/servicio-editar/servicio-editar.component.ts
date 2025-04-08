import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CardModule,
  ColorModeService,
  GridModule,
  SpinnerComponent,
} from '@coreui/angular';
import { Cliente } from 'src/app/models/Cliente.model';
import { ClientesService } from 'src/app/services/clientes.service';
import logger from 'src/app/shared/utils/logger';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { catchError, pipe, Subject, takeUntil, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HelpersService } from '../../../../services/helpers.service';
import { Servicios } from '../../../../models/Servicios.model';
import { ServicioService } from '../../../../services/servicios.service';
import { ServicioCrudFormComponent } from '../../../../shared/components/forms/servicio-crud-form/servicio-crud-form.component';

@Component({
  selector: 'app-servicio-editar',
  standalone: true,
  imports: [
    CardModule,
    GridModule,
    ServicioCrudFormComponent,
    SpinnerComponent,
  ],
  templateUrl: './servicio-editar.component.html',
  styleUrl: './servicio-editar.component.scss',
})
export class ServicioEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _ServicioService = inject(ServicioService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;
  Id!: number;
  Servicio!: Servicios;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getClienteById();
  }

  FormsValues(ServicioResponse: Servicios) {
    logger.log(ServicioResponse);

    // this.loader = true;
    this._HelpersService.loaderSweetAlert({
      title: 'Actualizando servicio',
      text: 'Esto puede demorar un momento.',
    });
    this._ServicioService
      .updateServicio(this.Id, ServicioResponse)
      .pipe(
        catchError((error) =>
          this._HelpersService.handleErrorApiCrud(
            error,
            'No se pudo actualizar el servicio.'
          )
        )
      )
      .subscribe((data) => {
        this.loader = false;
        // logger.log(data);
        this.Servicio = data.Cliente;
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Servicio modificado con éxito',
            icon: 'success',
          })
          .then((result) => {
            logger.log(result);
          });
      });
  }

  getClienteById() {
    this._ServicioService
      .getServicioById(this.Id)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Servicios) => {
        this.loader = false;
        this.Servicio = { ...data };
        logger.log(data);
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
