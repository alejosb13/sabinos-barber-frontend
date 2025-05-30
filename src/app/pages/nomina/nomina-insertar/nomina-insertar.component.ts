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
import { HelpersService } from '../../../services/helpers.service';
import { NominaCrudFormComponent } from '../../../shared/components/forms/nomina-crud-form/nomina-crud-form.component';
import { NominaService } from '../../../services/nomina.service';
import { Nomina } from '../../../models/Nomina.model';
import { NominaSeleccionEmpleadoFormComponent } from '../../../shared/components/forms/nomina-seleccion-empleado-form/nomina-seleccion-empleado-form.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-nomina-insertar',
  standalone: true,
  imports: [
    CardModule,
    GridModule,
    NominaCrudFormComponent,
    NominaSeleccionEmpleadoFormComponent,
    CommonModule,
  ],
  templateUrl: './nomina-insertar.component.html',
  styleUrl: './nomina-insertar.component.scss',
})
export class NominaInsertarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  _NominaService = inject(NominaService);
  private _Router = inject(Router);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;
  NominaEmpleadoSelecion: any = null;

  FormsValues(Nomina: Nomina) {
    logger.log(Nomina);
    this._HelpersService.loaderSweetAlert({
      title: 'Agregando nomina',
      text: 'Esto puede demorar un momento.',
    });

    this._NominaService
      .createNomina(Nomina)
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
            text: 'Nomina agregada con éxito',
            icon: 'success',
          })
          .then((result) => {
            this._Router.navigateByUrl(`/nominas/editar/${response.id}`);
          });
      });
  }

  triggerNominaEmpleado(Nomina: any) {
    logger.log('triggerNominaEmpleado nominaevent', Nomina);
    this.NominaEmpleadoSelecion = Nomina;
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
