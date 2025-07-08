import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule, ColorModeService, GridModule } from '@coreui/angular';
import { Empleado } from 'src/app/models/Empleado.model';
import { EmpleadosService } from 'src/app/services/empleados.service';
import logger from 'src/app/shared/utils/logger';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { EmpleadoCrudFormComponent } from '../../../shared/components/forms/empleado-crud-form/empleado-crud-form.component';
import { catchError, Subject, takeUntil } from 'rxjs';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-empleado-insertar',
  standalone: true,
  imports: [CardModule, GridModule, EmpleadoCrudFormComponent],
  templateUrl: './empleado-insertar.component.html',
  styleUrl: './empleado-insertar.component.scss',
})
export class EmpleadoInsertarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _EmpleadosService = inject(EmpleadosService);
  private _Router = inject(Router);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;

  FormsValues(Empleado: Empleado) {
    logger.log(Empleado);
    this._HelpersService.loaderSweetAlert({
      title: 'Agregando empleado',
      text: 'Esto puede demorar un momento.',
    });

    this._EmpleadosService
      .createEmpleado(Empleado)
      .pipe(
        takeUntil(this.destruir$),
        catchError((error) =>
          this._HelpersService.handleErrorApiCrud(
            error,
            'No se pudo guardar el empleado.'
          )
        )
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
            text: 'Empleado agregado con éxito',
            icon: 'success',
          })
          .then((result) => {
            // this._Router.navigateByUrl(`/empleados/editar/${response.data.id}`);
            this._Router.navigateByUrl(`/empleados`);
          });
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
